// backend/server.js (Corrigido para Vercel Serverless)

const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); // Adicionei esta linha que faltava

const app = express();

// ========================= CORS =========================
// Permite requisições de qualquer origem (temporariamente para garantir que funciona)
app.use(cors()); 
// =========================================================

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste simples
app.get('/api', (req, res) => {
    res.json({ message: "API do Conecta Social funcionando!" });
});

// Rotas principais
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Tratamento de erro global (opcional, mas recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

// Exporta o app para a Vercel (Serverless)
module.exports = app;

// Apenas inicia o servidor se estiver rodando localmente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando localmente na porta ${PORT}`));
}