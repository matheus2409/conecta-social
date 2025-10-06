// backend/db.js (Atualizado com import/export)
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro Crítico: As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não foram definidas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; // Usamos 'export default'