// backend/routes/projetos.js (Atualizado e Seguro)

const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth');

// Rota PÚBLICA para obter todos os projetos (qualquer pessoa pode ver)
router.get('/', async (req, res) => {
    // ... (código existente, sem alterações)
});

// ===== INÍCIO DA NOVA ROTA =====
// Rota PÚBLICA para obter um único projeto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('projetos')
            .select('*')
            .eq('id', id)
            .single(); // .single() otimiza a busca para um único resultado

        if (error) throw error;
        
        // Se 'data' for nulo, significa que não encontrou o projeto
        if (!data) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        
        res.status(200).json(data);
    } catch (err) {
        console.error('Erro ao buscar projeto por ID:', err.message);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
});
// ===== FIM DA NOVA ROTA =====

// Rota PRIVADA para adicionar um novo projeto (só com token válido)
router.post('/', authMiddleware, async (req, res) => {
    // ... (código existente, sem alterações)
});

// Rota PRIVADA para apagar um projeto
router.delete('/:id', authMiddleware, async (req, res) => {
    // ... (código existente, sem alterações)
});

// Rota PRIVADA para atualizar um projeto (PUT /api/projetos/:id)
router.put('/:id', authMiddleware, async (req, res) => {
    // ... (código existente, sem alterações)
});

module.exports = router;