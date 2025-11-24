const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
// Isso trabalha junto com o seu novo vercel.json
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // Responde imediatamente ao "Preflight" (a pergunta do navegador)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Rotas
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

// Rota de teste
app.get('/api', (req, res) => {
    res.json({ message: "API Online!" });
});

module.exports = app; // Exportação obrigatória para Vercel

// Apenas inicia servidor localmente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}