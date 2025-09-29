const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth'); // Importar o middleware

// Rota pública - OK
router.get('/', async (req, res) => { /* ... */ });

// Rota para adicionar - PRECISA DE PROTEÇÃO
router.post('/', authMiddleware, async (req, res) => { // <--- ADICIONADO
    // ... (o resto do seu código)
});

// Crie também as rotas de DELETE e PUT/PATCH e proteja-as
router.delete('/:id', authMiddleware, async (req, res) => { // <--- ADICIONADO
    // Lógica para apagar
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