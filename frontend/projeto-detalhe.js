// frontend/projeto-detalhe.js
import { getProjetoPorId } from './apiService.js'; // Importa a função padronizada

document.addEventListener('DOMContentLoaded', async () => {
    const areaDetalhe = document.getElementById('detalhe-projeto');
    const formFeedback = document.getElementById('form-feedback');

    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');

    if (!projetoId) {
        areaDetalhe.innerHTML = '<h2 class="text-danger text-center">ID do projeto não fornecido.</h2>';
        return;
    }

    try {
        // Busca os dados do projeto específico usando a apiService
        const projeto = await getProjetoPorId(projetoId);

        // Atualiza o título da página
        document.title = `${projeto.titulo} - Conecta Social`;
        
        // Cria o HTML com os nomes de propriedades corretos
        const detalheHTML = `
            <div class="detalhe-container">
                <header class="detalhe-header">
                    <img src="${projeto.imagem_url || 'https://via.placeholder.com/1200x400?text=Sem+Imagem'}" alt="Imagem do projeto ${projeto.titulo}">
                </header>
                <div class="detalhe-conteudo">
                    <span class="categoria-tag">${projeto.categoria}</span>
                    <h1>${projeto.titulo}</h1>
                    
                    <div class="info-item">
                        <strong>Local:</strong>
                        <span>${projeto.localizacao}</span>
                    </div>

                    <div class="descricao-completa">
                        <p>${projeto.descricao.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
        areaDetalhe.innerHTML = detalheHTML;
    } catch (error) {
        console.error('Erro ao buscar detalhes do projeto:', error);
        areaDetalhe.innerHTML = `<h2 class="text-danger text-center">Não foi possível carregar o projeto: ${error.message}</h2>`;
    }

    // Lógica para o formulário de feedback (Sugestão de melhoria no backend)
    if (formFeedback) {
        formFeedback.addEventListener('submit', async (event) => {
            event.preventDefault();
            alert('Funcionalidade de feedback em desenvolvimento.');
            // A lógica de envio foi comentada pois a rota /api/feedbacks não foi implementada no backend.
            /*
            const nomeUsuario = document.getElementById('nome_usuario').value;
            const mensagem = document.getElementById('mensagem').value;

            const feedbackData = {
                nome_usuario: nomeUsuario,
                mensagem: mensagem,
                id_do_projeto: projetoId
            };

            try {
                const response = await fetch('/api/feedbacks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(feedbackData)
                });

                if (!response.ok) {
                    throw new Error('Falha ao enviar feedback.');
                }

                alert('Obrigado pelo seu feedback!');
                formFeedback.reset();
            } catch (error) {
                console.error('Erro ao enviar feedback:', error);
                alert(`Ocorreu um erro ao enviar seu feedback: ${error.message}`);
            }
            */
        });
    }
});