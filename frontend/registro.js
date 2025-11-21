import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registo-voluntario-form');
    const feedbackMessage = document.getElementById('feedback-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        feedbackMessage.textContent = 'Processando...';
        feedbackMessage.style.color = '#fff';

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await fetchFromAPI('/voluntarios/registro', {
                method: 'POST',
                body: JSON.stringify({ nome, email, password })
            });

            feedbackMessage.textContent = 'Conta criada com sucesso! Redirecionando...';
            feedbackMessage.style.color = 'lightgreen';
            
            setTimeout(() => {
                window.location.href = 'login-voluntario.html';
            }, 2000);

        } catch (error) {
            console.error('Erro no cadastro:', error);
            feedbackMessage.textContent = error.message || 'Erro ao criar conta.';
            feedbackMessage.style.color = '#ff4444';
        }
    });
});