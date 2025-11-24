const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Rota de Registro (CORRIGIDA para /registro)
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        }

        // Verifica se já existe
        const { data: usuario } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (usuario) {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }

        // Cria o hash e salva
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const { error } = await supabase
            .from('voluntarios')
            .insert([{ nome, email, password_hash: hash, interesses: [] }]);

        if (error) throw error;

        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar conta.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// Rotas de Perfil
router.get('/perfil', authMiddleware, async (req, res) => {
    const { data } = await supabase.from('voluntarios').select('id, nome, email, bio, interesses').eq('id', req.user.id).single();
    res.json(data);
});

router.put('/perfil', authMiddleware, async (req, res) => {
    const { nome, bio, interesses } = req.body;
    await supabase.from('voluntarios').update({ nome, bio, interesses }).eq('id', req.user.id);
    res.json({ success: true });
});

module.exports = router;