// backend/middleware/auth.js (versão final e segura)

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o token JWT enviado pelo cliente.
 * - O token deve vir no cabeçalho: Authorization: Bearer <token>
 */
module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  // Se não houver header de autorização
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação ausente.' });
  }

  // Extrai o token (remove o prefixo "Bearer ")
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido.' });
  }

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o usuário decodificado ao request (caso precise depois)
    req.user = decoded;

    next(); // Passa para o próximo middleware/rota
  } catch (err) {
    console.error('❌ Erro ao verificar token JWT:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado. Faça login novamente.' });
    }

    res.status(403).json({ error: 'Token inválido ou corrompido.' });
  }
};
