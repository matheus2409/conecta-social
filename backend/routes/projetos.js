// backend/routes/projetos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// LISTAR PROJETOS (Público)
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projetos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// OBTER PROJETO POR ID (Público)
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

// CRIAR PROJETO (Qualquer voluntário logado pode criar)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
        const criador_id = req.user.id; // ID de quem está logado

        const query = `
            INSERT INTO projetos (titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, criador_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, criador_id];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar projeto.' });
    }
});

// === ATUALIZAR PROJETO (Protegido: Só Dono ou Admin) ===
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.user; // Vem do token

        // 1. Buscar o projeto para ver quem é o dono
        const checkQuery = 'SELECT criador_id FROM projetos WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        const projeto = checkResult.rows[0];

        // 2. Verificar Permissão:
        // Se NÃO for Admin E o ID do criador for diferente do ID do usuário logado -> BLOQUEAR
        if (usuarioLogado.role !== 'admin' && projeto.criador_id !== usuarioLogado.id) {
            return res.status(403).json({ error: 'Não tem permissão para editar este projeto.' });
        }

        // 3. Se passou, atualiza
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
        const updateQuery = `
            UPDATE projetos 
            SET titulo = $1, descricao = $2, categoria = $3, imagem_url = $4, link_site = $5, link_repositorio = $6, contato_coordenador = $7
            WHERE id = $8
            RETURNING *;
        `;
        const values = [titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, id];
        const result = await db.query(updateQuery, values);

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar projeto.' });
    }
});

// === DELETAR PROJETO (Protegido: Só Dono ou Admin) ===
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.user;

        // 1. Buscar o projeto
        const checkQuery = 'SELECT criador_id FROM projetos WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        const projeto = checkResult.rows[0];

        // 2. Verificar Permissão
        if (usuarioLogado.role !== 'admin' && projeto.criador_id !== usuarioLogado.id) {
            return res.status(403).json({ error: 'Não tem permissão para apagar este projeto.' });
        }

        // 3. Apagar
        await db.query('DELETE FROM projetos WHERE id = $1', [id]);
        res.json({ message: 'Projeto deletado com sucesso.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar projeto.' });
    }
});

module.exports = router;