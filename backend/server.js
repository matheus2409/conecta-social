// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Garante que as variáveis de ambiente sejam carregadas

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const esportesRoutes = require('./routes/esportes');

const app = express();

// --- Início da Configuração do CORS ---
// Lista de endereços que podem aceder à sua API
const whitelist = ['http://127.0.0.1:5500', 'http://localhost:5500'];
const corsOptions = {
  origin: function (origin, callback) {
    // Permite pedidos da mesma origem (se o frontend e backend estiverem no mesmo domínio)
    // ou se a origem estiver na nossa lista de permissões (whitelist)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pelo CORS'));
    }
  },
};

app.use(cors(corsOptions));
// --- Fim da Configuração do CORS ---

// Middleware para permitir que o servidor entenda JSON nas requisições
app.use(express.json());

// Definição das Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/esportes', esportesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});