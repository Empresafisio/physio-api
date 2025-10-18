import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AvailabilityService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async saveAvailability(
    physiotherapist_id: string,
    availability: {
      day_of_week: string;
      start_time: string;
      end_time: string;
    }[],
  ) {
    // Busca a disponibilidade existente para o fisioterapeuta
    const existingAvailability = await this.supabaseService.find(
      'physiotherapists_availability',
      { physiotherapist_id },
    );

    // Mapeia a disponibilidade existente por dia da semana
    const existingDays = new Set(
      existingAvailability.map((entry) => entry.day_of_week),
    );

    for (const entry of availability) {
      if (existingDays.has(entry.day_of_week)) {
        // Atualiza horários existentes para o mesmo dia
        await this.supabaseService.supabase
          .from('physiotherapists_availability')
          .update({
            start_time: entry.start_time,
            end_time: entry.end_time,
          })
          .eq('physiotherapist_id', physiotherapist_id)
          .eq('day_of_week', entry.day_of_week);
      } else {
        // Insere novos horários para dias não existentes
        await this.supabaseService.supabase
          .from('physiotherapists_availability')
          .insert({
            physiotherapist_id,
            day_of_week: entry.day_of_week,
            start_time: entry.start_time,
            end_time: entry.end_time,
          });
      }
    }

    return { message: 'Disponibilidade atualizada com sucesso!' };
  }

  async getAvailability(physiotherapist_id: string) {
    return this.supabaseService.find('physiotherapists_availability', {
      physiotherapist_id,
    });
  }

  async getAvailabilityByDay(physiotherapist_id: string, day_of_week: string) {
    return this.supabaseService.find('physiotherapists_availability', {
      physiotherapist_id,
      day_of_week,
    });
  }
}
