// services/services.service.ts (atualizado)
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ServicesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createService(name: string) {
    if (!name) {
      throw new BadRequestException('O nome do serviço é obrigatório.');
    }

    const { data, error } = await this.supabaseService.supabase
      .from('services')
      .insert({ name })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }
    return data;
  }

  async assignServiceToPhysiotherapist(
    physiotherapist_id: string,
    service_id: string,
    price: number,
  ) {
    if (price <= 0) {
      throw new BadRequestException('O preço deve ser maior que zero.');
    }

    const service = await this.supabaseService.find('services', {
      id: service_id,
    });
    if (!service.length) {
      throw new BadRequestException('Serviço não encontrado.');
    }

    const physiotherapist = await this.supabaseService.find('users', {
      id: physiotherapist_id,
      role: 'physiotherapist',
    });
    if (!physiotherapist.length) {
      throw new BadRequestException('Fisioterapeuta não encontrado.');
    }

    const { data, error } = await this.supabaseService.supabase
      .from('physiotherapists_services')
      .insert({
        physiotherapist_id,
        service_id,
        price,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao associar serviço: ${error.message}`);
    }
    return data;
  }

  async getAllServices() {
    const { data, error } = await this.supabaseService.supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }
    return data;
  }

  async getPhysiotherapistServices(physiotherapist_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('physiotherapists_services')
      .select('*, services(name)')
      .eq('physiotherapist_id', physiotherapist_id);

    if (error) {
      throw new Error(
        `Erro ao buscar serviços do fisioterapeuta: ${error.message}`,
      );
    }
    return data;
  }

  async updateServicePrice(id: string, price: number) {
    if (price <= 0) {
      throw new BadRequestException('O preço deve ser maior que zero.');
    }

    const { data, error } = await this.supabaseService.supabase
      .from('physiotherapists_services')
      .update({ price })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar preço do serviço: ${error.message}`);
    }
    return data;
  }

  // Nova função: Obter todos os fisioterapeutas para um serviço
  async getPhysiotherapistsByService(service_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('physiotherapists_services')
      .select('*, physiotherapist:users(id, full_name, avatar_url, city)')
      .eq('service_id', service_id);

    if (error) {
      throw new Error(
        `Erro ao buscar fisioterapeutas para o serviço: ${error.message}`,
      );
    }
    return data.map((entry) => ({
      physiotherapist_id: entry.physiotherapist.id,
      full_name: entry.physiotherapist.full_name,
      avatar_url: entry.physiotherapist.avatar_url,
      city: entry.physiotherapist.city,
      price: entry.price,
    }));
  }
}
