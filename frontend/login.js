// frontend/login.js (Corrigido)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Limpa mensagens de erro antigas

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Usa a função centralizada para a chamada de login
            const data = await fetchFromAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (data.token) {
                // Guarda o token no armazenamento local do navegador
                localStorage.setItem('authToken', data.token);
                // Redireciona para a página de administração
                window.location.href = 'admin.html';
            } else {
                throw new Error('Token não recebido do servidor.');
            }

        } catch (error) {
            console.error('Falha no login:', error);
            errorMessage.textContent = error.message;
        }
    });
});