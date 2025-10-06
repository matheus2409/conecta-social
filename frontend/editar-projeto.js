// frontend/editar-projeto.js

document.addEventListener('DOMContentLoaded', () => {
    // Proteção de rota
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('edit-projeto-form');
    // ... (outras declarações de variáveis)
    const feedbackMessage = document.getElementById('feedback-message');
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');

    if (!projetoId) {
        window.location.href = 'admin.html';
        return;
    }

    /**
     * Busca os dados do projeto específico e preenche o formulário.
     */
    async function carregarDadosDoProjeto() {
        try {
            // AGORA CHAMA A ROTA OTIMIZADA!
            const projeto = await fetchFromAPI(`/projetos/${projetoId}`);

            if (projeto) {
                projetoIdInput.value = projeto.id;
                nomeInput.value = projeto.nome;
                descricaoInput.value = projeto.descricao;
                linkInput.value = projeto.link || '';
            } else {
                throw new Error('Projeto não encontrado.');
            }
        } catch (error) {
            feedbackMessage.innerHTML = `<div class="alert alert-danger">Erro ao carregar dados do projeto: ${error.message}</div>`;
        }
    }

    form.addEventListener('submit', async (e) => {
        // ... (lógica do submit, sem alterações)
    });

    carregarDadosDoProjeto();
});