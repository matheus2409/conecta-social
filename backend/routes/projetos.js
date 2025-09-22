// backend/routes/projetos.js

const express = require('express');
const { supabase } = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Rotas públicas (GET) permanecem inalteradas...

router.get('/', async (req, res) => {
    // ... código inalterado
});

router.get('/:id', async (req, res) => {
    // ... código inalterado
});


// --- Rota POST com a nova validação ---
router.post('/', verifyToken, async (req, res) => {
    const { titulo, descricao, categoria, localizacao, cidade, estado, cep } = req.body;

    // Validação dos campos obrigatórios
    if (!titulo || !descricao || !categoria || !localizacao || !cidade || !estado || !cep) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios estão faltando: título, descrição, categoria, localização, cidade, estado e CEP.' 
        });
    }

    try {
        const { data, error } = await supabase
            .from('projetos') // Certifique-se que sua tabela no Supabase se chama 'projetos'
            .insert([{ ...req.body }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o projeto: ' + error.message });
    }
});

// --- Rota PUT com a nova validação ---
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, categoria, localizacao, cidade, estado, cep } = req.body;

    // Validação dos campos obrigatórios
    if (!titulo || !descricao || !categoria || !localizacao || !cidade || !estado || !cep) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios estão faltando: título, descrição, categoria, localização, cidade, estado e CEP.'
        });
    }

    try {
        const { data, error } = await supabase
            .from('projetos')
            .update({ ...req.body })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Projeto não encontrado.' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o projeto: ' + error.message });
    }
});

// Rota DELETE permanece inalterada...
router.delete('/:id', verifyToken, async (req, res) => {
    // ... código inalterado
});

module.exports = router;