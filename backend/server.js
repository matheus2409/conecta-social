const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const projetosRoutes = require('./routes/projetos');
const authRoutes = require('./routes/auth'); // <-- Importa a nova rota

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rotas da API
app.use('/api/projetos', projetosRoutes);
app.use('/api/auth', authRoutes); // <-- Adiciona a nova rota

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});