// backend/routes/voluntarios.js (Versão AWS RDS / PostgreSQL)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão AWS configurada no db.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// === ROTA DE REGISTO ===
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        // 1. Verificar se email já existe (SQL)
        const checkQuery = 'SELECT id FROM voluntarios WHERE email = $1';
        const checkResult = await db.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Este email já está registado.' });
        }

        // 2. Criar hash da senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 3. Inserir no banco (SQL)
        // O PostgreSQL converte automaticamente arrays JS [] para arrays Postgres {}
        const insertQuery = `
            INSERT INTO voluntarios (nome, email, password_hash, interesses)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, email;
        `;
        const values = [nome, email, hash, []]; // Interesses começa vazio

        await db.query(insertQuery, values);

        res.status(201).json({ message: 'Conta criada com sucesso!' });

    } catch (err) {
        console.error('Erro no registo:', err);
        res.status(500).json({ error: 'Erro ao criar conta.' });
    }
});

// === ROTA DE LOGIN ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Buscar utilizador (SQL)
        const query = 'SELECT * FROM voluntarios WHERE email = $1';
        const result = await db.query(query, [email]);
        const user = result.rows[0];

        // 2. Verificar senha
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // 3. Gerar token
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

// === ROTA DE PERFIL (Ler Dados) ===
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const idUsuario = req.user.id;
        
        const query = 'SELECT id, nome, email, bio, interesses FROM voluntarios WHERE id = $1';
        const result = await db.query(query, [idUsuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Perfil não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ error: 'Erro ao carregar perfil.' });
    }
});

// === ROTA DE ATUALIZAR PERFIL ===
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const { nome, bio, interesses } = req.body;
        const idUsuario = req.user.id;

        if (!nome) return res.status(400).json({ error: 'O nome é obrigatório.' });

        // Atualização SQL
        const query = `
            UPDATE voluntarios 
            SET nome = $1, bio = $2, interesses = $3
            WHERE id = $4
        `;
        // O driver 'pg' lida com a conversão do array de interesses automaticamente
        const values = [nome, bio, interesses, idUsuario];

        await db.query(query, values);

        res.json({ success: true, message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        res.status(500).json({ error: 'Não foi possível atualizar o perfil.' });
    }
});

module.exports = router;