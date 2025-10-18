// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // LOGIN
  async login(email: string, password: string) {
    console.log('📩 [AuthService] Email recebido no login:', email);
    console.log(
      '🔑 [AuthService] Password recebida (NÃO DEV EM PROD):',
      password,
    );

    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error('❌ [AuthService] Erro no login do Supabase:', error);
      throw new Error(`Credenciais inválidas: ${error.message}`);
    }

    console.log('✅ [AuthService] Login bem-sucedido no Supabase:', data);

    if (!data.user) {
      console.error('⚠️ [AuthService] Nenhum user retornado no login!');
      throw new Error('Usuário não encontrado após login.');
    }

    // Buscar metadados extras na tabela "users"
    console.log(
      '🔍 [AuthService] A procurar user extra na tabela users com id:',
      data.user.id,
    );
    const { data: userExtra, error: userExtraError } =
      await this.supabaseService.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (userExtraError) {
      console.error(
        '⚠️ [AuthService] Erro ao buscar user extra:',
        userExtraError,
      );
    } else {
      console.log('✅ [AuthService] User extra encontrado:', userExtra);
    }

    const finalUser = {
      id: data.user.id,
      email: data.user.email,
      role: userExtra?.role || data.user.user_metadata?.role || 'unknown',
      ...userExtra,
    };

    console.log(
      '📦 [AuthService] Final user object retornado para o frontend:',
      finalUser,
    );

    return {
      access_token: data.session?.access_token,
      user: finalUser,
    };
  }

  // REGISTER
  async register(userData: any) {
    const { email, password, ...otherData } = userData;

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } =
      await this.supabaseService.supabase.auth.signUp({
        email,
        password,
        options: {
          data: otherData, // 👈 garante que os metadados ficam no user_metadata
        },
      });

    if (authError) {
      throw new Error(`Erro ao registrar usuário: ${authError.message}`);
    }

    // Inserir também na tabela `users`
    const { data: userDataInserted, error: userError } =
      await this.supabaseService.supabase
        .from('users')
        .insert({ id: authData.user?.id, email, ...otherData })
        .select()
        .single();

    if (userError) {
      throw new Error(`Erro ao salvar informações: ${userError.message}`);
    }

    return {
      message: 'Usuário registrado com sucesso!',
      access_token: authData.session?.access_token,
      refresh_token: authData.session?.refresh_token,
      user: userDataInserted,
    };
  }

  // GET USER BY TOKEN
  async getUser(token: string) {
    const { data, error } =
      await this.supabaseService.supabase.auth.getUser(token);

    if (error) {
      throw new Error(`Erro ao obter usuário autenticado: ${error.message}`);
    }

    return data.user;
  }
}
