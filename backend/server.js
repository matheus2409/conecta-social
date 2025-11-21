// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// ========================= CORS (CORREÇÃO DO ERRO 405) =========================
// Configura o CORS para aceitar qualquer origem e credenciais
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Habilita o "Pre-flight" para todas as rotas (Essencial para o Vercel não dar 405)
app.options('*', cors());
// ===============================================================================

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste simples para verificar se a API está no ar
app.get('/api', (req, res) => {
    res.json({ status: "ok", message: "API do Conecta Social funcionando!" });
});

// Rotas principais
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Tratamento de erro global
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err.stack);
  res.status(500).json({ error: 'Algo deu errado no servidor!', details: err.message });
});

// Exporta o app para a Vercel (Serverless)
module.exports = app;

// Apenas inicia o servidor se estiver rodando localmente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando localmente na porta ${PORT}`));
}