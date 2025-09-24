// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projetosRoutes = require('./routes/projetos');
const authRoutes = require('./routes/auth');
const feedbacksRoutes = require('./routes/feedbacks'); // Se você implementou

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbacksRoutes); // Se você implementou

// Rota de "catch-all" para a raiz da API (opcional, mas bom para teste)
app.get('/api', (req, res) => {
  res.send('API Conecta Social está no ar!');
});

// --- MUDANÇA PRINCIPAL ---
// Removemos o app.listen e exportamos o app para a Vercel.
// A Vercel vai gerir o servidor por nós.
module.exports = app;