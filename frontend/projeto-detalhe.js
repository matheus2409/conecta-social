// frontend/projeto-detalhe.js (Corrigido)

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
        // Usa a função fetchFromAPI para buscar o projeto pelo ID
        const projeto = await fetchFromAPI(`/projetos/${projetoId}`);

        document.title = `${projeto.titulo} - Conecta Social`;
        
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

    // ... (restante da lógica do formulário de feedback)
});