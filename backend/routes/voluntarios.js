const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// ===================== ROTA DE REGISTRO (Com R) =====================
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha precisa de 6 caracteres.' });
        }

        // Verifica se já existe
        const { data: usuarioExistente } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (usuarioExistente) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Salva no banco
        const { error } = await supabase
            .from('voluntarios')
            .insert([{ 
                nome: nome, 
                email: email, 
                password_hash: passwordHash,
                interesses: [] 
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Sucesso!' });

    } catch (err) {
        console.error('Erro registro:', err.message);
        res.status(500).json({ error: 'Erro no servidor ao criar conta.' });
    }
});

// ===================== ROTA DE LOGIN =====================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Faltam dados.' });

        const { data: voluntario, error } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !voluntario) return res.status(401).json({ error: 'Email não encontrado.' });

        const senhaValida = await bcrypt.compare(password, voluntario.password_hash);
        if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta.' });

        const token = jwt.sign(
            { id: voluntario.id, email: voluntario.email, nome: voluntario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// Rotas de Perfil (Necessárias para não quebrar o app)
router.get('/perfil', authMiddleware, async (req, res) => {
    const { data } = await supabase.from('voluntarios').select('*').eq('id', req.user.id).single();
    res.json(data);
});

router.put('/perfil', authMiddleware, async (req, res) => {
    const { nome, bio, interesses } = req.body;
    await supabase.from('voluntarios').update({ nome, bio, interesses }).eq('id', req.user.id);
    res.json({ success: true });
});

module.exports = router;