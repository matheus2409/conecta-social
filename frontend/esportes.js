// frontend/esportes.js

document.addEventListener('DOMContentLoaded', () => {
    const esportesContainer = document.getElementById('esportes-container');
    const loadingIndicator = document.getElementById('loading');

    const carregarEsportes = async () => {
        loadingIndicator.style.display = 'block';
        esportesContainer.innerHTML = '';

        try {
            const response = await fetch('http://localhost:3000/api/esportes');

            if (!response.ok) {
                throw new Error('Erro ao buscar dados de esportes.');
            }

            const esportes = await response.json();

            if (esportes.length === 0) {
                esportesContainer.innerHTML = '<p>Nenhum conteúdo de esporte disponível no momento.</p>';
            } else {
                esportes.forEach(item => {
                    const esporteCard = document.createElement('div');
                    esporteCard.className = 'esporte-card'; // Estilize esta classe no seu CSS

                    // Exemplo de como montar o card. Ajuste com os nomes das suas colunas no Supabase
                    esporteCard.innerHTML = `
                        <img src="${item.imagem_url || 'placeholder.jpg'}" alt="Imagem de ${item.titulo}">
                        <h3>${item.titulo}</h3>
                        <p>${item.resumo}</p>
                        <a href="esporte-detalhe.html?id=${item.id}">Ler Mais</a>
                    `;
                    esportesContainer.appendChild(esporteCard);
                });
            }
        } catch (error) {
            console.error('Falha ao carregar esportes:', error);
            esportesContainer.innerHTML = '<p class="error-message">Não foi possível carregar o conteúdo.</p>';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    carregarEsportes();
});