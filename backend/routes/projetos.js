// backend/routes/projetos.js (Versão Completa com Todos os Campos)
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// === 1. LISTAR TODOS ===
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projetos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// === 2. MEUS PROJETOS ===
router.get('/meus', authMiddleware, async (req, res) => {
    try {
        const criador_id = req.user.id;
        const result = await db.query('SELECT * FROM projetos WHERE criador_id = $1 ORDER BY id DESC', [criador_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar seus projetos.' });
    }
});

// === 3. OBTER UM PROJETO ===
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM projetos WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar projeto.' });
    }
});

// === 4. CRIAR PROJETO (ATUALIZADO COM TODOS OS CAMPOS) ===
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Recebe todos os campos do formulário
        const { 
            titulo, 
            descricao,      // descricao_completa
            descricao_curta,
            categoria, 
            imagem_url, 
            link_site, 
            contato_coordenador, // contato
            nome_contato,
            local,
            latitude,
            longitude
        } = req.body;

        const criador_id = req.user.id;

        // Query atualizada para bater com a sua tabela
        const query = `
            INSERT INTO projetos (
                titulo, descricao, descricao_curta, categoria, imagem_url, 
                link_site, contato_coordenador, nome_contato, local, 
                latitude, longitude, criador_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        
        // Trata latitude/longitude para serem null se vierem vazios
        const lat = latitude ? parseFloat(latitude) : null;
        const lon = longitude ? parseFloat(longitude) : null;

        const values = [
            titulo, descricao, descricao_curta, categoria, imagem_url, 
            link_site, contato_coordenador, nome_contato, local, 
            lat, lon, criador_id
        ];
        
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Erro ao criar projeto:', err);
        res.status(500).json({ error: 'Erro ao criar projeto: ' + err.message });
    }
});

// === 5. DELETAR ===
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.user;
        
        const check = await db.query('SELECT criador_id FROM projetos WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });

        const projeto = check.rows[0];
        if (usuario.role !== 'admin' && projeto.criador_id !== usuario.id) {
            return res.status(403).json({ error: 'Sem permissão.' });
        }

        await db.query('DELETE FROM projetos WHERE id = $1', [id]);
        res.json({ message: 'Deletado com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar.' });
    }
});

module.exports = router;