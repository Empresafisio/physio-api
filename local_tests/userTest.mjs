import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rdlodafyzartzuhqzqph.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG9kYWZ5emFydHp1aHF6cXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMzU2MjgsImV4cCI6MjA1MjcxMTYyOH0.YlGw8lqE4gruAK4qVrJf9LSFXg0NsUwHcXPyNxtAlCA'; // Substituir pela tua Service Role Key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const testUserCreation = async () => {
  console.log('🚀 Iniciando teste de criação de usuário...');

  const { data, error } = await supabase.auth.signUp({
    email: 'goncalocaroca@gmail.com',
    password: 'SenhaSegura123',
    options: {
      // 🔹 IMPORTANTE: `options` precisa ser usado para enviar `data`
      data: {
        full_name: 'Gonçalo Caroça',
        phone: '912345678',
        address: 'Rua das Flores, 123',
        city: 'Lisboa',
        postal_code: '1000-200',
        nif: '123456789',
        role: 'patient',
      },
    },
  });

  if (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    return;
  }

  console.log('✅ Usuário criado no auth.users:', data.user);

  // 2️⃣ Aguardar alguns segundos para garantir que o trigger foi executado
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 3️⃣ Verificar se o usuário foi inserido na tabela `users`
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError) {
    console.error(
      '❌ Erro ao buscar usuário na tabela users:',
      userError.message,
    );
  } else {
    console.log('✅ Usuário encontrado na tabela users:', userData);
  }
};

// Executar o teste
testUserCreation();
