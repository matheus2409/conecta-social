// backend/server.js (Versão com CORS Manual Infalível)

const express = require('express');
const cors = require('cors'); // Mantemos para segurança básica, mas vamos forçar headers
require('dotenv').config(); 

// Importa as rotas
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// ========================= CORS MANUAL (RESOLVE ERRO 405) =========================
// Este bloco força o servidor a aceitar conexões de qualquer lugar e responder ao OPTIONS
app.use((req, res, next) => {
    // Permite qualquer origem (Frontend)
    res.header("Access-Control-Allow-Origin", "*");
    // Permite os métodos que usamos
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // Permite os cabeçalhos que enviamos (Content-Type e Authorization)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // Se for a pergunta "Posso conectar?" (OPTIONS), responde SIM imediatamente
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});
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

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}