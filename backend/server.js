// backend/server.js (Atualizado)

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Garante que as variáveis de ambiente sejam carregadas

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const esportesRoutes = require('./routes/esportes');

const app = express();

// --- Início da Configuração do CORS Mais Segura ---
// Lista de endereços que podem aceder à sua API
const whitelist = ['http://127.0.0.1:5500', 'http://localhost:5500'];
const corsOptions = {
  origin: function (origin, callback) {
    // Permite pedidos se a origem estiver na nossa lista de permissões (whitelist)
    // ou se não houver origem (ex: pedidos do mesmo servidor ou de ferramentas como o Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pela política de CORS'));
    }
  },
};

// Em ambiente de desenvolvimento, permitir todas as origens para simplificar testes locais
const fs = require('fs');
const debugLogPath = __dirname + '/debug.log';
function appendLog(line) {
  try {
    fs.appendFileSync(debugLogPath, line + '\n');
  } catch (e) {
    console.error('Falha ao gravar debug.log', e.message);
  }
}

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const line = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
    console.log(line);
    appendLog(line);
    next();
  });
  app.use(cors());
} else {
  app.use(cors(corsOptions));
}
// --- Fim da Configuração do CORS ---

// Middleware para permitir que o servidor entenda JSON
app.use(express.json());

// Definição das Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/esportes', esportesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const PORT = process.env.PORT || 3000;
  res.json({ ok: true, port: Number(PORT) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});