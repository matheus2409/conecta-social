// frontend/login-voluntario.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-voluntario-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchFromAPI('/voluntarios/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data.token) {
                // Guarda o token com um nome diferente do token de admin
                localStorage.setItem('volunteerAuthToken', data.token);
                window.location.href = 'perfil.html'; // Redireciona para a página de perfil
            } else {
                throw new Error('Token não recebido do servidor.');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});