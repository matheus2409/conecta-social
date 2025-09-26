// backend/routes/projetos.js

const express = require('express');
const { supabase } = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Rota GET para listar todos os projetos (pública)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projetos')
            .select('*');

        if (error) {
            console.error('Erro detalhado do Supabase:', JSON.stringify(error, null, 2));
            throw new Error(error.message);
        }

        res.json(data);

    } catch (error) {
        console.error('Crash na rota GET /api/projetos:', error);
        res.status(500).json({ 
            message: 'Erro interno no servidor ao buscar projetos.',
            error: error.message 
        });
    }
});

// Rota GET para buscar um projeto por ID (pública)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('projetos')
            .select('*')
            .eq('id', id)
            .single(); // .single() para buscar apenas um registro

        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        res.json(data);
    } catch (error) {
        console.error(`Crash na rota GET /api/projetos/${id}:`, error);
        res.status(500).json({ 
            message: 'Erro interno no servidor ao buscar o projeto.',
            error: error.message 
        });
    }
});

// Rota para CRIAR um novo projeto (protegida e com validação)
router.post('/', verifyToken, async (req, res) => {
    const { nome, descricao, imagem_url, link_repositorio, link_site } = req.body;

    // --- VALIDAÇÃO DE ENTRADA ---
    if (!nome || typeof nome !== 'string' || !descricao || typeof descricao !== 'string') {
        return res.status(400).json({ error: 'Dados inválidos. Nome e descrição são obrigatórios e devem ser texto.' });
    }
    // --- FIM DA VALIDAÇÃO ---

    try {
        const { data, error } = await supabase
            .from('projetos')
            .insert([{ nome, descricao, imagem_url, link_repositorio, link_site }])
            .select();

        if (error) {
            throw error;
        }
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Crash na rota POST /api/projetos:', error);
        res.status(500).json({ 
            message: 'Erro interno no servidor ao criar o projeto.',
            error: error.message 
        });
    }
});

// Rota para ATUALIZAR um projeto (protegida e com validação)
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, imagem_url, link_repositorio, link_site } = req.body;

    // --- VALIDAÇÃO DE ENTRADA ---
    if (!nome || typeof nome !== 'string' || !descricao || typeof descricao !== 'string') {
        return res.status(400).json({ error: 'Dados inválidos. Nome e descrição são obrigatórios e devem ser texto.' });
    }
    // --- FIM DA VALIDAÇÃO ---

    try {
        const { data, error } = await supabase
            .from('projetos')
            .update({ nome, descricao, imagem_url, link_repositorio, link_site })
            .eq('id', id)
            .select();

        if (error) {
            throw error;
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado para atualização.' });
        }
        res.json(data[0]);
    } catch (error) {
        console.error(`Crash na rota PUT /api/projetos/${id}:`, error);
        res.status(500).json({ 
            message: 'Erro interno no servidor ao atualizar o projeto.',
            error: error.message 
        });
    }
});


// Rota para DELETAR um projeto (protegida)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('projetos')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Projeto deletado com sucesso.' });

    } catch (error) {
        console.error(`Crash na rota DELETE /api/projetos/${id}:`, error);
        res.status(500).json({
            message: 'Erro interno no servidor ao deletar o projeto.',
            error: error.message
        });
    }
});


module.exports = router;