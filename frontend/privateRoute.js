import { isAuthenticated } from './auth.js';

// Verifica se o usuário está autenticado
if (!isAuthenticated() && window.location.pathname !== '/login.html') {
    // Se não estiver logado e não estiver na página de login, redireciona
    window.location.href = '/login.html';
}