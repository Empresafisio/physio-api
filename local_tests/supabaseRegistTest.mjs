import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rdlodafyzartzuhqzqph.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG9kYWZ5emFydHp1aHF6cXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMzU2MjgsImV4cCI6MjA1MjcxMTYyOH0.YlGw8lqE4gruAK4qVrJf9LSFXg0NsUwHcXPyNxtAlCA';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const registerUser = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'leo.m.rosa@gmail.com',
    password: 'SenhaSegura123',
    options: {
      data: {
        full_name: 'leonardo Rosa',
        phone: '912345679',
        address: 'Rua das Flores, 124',
        city: 'Lisboa',
        postal_code: '1000-210',
        nif: '123456889',
        role: 'patient',
      },
    },
  });

  if (error) {
    console.error('❌ Erro ao registar usuário:', error.message);
  } else {
    console.log('✅ Usuário criado no auth.users:', data.user);
  }
};

registerUser();
