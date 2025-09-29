// backend/server.js

const express = require('express');
const cors = require('cors');
const projetosRoutes = require('./routes/projetos');
const feedbacksRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');
const esportesRoutes = require('./routes/esportes'); // <-- ADICIONE ESTA LINHA

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/esportes', esportesRoutes); // <-- ADICIONE ESTA LINHA

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});