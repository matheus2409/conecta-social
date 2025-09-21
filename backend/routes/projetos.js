// backend/routes/projetos.js

const express = require('express');
const router = express.Router();
const { supabase } = require('../db'); // Supondo que você mova a conexão para um arquivo db.js

// Rota para obter todos os projetos
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('projetos').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// Rota para obter um projeto por ID
router.get('/:id', async (req, res) => {
    // ... Lógica da sua rota
});

// Rota para criar um novo projeto
router.post('/', async (req, res) => {
    // ... Lógica da sua rota
});

// ... outras rotas (PUT, DELETE)

module.exports = router;