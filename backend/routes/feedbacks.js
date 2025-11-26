// backend/routes/feedbacks.js (Versão AWS RDS)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Nova conexão
const authMiddleware = require('../middleware/auth');

// Criar Feedback (Público)
router.post('/', async (req, res) => {
    const { nome_usuario, mensagem, id_do_projeto } = req.body;

    if (!mensagem || !id_do_projeto) {
        return res.status(400).json({ error: 'Mensagem e ID do projeto são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO feedbacks (nome_usuario, mensagem, id_do_projeto)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [nome_usuario || 'Anónimo', mensagem, id_do_projeto];
        
        const result = await db.query(query, values);
        
        res.status(201).json({ message: 'Feedback enviado!', data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar feedback:', error);
        res.status(500).json({ error: 'Erro ao salvar o feedback.' });
    }
});

// Listar Feedbacks (Privado/Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM feedbacks ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feedbacks.' });
    }
});

module.exports = router;