import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import axios from 'axios';

const VENDUS_API_URL = process.env.VENDUS_API_URL;
const VENDUS_API_TOKEN = process.env.VENDUS_API_TOKEN;

@Injectable()
export class PaymentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Criar pagamento e sincronizar com Vendus
  async createPayment(
    user_id: string,
    appointment_id: string,
    amount: number,
    payment_method: string,
  ) {
    // Primeiro, registramos o pagamento no nosso banco
    const { data: paymentData, error: paymentError } =
      await this.supabaseService.supabase
        .from('payments')
        .insert({
          user_id,
          appointment_id,
          amount,
          status: 'pending',
          payment_method,
        })
        .select()
        .single();

    if (paymentError)
      throw new Error(`Erro ao registrar pagamento: ${paymentError.message}`);

    // Criar pagamento na Vendus
    try {
      const vendusResponse = await axios.post(`${VENDUS_API_URL}/payments`, {
        api_key: VENDUS_API_TOKEN,
        customer_id: user_id, // O ID do cliente deve estar na Vendus
        amount,
        description: `Pagamento da consulta ${appointment_id}`,
      });

      // Atualizar o pagamento no banco com o ID da transação Vendus
      await this.supabaseService.supabase
        .from('payments')
        .update({ transaction_id: vendusResponse.data.id, status: 'paid' })
        .eq('id', paymentData.id);

      return {
        message: 'Pagamento realizado com sucesso!',
        payment: vendusResponse.data,
      };
    } catch (error) {
      console.error(
        'Erro ao processar pagamento na Vendus:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao processar pagamento na Vendus');
    }
  }

  // Criar fatura na Vendus e associar ao pagamento
  async generateInvoice(payment_id: string) {
    // Buscar o pagamento no banco
    const { data: payment, error: fetchError } =
      await this.supabaseService.supabase
        .from('payments')
        .select()
        .eq('id', payment_id)
        .single();

    if (fetchError || !payment) throw new Error('Pagamento não encontrado');

    // Criar fatura na Vendus
    try {
      const invoiceResponse = await axios.post(`${VENDUS_API_URL}/invoices`, {
        api_key: VENDUS_API_TOKEN,
        customer_id: payment.user_id,
        items: [
          { description: `Consulta`, price: payment.amount, quantity: 1 },
        ],
      });

      // Atualizar o pagamento com o ID da fatura
      await this.supabaseService.supabase
        .from('payments')
        .update({ vendus_invoice_id: invoiceResponse.data.id })
        .eq('id', payment_id);

      return {
        message: 'Fatura gerada com sucesso!',
        invoice: invoiceResponse.data,
      };
    } catch (error) {
      console.error(
        'Erro ao gerar fatura na Vendus:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao gerar fatura');
    }
  }

  // Verificar status de pagamento na Vendus
  async checkPaymentStatus(payment_id: string) {
    // Buscar o pagamento localmente
    const { data: payment, error } = await this.supabaseService.supabase
      .from('payments')
      .select()
      .eq('id', payment_id)
      .single();

    if (error || !payment) throw new Error('Pagamento não encontrado');

    // Consultar status na Vendus
    try {
      const response = await axios.get(
        `${VENDUS_API_URL}/payments/${payment.transaction_id}`,
        {
          params: { api_key: VENDUS_API_TOKEN },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao verificar pagamento na Vendus:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao verificar pagamento');
    }
  }
  // Obter o valor total que um fisioterapeuta vai receber por mês
  async getPhysiotherapistEarnings(
    physiotherapist_id: string,
    year: number,
    month: number,
  ) {
    // Validar entrada
    if (!physiotherapist_id || !year || !month || month < 1 || month > 12) {
      throw new BadRequestException('Parâmetros inválidos.');
    }

    // Criar intervalo de datas para o mês especificado
    const startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    // Buscar todos os agendamentos do fisioterapeuta no mês especificado
    const { data: appointments, error: appointmentsError } =
      await this.supabaseService.supabase
        .from('appointments')
        .select('id, price, status')
        .eq('physiotherapist_id', physiotherapist_id)
        .gte('appointment_date', startDate.toISOString())
        .lte('appointment_date', endDate.toISOString());

    if (appointmentsError) {
      throw new Error(
        `Erro ao buscar agendamentos: ${appointmentsError.message}`,
      );
    }

    // Filtrar apenas agendamentos concluídos ('completed') e calcular o total
    let totalEarnings = 0;
    const appointmentIds = appointments
      .filter((appointment) => appointment.status === 'completed')
      .map((appointment) => appointment.id);

    if (appointmentIds.length === 0) {
      return { physiotherapist_id, month, year, total_earnings: 0 };
    }

    // Buscar pagamentos associados aos agendamentos concluídos
    const { data: payments, error: paymentsError } =
      await this.supabaseService.supabase
        .from('payments')
        .select('amount, status')
        .in('appointment_id', appointmentIds)
        .eq('status', 'paid');

    if (paymentsError) {
      throw new Error(`Erro ao buscar pagamentos: ${paymentsError.message}`);
    }

    // Somar o valor dos pagamentos
    totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      physiotherapist_id,
      month,
      year,
      total_earnings: totalEarnings,
      appointment_count: appointments.length,
      payment_count: payments.length,
    };
  }
}
