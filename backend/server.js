const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const projetosRoutes = require('./routes/projetos'); // Importa as rotas

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir os arquivos estáticos do frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Rotas da API
app.use('/api/projetos', projetosRoutes);

// Para qualquer outra rota, servir o index.html (bom para Single Page Apps)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});