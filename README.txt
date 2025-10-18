# 📌 Fisioterapia API - Instalação e Uso

Este projeto é uma API desenvolvida com **NestJS** e integrada com **Supabase** para gerenciar agendamentos, disponibilidade e pagamentos de fisioterapeutas.

## 📂 **1. Configuração do Ambiente**

### **1.1 Clonar o repositório**
```bash
 git clone https://github.com/seu-repositorio/fisioterapia-api.git
 cd fisioterapia-api
```

### **1.2 Instalar dependências**
```bash
 npm install
```

### **1.3 Configurar variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto e adicione:
```env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-api-key
VENDUS_API_URL=https://yourcompany.vendus.pt/api/1.0
VENDUS_API_TOKEN=your-vendus-api-token
JWT_SECRET=your-secret-key
```

## 🚀 **2. Rodar o Servidor Localmente**

### **2.1 Compilar o projeto**
```bash
npm run build
```

### **2.2 Iniciar o servidor**
```bash
npm run start
```

A API será iniciada em **`http://localhost:3000`**.

### **2.3 Rodar em modo desenvolvimento**
```bash
npm run start:dev
```

## 🔄 **3. Comandos Essenciais para Configuração**

### **3.1 Instalar dependências principais**
```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt axios @supabase/supabase-js multer xlsx
```

### **3.2 Criar a estrutura do projeto**

#### Criar os módulos principais:
```bash
nest generate module auth
nest generate module appointments
nest generate module availability
nest generate module payments
nest generate module supabase
```

#### Criar os serviços:
```bash
nest generate service auth
nest generate service appointments
nest generate service availability
nest generate service payments
nest generate service supabase
```

#### Criar os controladores:
```bash
nest generate controller auth
nest generate controller appointments
nest generate controller availability
nest generate controller payments
```

### **3.3 Rodar Testes**
```bash
npm run test
```

## 🔌 **4. Endpoints Disponíveis**

### **4.1 Autenticação**
- **`POST /auth/login`** → Login do usuário

### **4.2 Agendamentos**
- **`POST /appointments/schedule`** → Criar agendamento
- **`PATCH /appointments/status/:appointment_id`** → Atualizar status do agendamento
- **`GET /appointments/user/:user_id`** → Listar agendamentos de um paciente
- **`GET /appointments/physiotherapist/:physiotherapist_id`** → Listar agendamentos de um fisioterapeuta
- **`GET /appointments/:appointment_id`** → Buscar agendamento por ID

### **4.3 Disponibilidade dos Fisioterapeutas**
- **`POST /availability/save/:physiotherapist_id`** → Criar ou atualizar horários disponíveis
- **`GET /availability/:physiotherapist_id`** → Obter disponibilidade de um fisioterapeuta
- **`GET /availability/:physiotherapist_id/:day_of_week`** → Obter disponibilidade em um dia específico
- **`POST /availability/upload`** → Upload de disponibilidade via Excel

## 📌 **5. Estrutura do Projeto**
```
📂 src
 ┣ 📂 auth
 ┣ 📂 appointments
 ┣ 📂 availability
 ┣ 📂 payments
 ┣ 📂 supabase
 ┣ 📜 main.ts
 ┣ 📜 app.module.ts
```

## 📬 **6. Contato**
Caso tenha dúvidas, entre em contato pelo [email] ou [GitHub].
