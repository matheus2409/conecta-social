import { login } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.classList.add('d-none'); // Esconde a mensagem de erro

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido');
            }

            login(data.token);
            window.location.href = '/admin.html'; // Redireciona para a página principal do admin

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('d-none');
        }
    });
});