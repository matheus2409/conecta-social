// frontend/esporte-detalhe.js
// A URL agora é construída dinamicamente, assim como no apiService
const apiUrl = `${window.location.origin}/api/esportes/${esporteId}`;
// ... (restante do ficheiro)
document.addEventListener('DOMContentLoaded', () => {
    const esporteContainer = document.getElementById('esporte-detalhe-container');
    const projetosContainer = document.getElementById('projetos-container');
    
    // Pega o ID do esporte da URL (ex: ?id=1)
    const params = new URLSearchParams(window.location.search);
    const esporteId = params.get('id');

    if (!esporteId) {
        window.location.href = 'esportes.html'; // Redireciona se não houver ID
        return;
    }
    
    // Mude a URL da API para a URL do seu deploy da Vercel quando publicar
    const apiUrl = `http://localhost:3001/api/esportes/${esporteId}`;

    async function carregarDetalhes() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Esporte não encontrado.');
            
            const data = await response.json();
            const esporte = data;
            const projetos = data.projetos || [];

            // 1. Exibe os detalhes do esporte
            document.title = `${esporte.nome} - Conecta Social`; // Atualiza o título da página
            esporteContainer.innerHTML = `
                <img src="${esporte.imagem_url || 'placeholder.jpg'}" alt="Imagem de ${esporte.nome}" class="detalhe-imagem">
                <h2>${esporte.nome}</h2>
                <div class="info-bloco">
                    <h3>Quem pratica?</h3>
                    <p>${esporte.quem_pratica}</p>
                </div>
                <div class="info-bloco">
                    <h3>Como se pratica?</h3>
                    <p>${esporte.como_pratica}</p>
                </div>
                <div class="info-bloco">
                    <h3>Onde se pratica?</h3>
                    <p>${esporte.onde_pratica}</p>
                </div>
            `;

            // 2. Exibe os projetos relacionados
            projetosContainer.innerHTML = '';
            if (projetos.length > 0) {
                projetos.forEach(projeto => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <h3>${projeto.nome}</h3>
                        <p>${projeto.descricao}</p>
                        <p><strong>Coordenador:</strong> ${projeto.contato_coordenador || 'Não informado'}</p>
                        ${projeto.link_site ? `<a href="${projeto.link_site}" target="_blank">Visitar Site</a>` : ''}
                    `;
                    projetosContainer.appendChild(card);
                });
            } else {
                projetosContainer.innerHTML = '<p>Ainda não há projetos cadastrados para este esporte.</p>';
            }

        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
            esporteContainer.innerHTML = `<p>Ocorreu um erro ao carregar as informações. Tente novamente.</p>`;
        }
    }

    carregarDetalhes();
});