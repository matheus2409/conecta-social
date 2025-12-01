const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes);

app.get('/api', (req, res) => res.json({ status: "online" }));

// === CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ===
const frontendRoot = path.join(__dirname, '../frontend');
app.use(express.static(path.join(frontendRoot, 'static')));
app.use(express.static(frontendRoot));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendRoot, 'index.html'));
});

// === ROTAS DO PORTAL DE ESPORTES ===
app.get('/esportes', (req, res) => {
    res.sendFile(path.join(frontendRoot, 'portal-index.html', 'index.html'));
});

function renderSport(res, sport) {
    const filePath = path.join(frontendRoot, 'portal-index.html', `${sport}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Erro ao carregar ${sport}:`, err);
            res.status(404).send(`Página do esporte ${sport} não encontrada.`);
        }
    });
}

const esportes = [
    'futebol', 'futsal', 'handebol', 'corrida', 'futevolei', 'volei', 
    'volei_de_areia', 'basquete', 'rugby', 'futebol_americano', 'cricket', 
    'beisebol', 'ciclismo', 'natacao', 'mergulho', 'surfe', 'kitesurf', 
    'polo_aquatico', 'tenis_de_mesa', 'boxe', 'muay_thai', 'judo', 
    'jiu_jitsu', 'karate', 'krav_maga', 'kung_fu'
];

esportes.forEach(sport => {
    app.get(`/${sport}`, (req, res) => renderSport(res, sport));
});

app.use((err, req, res, next) => {
    console.error("❌ Erro no Servidor:", err.stack);
    res.status(500).json({ error: 'Erro interno.', details: err.message });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📂 Servindo frontend de: ${frontendRoot}`);
    });
}
module.exports = app;