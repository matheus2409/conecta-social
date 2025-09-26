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

        if (error) throw new Error(error.message);
        res.json(data);

    } catch (error) {
        res.status(500).json({ 
            message: 'Erro interno no servidor ao buscar projetos.',
            error: error.message 
        });
    }
});

// Rota para CRIAR um novo projeto (protegida e com validação)
router.post('/', verifyToken, async (req, res) => {
    // Adicionamos contato_coordenador
    const { nome, descricao, imagem_url, link_repositorio, link_site, esporte_id, contato_coordenador } = req.body;

    // Validação
    if (!nome || !descricao || !esporte_id) {
        return res.status(400).json({ error: 'Nome, descrição e esporte são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('projetos')
            .insert([{ nome, descricao, imagem_url, link_repositorio, link_site, esporte_id, contato_coordenador }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o projeto: ' + error.message });
    }
});

// Rota para ATUALIZAR um projeto (protegida e com validação)
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, imagem_url, link_repositorio, link_site, esporte_id, contato_coordenador } = req.body;

    if (!nome || !descricao || !esporte_id) {
        return res.status(400).json({ error: 'Nome, descrição e esporte são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('projetos')
            .update({ nome, descricao, imagem_url, link_repositorio, link_site, esporte_id, contato_coordenador })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o projeto: ' + error.message });
    }
});

// ... as outras rotas (GET por ID, DELETE) podem continuar como estão ...

module.exports = router;