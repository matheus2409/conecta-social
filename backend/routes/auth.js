// backend/routes/auth.js
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
    
    // Verifica a senha do admin (definida no .env ou hardcoded se preferires por agora)
    // Nota: O ideal é que ADMIN_PASS no .env seja o hash, mas para facilitar, vamos assumir que comparas
    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASS);

    if (isUserValid && isPasswordValid) {
      // AQUI ESTÁ A MUDANÇA: Adicionamos role: 'admin'
      const token = jwt.sign(
        { 
            id: 'admin', // ID fictício para o admin
            nome: 'Administrador',
            role: 'admin' // <--- O SUPER PODER
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
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