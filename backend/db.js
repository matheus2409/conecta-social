// backend/db.js (Corrigido com CommonJS)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro Crítico: As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não foram definidas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; // Usamos 'module.exports'