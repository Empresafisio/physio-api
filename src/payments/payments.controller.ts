import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  // Criar pagamento e sincronizar com Vendus
  @Post('create')
  async createPayment(
    @Body()
    body: {
      user_id: string;
      appointment_id: string;
      amount: number;
      payment_method: string;
    },
  ) {
    return this.service.createPayment(
      body.user_id,
      body.appointment_id,
      body.amount,
      body.payment_method,
    );
  }

  // Criar fatura na Vendus
  @Post('invoice/:payment_id')
  async generateInvoice(@Param('payment_id') payment_id: string) {
    return this.service.generateInvoice(payment_id);
  }

  // Verificar status do pagamento
  @Get('status/:payment_id')
  async checkPaymentStatus(@Param('payment_id') payment_id: string) {
    return this.service.checkPaymentStatus(payment_id);
  }
  @Get('physiotherapist/:physiotherapist_id/earnings/:year/:month')
  getPhysiotherapistEarnings(
    @Param('physiotherapist_id') physiotherapist_id: string,
    @Param('year') year: number,
    @Param('month') month: number,
  ) {
    return this.service.getPhysiotherapistEarnings(
      physiotherapist_id,
      year,
      month,
    );
  }
}
