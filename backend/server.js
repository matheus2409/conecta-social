const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios');

const app = express();

// 1. Configuração de CORS (Permite que o Frontend fale com o Backend)
app.use(cors({
    origin: '*', // Em produção, podes restringir ao teu domínio da Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Processar JSON
app.use(express.json());

// 3. Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes);

// Rota de Teste (Health Check)
app.get('/api', (req, res) => {
    res.json({ status: "online", message: "API Conecta Social a rodar na AWS!" });
});

// 4. Middleware de Erro Global (O Segredo para não quebrar o frontend)
// Se alguma rota der erro, este código captura e envia JSON
app.use((err, req, res, next) => {
    console.error("❌ Erro no Servidor:", err.stack);
    res.status(500).json({ 
        error: 'Ocorreu um erro interno no servidor.',
        details: err.message 
    });
});

// Inicia o servidor (apenas se não for exportado como módulo, útil para local)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;