// ATENÇÃO: As chaves NUNCA devem ficar diretamente no código.
// Este arquivo é apenas para inicializar o cliente do Supabase.

// 1. Vá para o painel do seu projeto no Supabase.
// 2. Encontre as chaves de API em "Settings" -> "API".
// 3. Você precisará da "Project URL" e da chave "anon" (pública).

// NUNCA, EM HIPÓTESE ALGUMA, USE A CHAVE "service_role" (secreta) NO FRONTEND.

// Como usar de forma segura:
// Se você estiver usando um serviço como Vercel ou Netlify, adicione
// estas chaves como "Environment Variables" (Variáveis de Ambiente) no painel do seu projeto.
// Em desenvolvimento local, você pode usar um arquivo .env, mas garanta que ele não seja enviado para o GitHub.

// Exemplo (NÃO COPIE ESTAS CHAVES, USE AS SUAS):
const SUPABASE_URL = ''; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZ213YW9icXBoY3Zhc21tY2J6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjcyMjkxNSwiZXhwIjoyMDcyMjk4OTE1fQ.z0iHBNwkz_DnMuznuXdIlrrIKhLDyiByyxK6ntG_GDs';

// Se você estiver usando Vercel, as variáveis de ambiente com prefixo VITE_, NEXT_PUBLIC_ etc.,
// ficam disponíveis no frontend. A forma de acessá-las muda conforme o framework
// (ex: import.meta.env.VITE_SUPABASE_URL).
// Como você está usando HTML puro, a abordagem mais segura seria ter um backend
// que serve essas chaves para o frontend, mas para simplificar, você pode defini-las aqui
// e depois migrar para um método mais seguro.

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);