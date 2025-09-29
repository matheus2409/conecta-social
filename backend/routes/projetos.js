// backend/routes/projetos.js (Atualizado e Seguro)

const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth'); // 1. Importamos o nosso guarda-costas

// Rota PÚBLICA para obter todos os projetos (qualquer pessoa pode ver)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('projetos').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Erro ao buscar projetos:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});

// Rota PRIVADA para adicionar um novo projeto (só com token válido)
router.post('/', authMiddleware, async (req, res) => { // 2. Adicionamos o guarda-costas à rota
    try {
        const { nome, descricao, link } = req.body;
        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios.' });
        }
        const { data, error } = await supabase
            .from('projetos')
            .insert([{ nome, descricao, link }])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Erro ao adicionar projeto:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});

// Rota PRIVADA para apagar um projeto
router.delete('/:id', authMiddleware, async (req, res) => { // 3. Protegemos também a rota de apagar
    try {
        const { id } = req.params;
        const { error } = await supabase.from('projetos').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: 'Projeto apagado com sucesso!' });
    } catch (err) {
        console.error('Erro ao apagar projeto:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});

// Adicione aqui as suas rotas de ATUALIZAR (PUT) e proteja-as da mesma forma.

module.exports = router;