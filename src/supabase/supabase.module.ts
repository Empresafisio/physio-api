import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Importa ConfigModule para acessar variáveis do .env
  providers: [SupabaseService],
  exports: [SupabaseService], // Exporta SupabaseService para ser usado em outros módulos
})
export class SupabaseModule {}
