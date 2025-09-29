// backend/routes/auth.js (Atualizado com import/export)
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config'; // Forma de importar o dotenv para carregar as variáveis

const router = express.Router();

router.post('/login', async (req, res) => {
    // ... (O resto da sua lógica de login continua igual)
    try {
        const { username, password } = req.body;
        const isUserValid = username === process.env.ADMIN_USER;
        const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASS);

        if (isUserValid && isPasswordValid) {
            const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        }
        res.status(401).json({ error: 'Credenciais inválidas' });
    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

export default router; // Usamos 'export default'