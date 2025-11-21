const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// ===================== ROTA DE REGISTO (NOVA) =====================
router.post('/registo', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // 1. Validação básica
        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        // 2. Verificar se o email já existe no banco
        const { data: usuarioExistente, error: checkError } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Usa maybeSingle para não dar erro se não encontrar

        if (usuarioExistente) {
            return res.status(400).json({ error: 'Este email já está registado.' });
        }

        // 3. Criptografar a senha (Hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Inserir o novo voluntário no Supabase
        const { data, error } = await supabase
            .from('voluntarios')
            .insert([{ 
                nome: nome, 
                email: email, 
                password_hash: passwordHash,
                interesses: [] // Inicia com array vazio
            }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Voluntário registado com sucesso!' });

    } catch (err) {
        console.error('Erro no registo:', err.message);
        res.status(500).json({ error: 'Erro interno ao criar conta.' });
    }
});

// ===================== ROTA DE LOGIN (JÁ EXISTENTE) =====================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const { data: voluntario, error } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !voluntario) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const passwordValida = await bcrypt.compare(password, voluntario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id: voluntario.id, email: voluntario.email, nome: voluntario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token });

    } catch (err) {
        console.error('Erro no login do voluntário:', err.message);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// ===================== ROTA DE PERFIL - ATUALIZAR (JÁ EXISTENTE) =====================
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const voluntarioId = req.user.id;
        const { nome, bio, interesses } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O nome é obrigatório.' });
        }

        if (interesses && !Array.isArray(interesses)) {
            return res.status(400).json({ error: 'Os interesses devem ser uma lista (array).' });
        }

        const { data, error } = await supabase
            .from('voluntarios')
            .update({ nome, bio, interesses })
            .eq('id', voluntarioId)
            .select('id, nome, email, bio, interesses');

        if (error) throw error;

        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Erro ao atualizar o perfil:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
    }
});

// ===================== ROTA DE PERFIL - OBTER (JÁ EXISTENTE) =====================
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const voluntarioId = req.user.id;

        const { data, error } = await supabase
            .from('voluntarios')
            .select('id, nome, email, bio, interesses')
            .eq('id', voluntarioId)
            .single();

        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter dados do perfil.' });
    }
});

module.exports = router;