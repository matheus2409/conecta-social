require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function teste() {
    const { data, error } = await supabase.from('voluntarios').select('*').limit(1);
    if (error) console.log("Erro de conexão:", error.message);
    else console.log("Sucesso! Banco conectado.");
}
teste();