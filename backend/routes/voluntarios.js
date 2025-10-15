const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth'); // O mesmo middleware de admin funciona aqui

// ===================== ROTA DE REGISTO (JÁ EXISTENTE) =====================
router.post('/registo', async (req, res) => {
    // ... (O teu código de registo que já criámos)
});

// ===================== NOVA ROTA DE LOGIN =====================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        // 1. Encontra o voluntário pelo email
        const { data: voluntario, error } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !voluntario) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha enviada com o hash guardado
        const passwordValida = await bcrypt.compare(password, voluntario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gera o Token JWT com os dados do voluntário
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
// ===================== NOVA ROTA - ATUALIZAR PERFIL (PROTEGIDA) =====================
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const voluntarioId = req.user.id; // ID obtido do token verificado
        const { nome, bio, interesses } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O nome é obrigatório.' });
        }

        // Os interesses devem ser um array de strings
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

// ===================== NOVA ROTA DE PERFIL (PROTEGIDA) =====================
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        // O ID do voluntário vem do token, que o middleware já verificou
        const voluntarioId = req.user.id;

        const { data, error } = await supabase
            .from('voluntarios')
            .select('id, nome, email, bio, interesses') // Seleciona apenas os dados seguros
            .eq('id', voluntarioId)
            .single();

        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter dados do perfil.' });
    }
});

module.exports = router;