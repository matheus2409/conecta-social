// backend/routes/voluntarios.js
const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Importa a conexão do db.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// === ROTA DE REGISTO (Cria a conta) ===
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Validação básica
        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        // Verifica se o email já existe
        const { data: userCheck } = await supabase
            .from('voluntarios')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (userCheck) {
            return res.status(400).json({ error: 'Este email já está registado.' });
        }

        // Cria o hash da senha (segurança)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Insere no banco de dados
        const { error } = await supabase
            .from('voluntarios')
            .insert([{ 
                nome, 
                email, 
                password_hash: hash, 
                interesses: [] // Começa com lista vazia
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Conta criada com sucesso!' });

    } catch (err) {
        console.error('Erro no registo:', err);
        res.status(500).json({ error: 'Erro ao criar conta.' });
    }
});

// === ROTA DE LOGIN (Entrar) ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca o utilizador pelo email
        const { data: user } = await supabase
            .from('voluntarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        // Verifica se o utilizador existe e se a senha bate
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Gera o token de acesso (válido por 8 horas)
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

// === ROTA DE PERFIL (Ver dados) ===
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        // O ID vem do token (req.user.id) decodificado pelo authMiddleware
        const { data, error } = await supabase
            .from('voluntarios')
            .select('id, nome, email, bio, interesses') // Seleciona apenas o necessário
            .eq('id', req.user.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ error: 'Erro ao carregar perfil.' });
    }
});

// === ROTA DE ATUALIZAR PERFIL (Editar dados) ===
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const { nome, bio, interesses } = req.body;

        // Validação simples
        if (!nome) {
            return res.status(400).json({ error: 'O nome é obrigatório.' });
        }

        // Atualiza os dados no Supabase
        const { error } = await supabase
            .from('voluntarios')
            .update({ 
                nome, 
                bio, 
                interesses // Espera-se um array de strings ["Arte", "Educação"]
            })
            .eq('id', req.user.id);

        if (error) throw error;

        res.json({ success: true, message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        res.status(500).json({ error: 'Não foi possível atualizar o perfil.' });
    }
});

module.exports = router;