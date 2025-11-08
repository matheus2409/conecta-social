const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth');
const fetch = require('node-fetch'); // Precisarás de instalar: npm install node-fetch

// O endereço do nosso novo serviço de IA em Python
const IA_SERVICE_URL = 'http://localhost:5000/recomendar';

router.get('/', authMiddleware, async (req, res) => {
    try {
        const voluntarioId = req.user.id;

        // 1. Obter os interesses do voluntário
        const { data: voluntario, error: voluntarioError } = await supabase
            .from('voluntarios')
            .select('interesses')
            .eq('id', voluntarioId)
            .single();

        if (voluntarioError || !voluntario.interesses) {
            return res.json([]);
        }

        // 2. Chamar o serviço de IA em Python
        const response = await fetch(IA_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interesses: voluntario.interesses }),
        });

        if (!response.ok) {
            throw new Error('Falha no serviço de recomendação.');
        }

        const recomendacoes = await response.json();
        
        // 3. Devolver o resultado ao frontend
        res.json(recomendacoes);

    } catch (err) {
        console.error('Erro ao comunicar com o serviço de IA:', err.message);
        res.status(500).json({ error: 'Não foi possível gerar as recomendações.' });
    }
});

module.exports = router;