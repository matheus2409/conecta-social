import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-voluntario-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = 'Entrando...';
        errorMessage.style.color = '#fff';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchFromAPI('/voluntarios/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data.token) {
                localStorage.setItem('volunteerAuthToken', data.token);
                window.location.href = 'perfil.html'; 
            } else {
                throw new Error('Erro de autenticação.');
            }
        } catch (error) {
            errorMessage.style.color = '#ff4444';
            errorMessage.textContent = error.message;
        }
    });
});