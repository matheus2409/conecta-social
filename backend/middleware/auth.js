// backend/middleware/auth.js (Atualizado com import/export)
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Lê o cabeçalho Authorization no formato: "Bearer <token>"
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido.' });
    }
}

module.exports = verifyToken;