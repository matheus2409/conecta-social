const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// === 1. LISTAR COMENTÁRIOS DE UM PROJETO ===
router.get('/projeto/:id_projeto', async (req, res) => {
    try {
        const { id_projeto } = req.params;
        // Busca comentários do mais recente para o mais antigo
        const query = `
            SELECT * FROM feedbacks 
            WHERE id_do_projeto = $1 
            ORDER BY criado_em DESC
        `;
        const result = await db.query(query, [id_projeto]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({ error: 'Erro ao carregar comentários.' });
    }
});

// === 2. CRIAR COMENTÁRIO (Com Imagem) ===
router.post('/', authMiddleware, async (req, res) => {
    const { mensagem, id_do_projeto, imagem_url } = req.body;
    
    // Nome vem do token de autenticação
    const nome_usuario = req.user.nome; 

    if (!mensagem || !id_do_projeto) {
        return res.status(400).json({ error: 'Mensagem e ID do projeto são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO feedbacks (nome_usuario, mensagem, id_do_projeto, imagem_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        // Se não houver imagem, grava null
        const values = [nome_usuario, mensagem, id_do_projeto, imagem_url || null];
        
        const result = await db.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao salvar comentário:', error);
        res.status(500).json({ error: 'Erro ao enviar comentário.' });
    }
});

module.exports = router;