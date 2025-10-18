import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async schedule(
    user_id: string,
    physiotherapist_id: string,
    service_id: string,
    price: number,
    appointment_date: string,
    address: string,
    city: string,
    postal_code: string,
  ) {
    return this.supabaseService.insert('appointments', {
      user_id,
      physiotherapist_id,
      service_id,
      price,
      appointment_date,
      status: 'pending',
      address,
      city,
      postal_code,
    });
  }

  // Atualizar o estado do appointment
  async updateStatus(
    appointment_id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  ) {
    return this.supabaseService.update(
      'appointments',
      { status },
      { id: appointment_id },
    );
  }

  // Obter appointments por usuário
  async findByUser(user_id: string) {
    return this.supabaseService.find('appointments', { user_id });
  }

  // Obter appointments por fisioterapeuta
  async findByPhysiotherapist(physiotherapist_id: string) {
    return this.supabaseService.find('appointments', { physiotherapist_id });
  }

  // Obter appointment por ID
  async findById(appointment_id: string) {
    return this.supabaseService.find('appointments', { id: appointment_id });
  }
}
