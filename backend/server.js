// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projetosRoutes = require('./routes/projetos');
const authRoutes = require('./routes/auth');
const feedbacksRoutes = require('./routes/feedbacks'); // Mantenha comentado se não implementou

const app = express();

// --- Configuração de CORS ---
// Permite que o seu site frontend faça pedidos a esta API
const corsOptions = {
  origin: 'https://conecta-social-gilt.vercel.app',
  optionsSuccessStatus: 200 
};''
app.use(cors(corsOptions));
// --- Fim da Configuração ---

// Middlewares para a aplicação entender JSON
app.use(express.json());

// Definição das rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/feedbacks', feedbacksRoutes); // Mantenha comentado se não implementou

// Rota de teste para a raiz da API
app.get('/api', (req, res) => {
  res.send('API Conecta Social está no ar!');
});


module.exports = app;