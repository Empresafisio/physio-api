// reviews/reviews.service.ts (atualizado)
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async validateAppointment(
    appointment_id: string,
    patient_id: string,
    physiotherapist_id: string,
  ) {
    const appointment = await this.supabaseService.find('appointments', {
      id: appointment_id,
      user_id: patient_id,
      physiotherapist_id,
    });

    if (!appointment.length) {
      throw new BadRequestException('Agendamento inválido ou não encontrado.');
    }

    const appointmentDate = new Date(appointment[0].appointment_date);
    const now = new Date();
    if (appointmentDate > now) {
      throw new BadRequestException(
        'Avaliações só podem ser feitas após o agendamento.',
      );
    }

    return appointment[0];
  }

  // Função auxiliar para atualizar o average_rating
  private async updatePhysiotherapistAverageRating(physiotherapist_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('reviews_patients')
      .select('rating')
      .eq('physiotherapist_id', physiotherapist_id);

    if (error) {
      throw new Error(`Erro ao calcular média de rating: ${error.message}`);
    }

    const average = data.length
      ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
      : 0;

    const { error: updateError } = await this.supabaseService.supabase
      .from('users')
      .update({ average_rating: average })
      .eq('id', physiotherapist_id);

    if (updateError) {
      throw new Error(
        `Erro ao atualizar average_rating: ${updateError.message}`,
      );
    }
  }

  async createPatientReview(
    appointment_id: string,
    physiotherapist_id: string,
    patient_id: string,
    rating: number,
    comment?: string,
  ) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('O rating deve estar entre 1 e 5.');
    }

    await this.validateAppointment(
      appointment_id,
      patient_id,
      physiotherapist_id,
    );

    const { data, error } = await this.supabaseService.supabase
      .from('reviews_patients')
      .insert({
        appointment_id,
        physiotherapist_id,
        patient_id,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar avaliação do paciente: ${error.message}`);
    }

    // Atualiza o average_rating do fisioterapeuta após criar a review
    await this.updatePhysiotherapistAverageRating(physiotherapist_id);

    return data;
  }

  async createPhysiotherapistReview(
    appointment_id: string,
    physiotherapist_id: string,
    patient_id: string,
    observations: string,
    alert: boolean = false,
  ) {
    await this.validateAppointment(
      appointment_id,
      patient_id,
      physiotherapist_id,
    );

    const { data, error } = await this.supabaseService.supabase
      .from('reviews_physiotherapists')
      .insert({
        appointment_id,
        physiotherapist_id,
        patient_id,
        observations,
        alert,
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Erro ao criar avaliação do fisioterapeuta: ${error.message}`,
      );
    }
    return data;
  }

  async getPhysiotherapistReviews(physiotherapist_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('reviews_patients')
      .select('*')
      .eq('physiotherapist_id', physiotherapist_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(
        `Erro ao buscar avaliações do fisioterapeuta: ${error.message}`,
      );
    }
    return data;
  }

  async getPatientReviews(patient_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('reviews_physiotherapists')
      .select('*')
      .eq('patient_id', patient_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(
        `Erro ao buscar avaliações do paciente: ${error.message}`,
      );
    }
    return data;
  }

  async getPhysiotherapistAverageRating(physiotherapist_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('users')
      .select('average_rating')
      .eq('id', physiotherapist_id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar average_rating: ${error.message}`);
    }

    const reviews = await this.supabaseService.supabase
      .from('reviews_patients')
      .select('rating')
      .eq('physiotherapist_id', physiotherapist_id);

    return {
      average: data.average_rating || 0,
      count: reviews.data?.length || 0,
    };
  }
}
