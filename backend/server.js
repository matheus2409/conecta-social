const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const voluntariosRoutes = require('./routes/voluntarios'); 

const app = express();

// CORS MANUAL (Obrigatório para Vercel aceitar POST de login/registro)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voluntarios', voluntariosRoutes); 

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}