document.addEventListener('DOMContentLoaded', () => {
    const esportesContainer = document.getElementById('esportes-container');
    const loadingIndicator = document.getElementById('loading');

    const carregarEsportes = async () => {
        loadingIndicator.style.display = 'block';
        esportesContainer.innerHTML = '';

        try {
            const response = await fetch('http://localhost:3001/api/esportes');

            if (!response.ok) {
                throw new Error('Erro ao buscar dados de esportes.');
            }

            const esportes = await response.json();

            if (esportes.length === 0) {
                // Usamos uma classe de alerta do Bootstrap para a mensagem
                esportesContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum conteúdo de esporte disponível no momento.</div></div>';
            } else {
                let cardsHTML = '';
                esportes.forEach((item, index) => {
                    // Define o tamanho da coluna. O primeiro item (destaque) será maior.
                    const colClass = index === 0 ? 'col-lg-8' : 'col-lg-4';
                    
                    cardsHTML += `
                        <div class="${colClass} mb-4">
                            <div class="card h-100 shadow-sm">
                                <img src="${item.imagem_url || 'https://via.placeholder.com/600x400'}" class="card-img-top" alt="Imagem para ${item.titulo}">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${item.titulo || 'Título indisponível'}</h5>
                                    <p class="card-text flex-grow-1">${item.resumo || 'Resumo não disponível.'}</p>
                                    <a href="esporte-detalhe.html?id=${item.id}" class="btn btn-primary align-self-end">Leia Mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
                esportesContainer.innerHTML = cardsHTML;
            }
        } catch (error) {
            console.error('Falha ao carregar esportes:', error);
            esportesContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Não foi possível carregar o conteúdo. Por favor, tente novamente mais tarde.</div></div>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    carregarEsportes();
});