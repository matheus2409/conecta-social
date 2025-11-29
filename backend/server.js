const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importação das Rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios');

const app = express();

// 1. Configuração de CORS (Permite acesso do Frontend)
app.use(cors({
    origin: '*', // Em produção, podes restringir ao teu domínio
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Processar JSON com Limite Aumentado (CRÍTICO PARA IMAGENS)
// Se não tiver isto, o upload de imagens falha com "Payload Too Large"
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. Definição das Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes);

// Rota de Teste (Health Check)
app.get('/api', (req, res) => {
    res.json({ 
        status: "online", 
        message: "API Conecta Social a rodar com sucesso!" 
    });
});

// 4. Middleware de Erro Global
// Captura erros inesperados e devolve JSON em vez de quebrar o servidor
app.use((err, req, res, next) => {
    console.error("❌ Erro no Servidor:", err.stack);
    res.status(500).json({ 
        error: 'Ocorreu um erro interno no servidor.',
        details: err.message 
    });
});

// Inicia o servidor
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;