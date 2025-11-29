// matheus2409/conecta-social/backend/server.js (CORREÇÃO DE CAMINHO ABSOLUTO)

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Importação das Rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios');
// const recomendacoesRoutes = require('./routes/recomendacoes'); // DEIXADO DE FORA DA COMPILAÇÃO, COMO COMBINADO

const app = express();

// 1. Configuração de CORS (Permite acesso do Frontend)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Processar JSON com Limite Aumentado
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


// =========================================================================
// 4. CONFIGURAÇÃO PARA SERVIR O FRONTEND E ASSETS 
// =========================================================================

// CORREÇÃO: Mapeia a pasta 'frontend/static' para a raiz '/' para os assets (CSS, Imagens)
app.use(express.static(path.join(process.cwd(), 'frontend/static'))); 

// Express agora serve arquivos estáticos (HTML, CSS, JS do frontend principal)
app.use(express.static(path.join(process.cwd(), 'frontend')));

// Rota principal (/) para devolver o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

// =========================================================================
// NOVO: Rotas para servir o Portal de Esportes (Com correção de caminho)
// =========================================================================

// Função helper para servir o HTML (AGORA USA process.cwd() para ABSOLUTO)
function renderSport(res, sport) {
    // ESTA É A LINHA CRÍTICA CORRIGIDA para máxima estabilidade no Vercel
    const absolutePath = path.join(process.cwd(), 'frontend', 'portal_esportes', `${sport}.html`);
    res.sendFile(absolutePath);
}

// Rota para a página inicial do portal de esportes
app.get('/esportes', (req, res) => renderSport(res, 'index'));

// Rotas para as páginas específicas dos esportes
app.get('/futebol', (req, res) => renderSport(res, 'futebol'));
app.get('/futsal', (req, res) => renderSport(res, 'futsal'));
app.get('/handebol', (req, res) => renderSport(res, 'handebol'));
app.get('/corrida', (req, res) => renderSport(res, 'corrida'));
app.get('/futevolei', (req, res) => renderSport(res, 'futevolei')); 
app.get('/volei', (req, res) => renderSport(res, 'volei'));
app.get('/volei_de_areia', (req, res) => renderSport(res, 'volei_de_areia'));
app.get('/basquete', (req, res) => renderSport(res, 'basquete'));
app.get('/rugby', (req, res) => renderSport(res, 'rugby'));
app.get('/futebol_americano', (req, res) => renderSport(res, 'futebol_americano'));
app.get('/cricket', (req, res) => renderSport(res, 'cricket'));
app.get('/beisebol', (req, res) => renderSport(res, 'beisebol'));
app.get('/ciclismo', (req, res) => renderSport(res, 'ciclismo'));
app.get('/natacao', (req, res) => renderSport(res, 'natacao'));
app.get('/mergulho', (req, res) => renderSport(res, 'mergulho'));
app.get('/surfe', (req, res) => renderSport(res, 'surfe'));
app.get('/kitesurf', (req, res) => renderSport(res, 'kitesurf'));
app.get('/polo_aquatico', (req, res) => renderSport(res, 'polo_aquatico'));
app.get('/tenis_de_mesa', (req, res) => renderSport(res, 'tenis_de_mesa'));
app.get('/boxe', (req, res) => renderSport(res, 'boxe'));
app.get('/muay_thai', (req, res) => renderSport(res, 'muay_thai'));
app.get('/judo', (req, res) => renderSport(res, 'judo'));
app.get('/jiu_jitsu', (req, res) => renderSport(res, 'jiu_jitsu'));
app.get('/karate', (req, res) => renderSport(res, 'karate'));
app.get('/krav_maga', (req, res) => renderSport(res, 'krav_maga'));
app.get('/kung_fu', (req, res) => renderSport(res, 'kung_fu'));
// =========================================================================

// 5. Middleware de Erro Global
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