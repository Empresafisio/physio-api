import { Controller, Post, Patch, Get, Body, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post('schedule')
  schedule(
    @Body()
    body: {
      user_id: string;
      physiotherapist_id: string;
      service_id: string;
      price: number;
      appointment_date: string;
      address: string;
      city: string;
      postal_code: string;
    },
  ) {
    return this.service.schedule(
      body.user_id,
      body.physiotherapist_id,
      body.service_id,
      body.price,
      body.appointment_date,
      body.address,
      body.city,
      body.postal_code,
    );
  }

  @Get('user/:user_id')
  findByUser(@Param('user_id') user_id: string) {
    return this.service.findByUser(user_id);
  }

  // Atualizar estado do appointment
  @Patch('status/:appointment_id')
  updateStatus(
    @Param('appointment_id') appointment_id: string,
    @Body('status') status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  ) {
    return this.service.updateStatus(appointment_id, status);
  }

  // Obter appointments por fisioterapeuta
  @Get('physiotherapist/:physiotherapist_id')
  findByPhysiotherapist(
    @Param('physiotherapist_id') physiotherapist_id: string,
  ) {
    return this.service.findByPhysiotherapist(physiotherapist_id);
  }

  // Obter appointment por ID
  @Get(':appointment_id')
  findById(@Param('appointment_id') appointment_id: string) {
    return this.service.findById(appointment_id);
  }
}
