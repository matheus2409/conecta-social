const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// ===================== ROTA DE REGISTRO (POST) =====================
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Validações
        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        // Verifica se o usuário já existe
        const { data: usuarioExistente } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Evita erro 406 se não encontrar nada

        if (usuarioExistente) {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insere no banco
        const { error } = await supabase
            .from('voluntarios')
            .insert([{ 
                nome: nome, 
                email: email, 
                password_hash: passwordHash,
                interesses: [] 
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Conta criada com sucesso!' });

    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).json({ error: 'Erro interno ao criar conta.' });
    }
});

// ===================== ROTA DE LOGIN =====================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });

        const { data: voluntario, error } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !voluntario) return res.status(401).json({ error: 'Credenciais inválidas.' });

        const passwordValida = await bcrypt.compare(password, voluntario.password_hash);
        if (!passwordValida) return res.status(401).json({ error: 'Credenciais inválidas.' });

        const token = jwt.sign(
            { id: voluntario.id, email: voluntario.email, nome: voluntario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// Rotas de Perfil (Necessárias para não quebrar o módulo)
router.get('/perfil', authMiddleware, async (req, res) => {
    const { data, error } = await supabase.from('voluntarios').select('id, nome, email, bio, interesses').eq('id', req.user.id).single();
    if (error) return res.status(500).json({ error: 'Erro ao buscar perfil' });
    res.json(data);
});

router.put('/perfil', authMiddleware, async (req, res) => {
    const { nome, bio, interesses } = req.body;
    const { error } = await supabase.from('voluntarios').update({ nome, bio, interesses }).eq('id', req.user.id);
    if (error) return res.status(500).json({ error: 'Erro ao atualizar' });
    res.json({ success: true });
});

module.exports = router;