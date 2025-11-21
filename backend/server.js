const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// ========================= SOLUÇÃO DO BLOQUEIO (CORS) =========================
// Isso permite que o Frontend envie os dados para serem salvos no banco
app.use(cors({
    origin: '*', // Aceita conexões de qualquer lugar (Frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite CRIAR (POST) e EDITAR (PUT)
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Garante que o servidor responda "SIM" quando o navegador perguntar se pode enviar dados
app.options('*', cors());
// ===============================================================================

app.use(express.json());

// Rota de teste
app.get('/api', (req, res) => {
    res.json({ message: "API Conecta Social Pronta!" });
});

// Rotas
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Exporta para o Vercel
module.exports = app;

// Inicia localmente se não estiver no Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}