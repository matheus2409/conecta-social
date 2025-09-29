// backend/routes/projetos.js (Atualizado)

const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth');

// Rota para obter todos os projetos (GET /api/projetos)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('projetos').select('*');

        if (error) {
            // Se o Supabase retornar um erro, nós o lançamos para o bloco catch
            throw new Error(error.message);
        }

        res.status(200).json(data);

    } catch (err) {
        // Captura qualquer erro (do Supabase ou inesperado)
        console.error('Erro ao buscar projetos:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao buscar os projetos.' });
    }
});

// Rota para adicionar um novo projeto (POST /api/projetos)
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, link } = req.body;

        // Validação simples dos dados recebidos
        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('projetos')
            .insert([{ nome, descricao, link }])
            .select(); // O .select() faz com que o Supabase retorne o objeto inserido

        if (error) {
            throw new Error(error.message);
        }

        // Retorna o projeto recém-criado com status 201 (Created)
        res.status(201).json(data[0]);

    } catch (err) {
        console.error('Erro ao adicionar projeto:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao adicionar o projeto.' });
    }
});

module.exports = router;