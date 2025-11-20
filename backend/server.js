// backend/server.js (versão final e corrigida)

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega variáveis do .env

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
// const esportesRoutes = require('./routes/esportes'); // REMOVIDO

const app = express();

// ========================= CORS =========================
const whitelist = (process.env.ALLOWED_ORIGINS || 'http://127.0.0.1:5500,http://localhost:5500').split(',');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Bloqueado por CORS: ${origin}`);
      callback(new Error('Acesso negado pela política de CORS.'));
    }
  },
};

app.use(cors(corsOptions));
// =========================================================

// Middleware para interpretar JSON
app.use(express.json());

// Rotas principais
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/esportes', esportesRoutes); // REMOVIDO

// Rota raiz opcional
app.get('/', (req, res) => {
  res.send(' API Conecta Social funcionando!');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));