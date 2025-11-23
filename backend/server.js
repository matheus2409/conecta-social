const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// Configuração do CORS
app.use(cors({
    origin: '*', // Aceita tudo (o vercel.json gerencia o bloqueio real)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de teste
app.get('/api', (req, res) => {
    res.json({ message: "API Conecta Social Online!" });
});

// Rotas da Aplicação
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Tratamento de Erro Global
app.use((err, req, res, next) => {
    console.error("Erro no servidor:", err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Exporta para o Vercel
module.exports = app;

// Inicia localmente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}