// backend/routes/auth.js (Atualizado)
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <-- Importar
const router = express.Router();
require('dotenv').config();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Compara o username (continua em texto puro, o que é normal)
        const isUserValid = username === process.env.ADMIN_USER;

        // Compara a senha enviada com o HASH armazenado de forma segura
        const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASS);

        if (isUserValid && isPasswordValid) {
            // Se ambos forem válidos, gera o token
            const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        }

        // Mensagem de erro genérica por segurança
        res.status(401).json({ error: 'Credenciais inválidas' });

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;