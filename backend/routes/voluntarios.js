const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// === ROTA DE CADASTRO (Salva no Banco) ===
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // 1. Validação
        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter 6 caracteres ou mais.' });
        }

        // 2. Verifica se já existe
        const { data: usuario } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (usuario) {
            return res.status(400).json({ error: 'Este email já está cadastrado.' });
        }

        // 3. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 4. Insere no Supabase
        const { error } = await supabase
            .from('voluntarios')
            .insert([{ 
                nome: nome, 
                email: email, 
                password_hash: hash, // Guarda o hash, não a senha real
                interesses: [] 
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Conta criada com sucesso!' });

    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
    }
});

// === ROTA DE LOGIN (Lê do Banco) ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Busca o usuário
        const { data: user } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        // 2. Verifica se existe e se a senha bate
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // 3. Gera o token de acesso
        const token = jwt.sign(
            { id: user.id, nome: user.nome }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ token });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// Rotas de Perfil (Necessárias para a página seguinte)
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