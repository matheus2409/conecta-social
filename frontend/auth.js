// ATENÇÃO: As chaves NUNCA devem ficar diretamente no código.
// Este arquivo é apenas para inicializar o cliente do Supabase.

// 1. Vá para o painel do seu projeto no Supabase.
// 2. Encontre as chaves de API em "Settings" -> "API".
// 3. Você precisará da "Project URL" e da chave "anon" (pública).

// NUNCA, EM HIPÓTESE ALGUMA, USE A CHAVE "service_role" (secreta) NO FRONTEND.

// Substitua os valores abaixo pela sua URL e pela sua CHAVE PÚBLICA (anon).
const SUPABASE_URL = 'A_SUA_URL_DO_SUPABASE_AQUI'; 
const SUPABASE_KEY = 'A_SUA_CHAVE_PUBLICA_ANON_AQUI';

// Se você estiver usando um serviço como Vercel ou Netlify, o ideal é
// configurar estas chaves como "Environment Variables" no painel do seu projeto.

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);