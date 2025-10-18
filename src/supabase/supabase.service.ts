import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const SUPABASE_URL = this.configService.get<string>('SUPABASE_URL');
    const SUPABASE_KEY = this.configService.get<string>('SUPABASE_KEY');

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('SUPABASE_URL e SUPABASE_KEY são obrigatórios.');
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // 🔐 Autenticar utilizador
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(`Erro ao autenticar: ${error.message}`);
    return data;
  }

  // 👤 Registar novo utilizador com metadados
  async signUp(email: string, password: string, metadata: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw new Error(`Erro ao registar: ${error.message}`);
    return data;
  }

  // 📋 Obter utilizador atual
  async getUser(session?: Session) {
    const { data, error } = await this.supabase.auth.getUser(
      session?.access_token,
    );
    if (error) throw new Error(`Erro ao obter utilizador: ${error.message}`);
    return data;
  }

  // 🚪 Logout
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(`Erro ao terminar sessão: ${error.message}`);
  }

  // 📄 Inserção genérica
  async insert(table: string, data: any) {
    const { data: insertedData, error } = await this.supabase
      .from(table)
      .insert(data);
    if (error) throw new Error(error.message);
    return insertedData;
  }

  // 🛠️ Atualização genérica
  async update(table: string, data: any, filters: object) {
    let query = this.supabase.from(table).update(data);
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    const { data: updatedData, error } = await query.select();
    if (error) throw new Error(error.message);
    return updatedData;
  }

  // 🔍 Consulta genérica
  async find(table: string, filters = {}) {
    let query = this.supabase.from(table).select('*');
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }
}
