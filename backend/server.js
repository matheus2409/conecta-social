// backend/server.js (Configurado para Vercel sem erro 405)

const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// ========================= CORS (BLINDAGEM VERCEL) =========================
// 1. Configura quais métodos e cabeçalhos são aceitos
app.use(cors({
    origin: '*', // Permite qualquer origem (ajuste para produção se necessário)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Lista explícita de métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true
}));

// 2. Responde explicitamente às requisições OPTIONS (Preflight)
// Isso é o que evita o erro 405 no Vercel
app.options('*', cors());
// ===========================================================================

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste simples
app.get('/api', (req, res) => {
    res.json({ status: "ok", message: "API do Conecta Social online!" });
});

// Rotas principais
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Tratamento de erro global
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
});

// Exporta o app para a Vercel (Serverless)
module.exports = app;

// Apenas inicia o servidor se estiver rodando localmente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando localmente na porta ${PORT}`));
}