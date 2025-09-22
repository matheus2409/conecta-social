const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// Rota para criar um novo feedback
router.post('/', async (req, res) => {
    const { nome_usuario, mensagem, id_do_projeto } = req.body;

    if (!nome_usuario || !mensagem || !id_do_projeto) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('feedbacks') // Supondo que você tenha uma tabela 'feedbacks'
            .insert([{ nome_usuario, mensagem, id_do_projeto }]);

        if (error) {
            throw error;
        }
        res.status(201).json({ message: 'Feedback enviado com sucesso!', data });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o feedback: ' + error.message });
    }
});

module.exports = router;