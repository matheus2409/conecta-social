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
        console.error('Erro ao buscar projetos [full]:', err);
        try { require('fs').appendFileSync(__dirname + '/../debug.log', `[${new Date().toISOString()}] projetos GET error: ${String(err)}\n`); } catch(e){}
        // Em desenvolvimento, devolver detalhes do erro para ajudar no debug
        res.status(500).json({ error: 'Ocorreu um erro no servidor.', details: err.message || String(err) });
    }
});

// Rota pública para obter um projeto por ID (GET /api/projetos/:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('projetos').select('*').eq('id', id).limit(1);
        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Erro ao buscar projeto por id [full]:', err);
        try { require('fs').appendFileSync(__dirname + '/../debug.log', `[${new Date().toISOString()}] projetos GET/:id error: ${String(err)}\n`); } catch(e){}
        res.status(500).json({ error: 'Ocorreu um erro no servidor.', details: err.message || String(err) });
    }
});

// Rota PRIVADA para adicionar um novo projeto (só com token válido)
router.post('/', authMiddleware, async (req, res) => { // 2. Adicionamos o guarda-costas à rota
    try {
        // Aceitamos os campos enviados pelo frontend e mapeamos para os nomes reais do banco
        const { nome, descricao, link } = req.body;
        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios.' });
        }

        // Mapear para schema do Supabase: 'descricao' -> 'descricao_completa', 'link' -> 'imagem_url'
        const insertRow = {
            nome,
            descricao_completa: descricao,
            imagem_url: link || null
        };

        const { data, error } = await supabase
            .from('projetos')
            .insert([insertRow])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Erro ao adicionar projeto [full]:', err);
        try { require('fs').appendFileSync(__dirname + '/../debug.log', `[${new Date().toISOString()}] projetos POST error: ${String(err)}\n`); } catch(e){}
        res.status(500).json({ error: 'Ocorreu um erro no servidor.', details: err.message || String(err) });
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
        console.error('Erro ao apagar projeto [full]:', err);
        try { require('fs').appendFileSync(__dirname + '/../debug.log', `[${new Date().toISOString()}] projetos DELETE error: ${String(err)}\n`); } catch(e){}
        res.status(500).json({ error: 'Ocorreu um erro no servidor.', details: err.message || String(err) });
    }
});

// Adicione aqui as suas rotas de ATUALIZAR (PUT) e proteja-as da mesma forma.
// Adicione este código em: backend/routes/projetos.js

// Rota PRIVADA para atualizar um projeto (PUT /api/projetos/:id)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, link } = req.body;

        // Validação para garantir que os campos necessários foram enviados
        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('projetos')
            .update({ nome, descricao, link })
            .eq('id', id)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        res.status(200).json(data[0]);

    } catch (err) {
        console.error('Erro ao atualizar projeto [full]:', err);
        try { require('fs').appendFileSync(__dirname + '/../debug.log', `[${new Date().toISOString()}] projetos PUT error: ${String(err)}\n`); } catch(e){}
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao atualizar o projeto.', details: err.message || String(err) });
    }
});

module.exports = router;