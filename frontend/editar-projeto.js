// frontend/editar-projeto.js

document.addEventListener('DOMContentLoaded', () => {
    // Proteção de rota: se não houver token, volta para o login
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    // Pega os elementos do formulário
    const form = document.getElementById('edit-projeto-form');
    const projetoIdInput = document.getElementById('projeto-id');
    const nomeInput = document.getElementById('nome');
    const descricaoInput = document.getElementById('descricao');
    const linkInput = document.getElementById('link');
    const feedbackMessage = document.getElementById('feedback-message');

    // Extrai o ID do projeto da URL da página
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');

    // Se não houver ID na URL, é um erro. Volta para a página de admin.
    if (!projetoId) {
        window.location.href = 'admin.html';
        return;
    }

    /**
     * Busca os dados do projeto específico e preenche o formulário.
     */
    async function carregarDadosDoProjeto() {
        try {
            // Nota: Precisamos de uma rota no backend para buscar UM projeto por ID.
            // Vamos usar a rota de buscar todos e filtrar por enquanto.
            const projetos = await fetchFromAPI('/projetos');
            const projeto = projetos.find(p => p.id == projetoId);

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

    /**
     * Lida com o envio do formulário de edição.
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projetoAtualizado = {
            nome: nomeInput.value,
            descricao: descricaoInput.value,
            link: linkInput.value,
        };

        try {
            await fetchFromAPI(`/projetos/${projetoId}`, {
                method: 'PUT',
                body: JSON.stringify(projetoAtualizado),
            });
            
            feedbackMessage.innerHTML = `<div class="alert alert-success">Projeto atualizado com sucesso! A redirecionar...</div>`;

            // Espera 2 segundos e redireciona de volta para a página de admin
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);

        } catch (error) {
            feedbackMessage.innerHTML = `<div class="alert alert-danger">Erro ao salvar as alterações: ${error.message}</div>`;
        }
    });

    // Inicia o processo carregando os dados do projeto
    carregarDadosDoProjeto();
});