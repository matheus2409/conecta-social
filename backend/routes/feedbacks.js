// backend/routes/feedbacks.js (Atualizado e Seguro)

const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Corrigido para pegar do db.js
const authMiddleware = require('../middleware/auth');

// Rota PÚBLICA para criar um novo feedback
router.post('/', async (req, res) => {
    const { nome_usuario, mensagem, id_do_projeto } = req.body;

    if (!nome_usuario || !mensagem || !id_do_projeto) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('feedbacks')
            .insert([{ nome_usuario, mensagem, id_do_projeto }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Feedback enviado com sucesso!', data: data[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o feedback: ' + error.message });
    }
});

// Exemplo: Rota PRIVADA para ver ou apagar feedbacks (só para o admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase.from('feedbacks').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar feedbacks: ' + error.message });
    }
});

module.exports = router;