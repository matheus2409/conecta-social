// backend/routes/voluntarios.js
const express = require('express');
const router = express.Router(); // <--- Esta linha estava em falta!
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Conexão com o banco
const authMiddleware = require('../middleware/auth');

// === 1. REGISTO DE VOLUNTÁRIO (Público) ===
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Verifica se o email já existe
        const userCheck = await db.query('SELECT * FROM voluntarios WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insere no banco
        const query = `
            INSERT INTO voluntarios (nome, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email;
        `;
        const result = await db.query(query, [nome, email, password_hash]);

        res.status(201).json({ message: 'Voluntário criado com sucesso!', user: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registar voluntário.' });
    }
});

// === 2. LOGIN (Público) ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca o usuário pelo email
        const query = 'SELECT * FROM voluntarios WHERE email = $1';
        const result = await db.query(query, [email]);
        const user = result.rows[0];

        // Verifica se o usuário existe e se a senha bate
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                nome: user.nome,
                role: 'voluntario' 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// === 3. OBTER PERFIL (Privado) ===
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        // O ID vem do token (req.user.id)
        const result = await db.query('SELECT id, nome, email, bio, interesses FROM voluntarios WHERE id = $1', [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Voluntário não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
});

// === 4. ATUALIZAR PERFIL (Privado) ===
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const { nome, bio, interesses } = req.body;
        const id = req.user.id;

        const query = `
            UPDATE voluntarios 
            SET nome = $1, bio = $2, interesses = $3
            WHERE id = $4
            RETURNING id, nome, email, bio, interesses;
        `;
        
        const result = await db.query(query, [nome, bio, interesses, id]);
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});

module.exports = router;