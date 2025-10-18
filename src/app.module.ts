import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Permite que o ConfigService esteja disponível globalmente
    SupabaseModule,
    AuthModule,
    AppointmentsModule,
    AvailabilityModule,
    PaymentsModule,
    UsersModule,
    ReviewsModule,
    ServicesModule,
  ],
})
export class AppModule {}
