// frontend/script.js (Atualizado)

document.addEventListener('DOMContentLoaded', () => {
    const projetosContainer = document.getElementById('projetos-container');
    const loadingIndicator = document.getElementById('loading');

    const carregarProjetos = async () => {
        // 1. Mostra o indicador de carregamento e limpa o container
        loadingIndicator.style.display = 'block';
        projetosContainer.innerHTML = '';

        try {
            // 2. Faz a requisição à API
            const response = await fetch('http://localhost:3001/api/projetos'); // Garanta que esta URL está correta

            // 3. Verifica se a resposta da API foi bem-sucedida
            if (!response.ok) {
                // Se não foi, lança um erro para ser capturado pelo bloco catch
                throw new Error(`Erro na rede: ${response.statusText}`);
            }

            const projetos = await response.json();

            // 4. Verifica se há projetos para exibir
            if (projetos.length === 0) {
                projetosContainer.innerHTML = '<p>Ainda não há projetos para exibir. Seja o primeiro a adicionar um!</p>';
            } else {
                // 5. Cria e adiciona os cards de projeto ao container
                projetos.forEach(projeto => {
                    const projetoCard = document.createElement('div');
                    projetoCard.className = 'projeto-card'; // Use esta classe para estilizar no CSS

                    projetoCard.innerHTML = `
                        <h3>${projeto.nome}</h3>
                        <p>${projeto.descricao}</p>
                        ${projeto.link ? `<a href="${projeto.link}" target="_blank" rel="noopener noreferrer">Ver Projeto</a>` : ''}
                    `;
                    // O `target="_blank"` abre o link numa nova aba
                    // O `rel="noopener noreferrer"` é uma boa prática de segurança

                    projetosContainer.appendChild(projetoCard);
                });
            }

        } catch (error) {
            // 6. Se ocorrer qualquer erro, exibe uma mensagem amigável
            console.error('Falha ao carregar projetos:', error);
            projetosContainer.innerHTML = `
                <div class="error-message">
                    <p>Oops! Não foi possível carregar os projetos.</p>
                    <p>Por favor, tente recarregar a página mais tarde.</p>
                </div>
            `;
        } finally {
            // 7. Ao final de tudo (sucesso ou erro), esconde o indicador de carregamento
            loadingIndicator.style.display = 'none';
        }
    };

    // Chama a função para carregar os projetos assim que a página estiver pronta
    carregarProjetos();
});