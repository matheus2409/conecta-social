// backend/routes/recomendacoes.js (Versão AWS RDS)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Nova conexão
const authMiddleware = require('../middleware/auth');
const fetch = require('node-fetch'); // Certifica-te que tens: npm install node-fetch@2

// CORREÇÃO: Aponta para a URL pública do serviço Python (Portal de Esportes)
const IA_SERVICE_URL = 'https://conecta-social-projects.vercel.app/recomendar'; 

router.get('/', authMiddleware, async (req, res) => {
    try {
        const voluntarioId = req.user.id;

        // 1. Obter interesses via SQL
        const query = 'SELECT interesses FROM voluntarios WHERE id = $1';
        const result = await db.query(query, [voluntarioId]);

        if (result.rows.length === 0 || !result.rows[0].interesses) {
            return res.json([]); // Sem interesses, sem recomendações
        }

        const interessesUsuario = result.rows[0].interesses;

        // 2. Chamar o serviço de IA (mantém-se igual)
        const response = await fetch(IA_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interesses: interessesUsuario }),
        });

        if (!response.ok) {
            throw new Error('Falha no serviço de recomendação.');
        }

        const recomendacoes = await response.json();
        res.json(recomendacoes);

    } catch (err) {
        console.error('Erro nas recomendações:', err.message);
        // Em vez de quebrar, retornamos lista vazia se a IA falhar
        res.json([]); 
    }
});

module.exports = router;