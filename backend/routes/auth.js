// backend/routes/auth.js (versão final e segura)

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const isUserValid = username === process.env.ADMIN_USER;

    //  Importante: ADMIN_PASS deve estar armazenado como HASH
    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASS);

    if (isUserValid && isPasswordValid) {
      const token = jwt.sign(
        { user: username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    }

    res.status(401).json({ error: 'Credenciais inválidas.' });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
