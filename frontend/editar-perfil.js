document.addEventListener('DOMContentLoaded', async () => {
    // Proteção de rota
    if (!localStorage.getItem('volunteerAuthToken')) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    const form = document.getElementById('editar-perfil-form');
    const nomeInput = document.getElementById('nome');
    const bioInput = document.getElementById('bio');
    const interessesInput = document.getElementById('interesses');
    const feedbackMessage = document.getElementById('feedback-message');

    // 1. Carregar dados atuais
    try {
        const perfil = await fetchFromAPI('/voluntarios/perfil');
        nomeInput.value = perfil.nome || '';
        bioInput.value = perfil.bio || '';
        if (perfil.interesses) {
            interessesInput.value = perfil.interesses.join(', ');
        }
    } catch (error) {
        feedbackMessage.innerHTML = `<div class="alert alert-danger">Erro ao carregar os seus dados.</div>`;
    }

    // 2. Lidar com o envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Converte a string de interesses num array
        const interessesArray = interessesInput.value.split(',')
            .map(item => item.trim())
            .filter(item => item); // Remove itens vazios

        const perfilAtualizado = {
            nome: nomeInput.value,
            bio: bioInput.value,
            interesses: interessesArray,
        };

        try {
            await fetchFromAPI('/voluntarios/perfil', {
                method: 'PUT',
                body: JSON.stringify(perfilAtualizado),
            });
            
            feedbackMessage.innerHTML = `<div class="alert alert-success">Perfil atualizado com sucesso!</div>`;
            setTimeout(() => window.location.href = 'perfil.html', 2000);

        } catch (error) {
            feedbackMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    });
});