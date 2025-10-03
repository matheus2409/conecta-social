// frontend/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // URL da sua API de autenticação (ajustada para a porta do backend)
    const apiUrl = 'http://localhost:3001/api/auth/login';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Limpa mensagens de erro antigas

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Se a resposta não for 2xx, o erro vem do backend
                throw new Error(data.error || 'Erro desconhecido');
            }

            // Se o login for bem-sucedido, data terá o token
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