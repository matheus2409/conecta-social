// backend/routes/projetos.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexão AWS RDS
const authMiddleware = require('../middleware/auth');

// === 1. LISTAR TODOS (Público) ===
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projetos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// === 2. LISTAR "MEUS PROJETOS" (Privado) ===
// Esta rota tem de vir ANTES da rota /:id para não confundir "meus" com um ID
router.get('/meus', authMiddleware, async (req, res) => {
    try {
        const criador_id = req.user.id; // ID do voluntário logado
        const result = await db.query('SELECT * FROM projetos WHERE criador_id = $1 ORDER BY id DESC', [criador_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar os seus projetos.' });
    }
});

// === 3. OBTER UM PROJETO (Público) ===
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
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

// === 4. CRIAR PROJETO (Privado) ===
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
        const criador_id = req.user.id; // Pega o ID do token de quem está logado

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

// === 5. EDITAR PROJETO (Protegido: Dono ou Admin) ===
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.user; // Dados do token (id e role)

        // A. Verificar se o projeto existe e quem é o dono
        const check = await db.query('SELECT criador_id FROM projetos WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });
        
        const projeto = check.rows[0];

        // B. Verificar Permissão (Se não for Admin E não for o Dono -> Bloqueia)
        if (usuario.role !== 'admin' && projeto.criador_id !== usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para editar este projeto.' });
        }

        // C. Atualizar
        const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
        const query = `
            UPDATE projetos 
            SET titulo = $1, descricao = $2, categoria = $3, imagem_url = $4, link_site = $5, link_repositorio = $6, contato_coordenador = $7
            WHERE id = $8
            RETURNING *;
        `;
        const values = [titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador, id];
        const result = await db.query(query, values);

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar projeto.' });
    }
});

// === 6. APAGAR PROJETO (Protegido: Dono ou Admin) ===
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.user;

        // A. Verificar dono
        const check = await db.query('SELECT criador_id FROM projetos WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });

        const projeto = check.rows[0];

        // B. Verificar Permissão
        if (usuario.role !== 'admin' && projeto.criador_id !== usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para apagar este projeto.' });
        }

        // C. Apagar
        await db.query('DELETE FROM projetos WHERE id = $1', [id]);
        res.json({ message: 'Projeto deletado com sucesso.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar projeto.' });
    }
});

module.exports = router;