// Este evento garante que o nosso código só será executado
// depois que toda a estrutura da página (HTML) for carregada.
document.addEventListener('DOMContentLoaded', () => {

  // 1. "Liga" para a nossa API para buscar os projetos
  fetch('/api/projetos')
    .then(response => {
      // Se a resposta não for bem-sucedida (ex: erro no servidor), lança um erro
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok');
      }
      // 2. Converte a resposta para o formato JSON
      return response.json();
    })
    .then(projetos => { // 3. Recebe a lista de projetos pronta para usar
      
      // Captura a seção do HTML onde vamos inserir os cards
      const secaoProjetos = document.getElementById('projetos');

      // Se não houver projetos, exibe uma mensagem
      if (projetos.length === 0) {
        secaoProjetos.innerHTML += '<p>Nenhum projeto encontrado no momento.</p>';
        return;
      }

      // 4. Para cada projeto na lista, cria um card
      projetos.forEach(projeto => {
        
        // Cria o HTML do card usando os dados do projeto
       const cardHTML = `
  <div class="card mb-3">
    <div class="card-body">
      <h3 class="card-title">${projeto.nome}</h3>
      {/* Usando a coluna 'local' como subtítulo */}
      <h6 class="card-subtitle mb-2 text-muted">${projeto.local}</h6> 
      
      {/* Usando a coluna 'descricao' como o texto do card */}
      <p class="card-text">${projeto.descricao}</p> 
      
      <a href="projeto.html?id=${projeto.id}" class="btn btn-primary">Ver mais detalhes</a>
    </div>
  </div>
`;

        // 5. Adiciona o HTML do card recém-criado dentro da seção de projetos
        secaoProjetos.innerHTML += cardHTML;
      });
      // A linha duplicada que estava aqui foi removida.
    })
    .catch(error => {
      // Se der algum erro na busca, exibe no console do navegador e na página
      console.error('Erro ao buscar os projetos:', error);
      const secaoProjetos = document.getElementById('projetos');
      secaoProjetos.innerHTML += '<p class="text-danger">Não foi possível carregar os projetos. Tente novamente mais tarde.</p>';
    });
});