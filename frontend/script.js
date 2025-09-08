document.addEventListener('DOMContentLoaded', () => {
    const gridProjetos = document.getElementById('grid-projetos');

    fetch('/api/projetos')
        .then(response => response.json())
        .then(projetos => {
            gridProjetos.innerHTML = ''; // Limpa a mensagem de "Carregando..."

            if (projetos.length === 0) {
                gridProjetos.innerHTML = '<p>Nenhum projeto encontrado no momento.</p>';
                return;
            }

            projetos.forEach(projeto => {
                // Cria um elemento 'a' que será o card clicável
                const cardLink = document.createElement('a');
                cardLink.href = `projeto.html?id=${projeto.id}`;
                cardLink.className = 'card-projeto';

                // Cria o conteúdo HTML do card
                cardLink.innerHTML = `
                    <img src="${projeto.imagem_url}" alt="${projeto.nome}">
                    <div class="card-conteudo">
                        <span class="categoria">${projeto.categoria}</span>
                        <h3 class="titulo">${projeto.nome}</h3>
                    </div>
                `;

                // Adiciona o card completo ao grid
                gridProjetos.appendChild(cardLink);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os projetos:', error);
            gridProjetos.innerHTML = '<p style="color: red;">Não foi possível carregar os projetos.</p>';
        });
});