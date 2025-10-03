// backend/routes/auth.js (CommonJS)
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const isUserValid = username === process.env.ADMIN_USER;
        // Note: ADMIN_PASS should be the hashed password stored in env for comparison
        const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASS || '');

        if (isUserValid && isPasswordValid) {
            const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        }
        res.status(401).json({ error: 'Credenciais inválidas' });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;