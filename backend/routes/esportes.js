// backend/routes/esportes.js

const express = require('express');
const router = express.Router();
const supabase = require('../db');

// Rota para obter todos os itens de esporte (GET /api/esportes)
router.get('/', async (req, res) => {
    try {
        // Assumindo que você criou uma tabela 'esportes' no Supabase
        const { data, error } = await supabase.from('esportes').select('*');

        if (error) {
            throw new Error(error.message);
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Erro ao buscar dados de esportes:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});

module.exports = router;