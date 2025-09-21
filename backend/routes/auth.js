const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Rota de Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Pega as credenciais do arquivo .env
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    const jwtSecret = process.env.JWT_SECRET;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    // Verifica se as credenciais estão corretas
    if (username === adminUser && password === adminPass) {
        // Gera o token JWT
        const token = jwt.sign({ username: adminUser }, jwtSecret, { expiresIn: '8h' }); // Token expira em 8 horas
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Credenciais inválidas.' });
});

module.exports = router;