import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private getClientWithToken(jwt: string): SupabaseClient {
    return createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      },
    );
  }

  // 1️⃣ Obter um usuário pelo ID autenticado com JWT
  async getUserById(userId: string, jwt: string) {
    const client = this.getClientWithToken(jwt);
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    return data;
  }

  // 2️⃣ Atualizar dados do usuário autenticado
  async updateUser(userId: string, jwt: string, updates: any) {
    const client = this.getClientWithToken(jwt);
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
    return data;
  }
}
