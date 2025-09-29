// backend/db.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Lê as credenciais de forma segura a partir do process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validação para garantir que as variáveis foram carregadas corretamente
if (!supabaseUrl || !supabaseKey) {
  console.error("Erro Crítico: As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não foram definidas no arquivo .env");
  console.error("Por favor, crie um arquivo .env na pasta 'backend' e adicione suas credenciais do Supabase.");
  process.exit(1); // Encerra a aplicação se as chaves não estiverem configuradas
}

// Cria e exporta o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;