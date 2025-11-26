const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a nossa nova conexão AWS
const authMiddleware = require('../middleware/auth');

// LISTAR PROJETOS (Público)
router.get('/', async (req, res) => {
    try {
        // SQL direto em vez de supabase.from...
        const result = await db.query('SELECT * FROM projetos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar projetos:', err);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// OBTER PROJETO POR ID (Público)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Usamos $1 para evitar SQL Injection (segurança)
        const result = await db.query('SELECT * FROM projetos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar projeto.' });
    }
});

// CRIAR PROJETO (Privado - Requer Login)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
        const criador_id = req.user.id; // Vem do token JWT

        // Comando SQL de Inserção
        const query = `
            INSERT INTO projetos (titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, criador_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        
        const values = [titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, criador_id];
        
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Erro ao criar projeto:', err);
        res.status(500).json({ error: 'Erro ao criar projeto.' });
    }
});

// ATUALIZAR PROJETO (Privado)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;

        const query = `
            UPDATE projetos 
            SET titulo = $1, descricao = $2, categoria = $3, imagem_url = $4, link_site = $5, link_repositorio = $6, contato_coordenador = $7
            WHERE id = $8
            RETURNING *;
        `;

        const values = [titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, id];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar projeto.' });
    }
});

// DELETAR PROJETO (Privado)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM projetos WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        res.json({ message: 'Projeto deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar projeto.' });
    }
});

module.exports = router;