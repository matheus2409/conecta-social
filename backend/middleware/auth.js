// backend/middleware/auth.js (Atualizado com import/export)
import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    // ... (A lógica interna da função continua igual)
    const authHeader = req.headers['authorization'];
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

export default verifyToken; // Usamos 'export default'