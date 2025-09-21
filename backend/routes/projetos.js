const express = require('express');
const { supabase } = require('../db'); // Supondo que você crie um arquivo db.js para a conexão

const router = express.Router();

// GET /api/projetos - Rota para listar projetos com busca, filtro e paginação
router.get('/', async (req, res) => {
    try {
        const { q, categoria, pagina = 1 } = req.query;
        const projetosPorPagina = 6; // Defina quantos projetos por página
        const offset = (pagina - 1) * projetosPorPagina;

        let query = supabase.from('projetos').select('*', { count: 'exact' });

        // Filtro de busca por título (case-insensitive)
        if (q) {
            query = query.ilike('titulo', `%${q}%`);
        }

        // Filtro por categoria
        if (categoria) {
            query = query.eq('categoria', categoria);
        }

        // Ordena pelos mais recentes
        query = query.order('id', { ascending: false });

        // Paginação
        query = query.range(offset, offset + projetosPorPagina - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        res.json({
            projetos: data,
            total: count,
            paginaAtual: parseInt(pagina),
            totalDePaginas: Math.ceil(count / projetosPorPagina)
        });

    } catch (error) {
        console.error('Erro ao buscar projetos:', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
});

// GET /api/projetos/:id - Rota para obter um único projeto
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('projetos')
            .select('*')
            .eq('id', id)
            .single(); // .single() retorna um objeto único ou null, e erro se não encontrar

        if (error) {
            if (error.code === 'PGRST116') { // Código de erro do PostgREST para "not found"
                return res.status(404).json({ error: 'Projeto não encontrado.' });
            }
            throw error;
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erro ao buscar o projeto: ${error.message}` });
    }
});

// POST /api/projetos - Rota para criar um novo projeto
router.post('/', async (req, res) => {
    try {
        const { titulo, descricao, imagem_url, localizacao, categoria } = req.body;

        if (!titulo || !descricao || !categoria) {
            return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('projetos')
            .insert([{ titulo, descricao, imagem_url, localizacao, categoria }])
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: `Erro ao criar projeto: ${error.message}` });
    }
});

// PUT /api/projetos/:id - Rota para atualizar um projeto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, imagem_url, localizacao, categoria } = req.body;
        
        if (!titulo || !descricao || !categoria) {
            return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios.' });
        }
        
        const { data, error } = await supabase
            .from('projetos')
            .update({ titulo, descricao, imagem_url, localizacao, categoria })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        
        if (!data) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erro ao atualizar projeto: ${error.message}` });
    }
});

// DELETE /api/projetos/:id - Rota para apagar um projeto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('projetos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        res.status(204).send(); // 204 No Content - sucesso sem corpo de resposta
    } catch (error) {
        res.status(500).json({ error: `Erro ao deletar projeto: ${error.message}` });
    }
});

module.exports = router;