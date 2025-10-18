// dbTestFunctions.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';
export const testCreatePatient = async () => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      name: 'Gonçalo Caroça',
      email: 'goncalocaroca@gmail.com',
      password: 'senhaSegura123',
      phone: '+351912345678',
      address: 'Rua das Flores, 123',
      city: 'Lisboa',
      postal_code: '1000-001',
      nif: '123456789',
      role: 'patient',
    });
    console.log('Paciente criado com sucesso:', response.data);
  } catch (error) {
    console.error(
      'Erro ao criar paciente:',
      error.response?.data || error.message,
    );
  }
};

// 2️⃣ Testar criação de usuário (Fisioterapeuta)
export const testCreatePhysiotherapist = async () => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      password: 'senhaForte456',
      phone: '+351917654321',
      address: 'Avenida Central, 456',
      city: 'Porto',
      postal_code: '4000-002',
      nif: '987654321',
      role: 'physiotherapist',
    });
    console.log('Fisioterapeuta criado com sucesso:', response.data);
  } catch (error) {
    console.error(
      'Erro ao criar fisioterapeuta:',
      error.response?.data || error.message,
    );
  }
};

// 3️⃣ Testar criação de usuário (Administrador)
export const testCreateAdmin = async () => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@example.com',
      password: 'adminSuper123',
      phone: '+351915432876',
      address: 'Rua do Comércio, 789',
      city: 'Coimbra',
      postal_code: '3000-003',
      nif: '111222333',
      role: 'admin',
    });
    console.log('Administrador criado com sucesso:', response.data);
  } catch (error) {
    console.error(
      'Erro ao criar administrador:',
      error.response?.data || error.message,
    );
  }
};
// Testar criação de agendamento
export const testCreateAppointment = async () => {
  try {
    const response = await axios.post(`${API_URL}/appointments/schedule`, {
      user_id: 'user-123',
      physiotherapist_id: 'physio-456',
      service_id: 'service-789',
      price: 50.0,
      appointment_date: '2024-06-15T10:00:00Z',
      address: 'Rua Principal, 123',
      city: 'Lisboa',
      postal_code: '1000-200',
    });
    console.log('Agendamento criado:', response.data);
  } catch (error) {
    console.error(
      'Erro ao criar agendamento:',
      error.response?.data || error.message,
    );
  }
};

// Testar atualização do status do agendamento
export const testUpdateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/appointments/status/${appointmentId}`,
      { status },
    );
    console.log('Status atualizado:', response.data);
  } catch (error) {
    console.error(
      'Erro ao atualizar status:',
      error.response?.data || error.message,
    );
  }
};

// Testar obtenção de agendamentos por paciente
export const testGetAppointmentsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/appointments/user/${userId}`);
    console.log('Agendamentos do paciente:', response.data);
  } catch (error) {
    console.error(
      'Erro ao obter agendamentos:',
      error.response?.data || error.message,
    );
  }
};

// Testar obtenção de disponibilidade de um fisioterapeuta
export const testGetAvailability = async (physiotherapistId) => {
  try {
    const response = await axios.get(
      `${API_URL}/availability/${physiotherapistId}`,
    );
    console.log('Disponibilidade do fisioterapeuta:', response.data);
  } catch (error) {
    console.error(
      'Erro ao obter disponibilidade:',
      error.response?.data || error.message,
    );
  }
};

// Testar salvar disponibilidade
export const testSaveAvailability = async (physiotherapistId, availability) => {
  try {
    const response = await axios.post(
      `${API_URL}/availability/save/${physiotherapistId}`,
      { availability },
    );
    console.log('Disponibilidade salva:', response.data);
  } catch (error) {
    console.error(
      'Erro ao salvar disponibilidade:',
      error.response?.data || error.message,
    );
  }
};

// Testar login de usuário
export const testAuthLogin = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email });
    console.log('Login realizado com sucesso:', response.data);
  } catch (error) {
    console.error(
      'Erro ao fazer login:',
      error.response?.data || error.message,
    );
  }
};

// Testar criação de pagamento
/*export const testCreatePayment = async () => {
  try {
    const response = await axios.post(`${API_URL}/payments/create`, {
      user_id: 'user-123',
      appointment_id: 'appointment-456',
      amount: 50.0,
      payment_method: 'mbway',
    });
    console.log('Pagamento criado:', response.data);
  } catch (error) {
    console.error(
      'Erro ao criar pagamento:',
      error.response?.data || error.message,
    );
  }
};*/

// Testar criação de fatura
/*export const testGenerateInvoice = async (paymentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/invoice/${paymentId}`,
    );
    console.log('Fatura gerada:', response.data);
  } catch (error) {
    console.error(
      'Erro ao gerar fatura:',
      error.response?.data || error.message,
    );
  }
};*/

// Testar verificação de status do pagamento
/*export const testCheckPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/status/${paymentId}`);
    console.log('Status do pagamento:', response.data);
  } catch (error) {
    console.error(
      'Erro ao verificar status do pagamento:',
      error.response?.data || error.message,
    );
  }
};*/

// Executar os testes automaticamente (opcional)
(async () => {
  await testCreateAppointment();
  await testUpdateAppointmentStatus('appointment-123', 'confirmed');
  await testGetAppointmentsByUser('user-123');
  await testGetAvailability('physio-456');
  await testSaveAvailability('physio-456', [
    { day_of_week: 'Monday', start_time: '08:00', end_time: '12:00' },
    { day_of_week: 'Wednesday', start_time: '10:00', end_time: '14:00' },
  ]);
  await testAuthLogin('teste@example.com');
  //await testCreatePayment();
  //await testGenerateInvoice('payment-123');
  //await testCheckPaymentStatus('payment-123');
})();
