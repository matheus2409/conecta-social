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

        // Se o Supabase retornar um erro, nós vamos registá-lo e enviá-lo
        if (error) {
            // Log detalhado para a Vercel
            console.error('Erro detalhado do Supabase:', JSON.stringify(error, null, 2));
            // Lança o erro para ser apanhado pelo bloco catch
            throw new Error(error.message);
        }

        res.json(data);

    } catch (error) {
        // Log do erro no servidor da Vercel
        console.error('Crash na rota /api/projetos:', error);
        
        // Envia uma resposta de erro 500 mais informativa
        res.status(500).json({ 
            message: 'Erro interno no servidor ao buscar projetos.',
            error: error.message 
        });
    }
});

// As rotas abaixo (GET por ID, POST, PUT, DELETE) permanecem iguais.
// Cole o resto do seu código para essas rotas aqui.

// Rota GET para buscar um projeto por ID (pública)
router.get('/:id', async (req, res) => {
    // ... seu código original ...
});

// Rota para CRIAR um novo projeto (protegida por token)
router.post('/', verifyToken, async (req, res) => {
    // ... seu código original ...
});

// Rota para ATUALIZAR um projeto (protegida por token)
router.put('/:id', verifyToken, async (req, res) => {
    // ... seu código original ...
});

// Rota para DELETAR um projeto (protegida por token)
router.delete('/:id', verifyToken, async (req, res) => {
    // ... seu código original ...
});

module.exports = router;