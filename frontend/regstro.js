// frontend/registo.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registo-voluntario-form');
    const feedbackMessage = document.getElementById('feedback-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpa mensagens anteriores
        feedbackMessage.textContent = 'A processar...';
        feedbackMessage.style.color = '#fff'; // Cor neutra temporária

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Envia os dados para a nova rota de registo
            await fetchFromAPI('/voluntarios/registo', {
                method: 'POST',
                body: JSON.stringify({ nome, email, password })
            });

            // Sucesso
            feedbackMessage.textContent = 'Conta criada com sucesso! A redirecionar...';
            feedbackMessage.style.color = 'lightgreen'; // Verde para sucesso
            
            // Espera 2 segundos e vai para o login
            setTimeout(() => {
                window.location.href = 'login-voluntario.html';
            }, 2000);

        } catch (error) {
            console.error('Erro no registo:', error);
            feedbackMessage.textContent = error.message || 'Erro ao criar conta. Tente novamente.';
            feedbackMessage.style.color = '#ff4444'; // Vermelho para erro
        }
    });
});