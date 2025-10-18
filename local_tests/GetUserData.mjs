import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rdlodafyzartzuhqzqph.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG9kYWZ5emFydHp1aHF6cXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMzU2MjgsImV4cCI6MjA1MjcxMTYyOH0.YlGw8lqE4gruAK4qVrJf9LSFXg0NsUwHcXPyNxtAlCA';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getUserData = async () => {
  // 1️⃣ Autenticar usuário
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: 'leo.m.rosa@gmail.com',
      password: 'SenhaSegura123',
    });

  if (authError) {
    console.error('❌ Erro ao autenticar usuário:', authError.message);
    return;
  }

  console.log('✅ Usuário autenticado!');

  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Erro ao obter usuário autenticado:', error.message);
  } else {
    console.log('Usuário autenticado:', user);
  }

  // 2️⃣ Fazer a requisição diretamente no mesmo cliente autenticado
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) {
    console.error(
      '❌ Erro ao buscar usuário na tabela users:',
      userError.message,
    );
  } else {
    console.log('✅ Dados do usuário:', userData);
  }
};

getUserData();
