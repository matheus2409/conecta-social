const express = require('express');
const { supabase } = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Importa o middleware

// ... (sua rota GET para listar todos os projetos continua pública)
router.get('/', async (req, res) => {
    // ... (código inalterado)
});

// ... (sua rota GET para buscar um projeto por ID continua pública)
router.get('/:id', async (req, res) => {
    // ... (código inalterado)
});

// As rotas abaixo agora estão protegidas e exigem um token válido
router.post('/', verifyToken, async (req, res) => {
    // ... (código inalterado)
});

router.put('/:id', verifyToken, async (req, res) => {
    // ... (código inalterado)
});

router.delete('/:id', verifyToken, async (req, res) => {
    // ... (código inalterado)
});

module.exports = router;