document.addEventListener('DOMContentLoaded', () => {
  const secaoProjetos = document.getElementById('projetos');
  const formBusca = document.getElementById('form-busca'); // Adicionamos um ID 'form-busca' ao seu formulário
  const inputBusca = document.getElementById('input-busca'); // Adicionamos um ID 'input-busca' ao seu campo de texto

  // --- FUNÇÃO PARA DESENHAR OS CARDS NA TELA ---
  function desenharCards(projetos) {
    secaoProjetos.innerHTML = '<h2>Projetos em Destaque</h2>'; // Limpa a seção, mas mantém o título

    if (projetos.length === 0) {
      secaoProjetos.innerHTML += '<p>Nenhum projeto encontrado para esta busca.</p>';
      return;
    }

    projetos.forEach(projeto => {
      const cardHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="card-title">${projeto.nome}</h3>
            <h6 class="card-subtitle mb-2 text-muted">${projeto.local}</h6>
            <p class="card-text">${projeto.descrição}</p>
            <a href="projeto.html?id=${projeto.id}" class="btn btn-primary">Ver mais detalhes</a>
          </div>
        </div>
      `;
      secaoProjetos.innerHTML += cardHTML;
    });
  }

  // --- FUNÇÃO PARA BUSCAR OS PROJETOS NA API ---
  function buscarProjetos(termoDeBusca = '') {
    let url = '/api/projetos';
    if (termoDeBusca) {
      // Se houver um termo de busca, adiciona à URL
      url += `?busca=${encodeURIComponent(termoDeBusca)}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        desenharCards(data); // Usa a nova função para desenhar os cards
      })
      .catch(error => {
        console.error('Erro ao buscar projetos:', error);
        secaoProjetos.innerHTML = '<h2 class="text-danger">Não foi possível carregar os projetos.</h2>';
      });
  }

  // --- "OUVIDOR" DO FORMULÁRIO DE BUSCA ---
  formBusca.addEventListener('submit', (event) => {
    // 1. Impede que o formulário recarregue a página
    event.preventDefault(); 
    
    // 2. Pega o texto que o usuário digitou
    const termo = inputBusca.value;
    
    // 3. Chama a função para buscar os projetos com o filtro
    buscarProjetos(termo);
  });

  // Carrega todos os projetos na primeira vez que a página abre
  buscarProjetos();
});