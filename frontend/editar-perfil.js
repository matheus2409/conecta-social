import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica login
    if (!localStorage.getItem('volunteerAuthToken')) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    const nomeInput = document.getElementById('nome');
    const bioInput = document.getElementById('bio');
    const interessesInput = document.getElementById('interesses');
    const form = document.getElementById('editar-perfil-form');
    const feedback = document.getElementById('feedback-message');

    // 1. Carregar dados atuais para preencher o formulário
    try {
        const perfil = await fetchFromAPI('/voluntarios/perfil');
        
        nomeInput.value = perfil.nome || '';
        bioInput.value = perfil.bio || '';
        
        // Se interesses for um array, junta com vírgulas para mostrar no input
        if (Array.isArray(perfil.interesses)) {
            interessesInput.value = perfil.interesses.join(', ');
        } else {
            interessesInput.value = '';
        }

    } catch (error) {
        console.error(error);
        feedback.textContent = 'Erro ao carregar dados.';
        feedback.style.color = '#ff4444';
    }

    // 2. Salvar alterações
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.textContent = 'A guardar...';
        feedback.style.color = '#fff';

        // Transforma a string de interesses num array limpo
        const interessesArray = interessesInput.value
            .split(',')
            .map(item => item.trim()) // Remove espaços extras
            .filter(item => item !== ''); // Remove itens vazios

        const dadosAtualizados = {
            nome: nomeInput.value,
            bio: bioInput.value,
            interesses: interessesArray
        };

        try {
            await fetchFromAPI('/voluntarios/perfil', {
                method: 'PUT',
                body: JSON.stringify(dadosAtualizados)
            });

            feedback.textContent = 'Perfil atualizado com sucesso!';
            feedback.style.color = '#1ed760';

            // Redireciona de volta ao perfil após 1 segundo
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);

        } catch (error) {
            console.error(error);
            feedback.textContent = 'Erro ao atualizar: ' + error.message;
            feedback.style.color = '#ff4444';
        }
    });
});