document.addEventListener('DOMContentLoaded', () => {
    const areaDetalhe = document.getElementById('detalhe-projeto');
    const formFeedback = document.getElementById('form-feedback');

    // Pega o ID do projeto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');

    if (!projetoId) {
        areaDetalhe.innerHTML = '<h2 class="text-danger text-center">ID do projeto não fornecido.</h2>';
        return;
    }

    // Busca os dados do projeto específico
    fetch(`/api/projetos/${projetoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Projeto não encontrado');
            }
            return response.json();
        })
        .then(projeto => {
            // Atualiza o título da página
            document.title = `${projeto.nome} - Conecta Social`;
            
            // Cria o HTML com o novo layout
            const detalheHTML = `
                <div class="detalhe-container">
                    <header class="detalhe-header">
                        <img src="${projeto.imagem_url}" alt="Imagem do projeto ${projeto.nome}">
                    </header>
                    <div class="detalhe-conteudo">
                        <span class="categoria-tag">${projeto.categoria}</span>
                        <h1>${projeto.nome}</h1>
                        
                        <div class="info-item">
                            <strong>Local:</strong>
                            <span>${projeto.local}</span>
                        </div>
                        <div class="info-item">
                            <strong>Contato:</strong>
                            <span>${projeto.nome_contato} (${projeto.contato})</span>
                        </div>

                        <div class="descricao-completa">
                            <p>${projeto.descricao_completa.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                </div>
            `;
            areaDetalhe.innerHTML = detalheHTML;
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do projeto:', error);
            areaDetalhe.innerHTML = '<h2 class="text-danger text-center">Não foi possível carregar o projeto.</h2>';
        });

    // Lógica para o formulário de feedback (mantida)
    if (formFeedback) {
        formFeedback.addEventListener('submit', (event) => {
            event.preventDefault();
            const nomeUsuario = document.getElementById('nome_usuario').value;
            const mensagem = document.getElementById('mensagem').value;

            const feedbackData = {
                nome_usuario: nomeUsuario,
                mensagem: mensagem,
                id_do_projeto: projetoId
            };

            fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Obrigado pelo seu feedback!');
                formFeedback.reset();
            })
            .catch(error => {
                console.error('Erro ao enviar feedback:', error);
                alert('Ocorreu um erro ao enviar seu feedback.');
            });
        });
    }
});