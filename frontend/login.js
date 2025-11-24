import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = 'Verificando...'; 
        errorMessage.style.color = '#fff';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchFromAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'admin.html';
            } else {
                throw new Error('Token inválido.');
            }
        } catch (error) {
            errorMessage.style.color = '#ff4444';
            errorMessage.textContent = error.message;
        }
    });
});