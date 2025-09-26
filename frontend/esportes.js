// frontend/esportes.js
document.addEventListener('DOMContentLoaded', () => {
    const esportesContainer = document.getElementById('esportes-container');
    // Mude a URL da API para a URL do seu deploy da Vercel quando publicar
    const apiUrl = 'http://localhost:3001/api/esportes'; 

    async function carregarEsportes() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Erro ao carregar esportes.');
            const esportes = await response.json();

            esportesContainer.innerHTML = ''; 

            if (esportes.length === 0) {
                esportesContainer.innerHTML = '<p>Nenhum esporte cadastrado.</p>';
                return;
            }

            esportes.forEach(esporte => {
                const card = document.createElement('a'); // MUDAMOS PARA <a>
                card.href = `esporte-detalhe.html?id=${esporte.id}`; // Link para a página de detalhes
                card.className = 'card';
                card.innerHTML = `
                    <img src="${esporte.imagem_url || 'placeholder.jpg'}" alt="Imagem de ${esporte.nome}">
                    <h3>${esporte.nome}</h3>
                `;
                esportesContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Erro:', error);
            esportesContainer.innerHTML = '<p>Não foi possível carregar os esportes.</p>';
        }
    }

    carregarEsportes();
});