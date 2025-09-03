console.log('AVISO: O arquivo script.js foi carregado e está executando!');

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/projetos')
    .then(response => {
      if (!response.ok) throw new Error('A resposta da rede não foi ok');
      return response.json();
    })
    .then(projetos => {
      const carrosselInner = document.querySelector('#carrossel-destaques .carousel-inner');
      const carrosselIndicators = document.querySelector('#carrossel-destaques .carousel-indicators');
      const secaoProjetos = document.getElementById('projetos');
      
      // Limpa os conteúdos de "carregando..."
      carrosselInner.innerHTML = '';
      secaoProjetos.innerHTML = '<h2>Projetos em Destaque</h2>'; 

      // Se não houver projetos, exibe uma mensagem
      if (projetos.length === 0) {
        secaoProjetos.innerHTML += '<p>Nenhum projeto encontrado no momento.</p>';
        carrosselInner.innerHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height: 400px; background-color: #333;"><p class="text-white">Nenhum projeto para exibir no carrossel.</p></div></div>';
        return;
      }

      projetos.forEach((projeto, index) => {
        // --- LÓGICA PARA CONSTRUIR O CARROSSEL ---
        if (projeto.imagem_url) {
          const activeClass = index === 0 ? 'active' : '';
          
          const indicatorHTML = `<button type="button" data-bs-target="#carrossel-destaques" data-bs-slide-to="${index}" class="${activeClass}" aria-current="true"></button>`;
          
          const itemHTML = `
            <div class="carousel-item ${activeClass}">
              <a href="projeto.html?id=${projeto.id}">
                <img src="${projeto.imagem_url}" class="d-block w-100" style="height: 400px; object-fit: cover;" alt="${projeto.nome}">
                <div class="carousel-caption d-none d-md-block">
                  <h5>${projeto.nome}</h5>
                  <p>${projeto.descrição}</p>
                </div>
              </a>
            </div>
          `;
          carrosselInner.innerHTML += itemHTML;
          carrosselIndicators.innerHTML += indicatorHTML;
        }

        // --- LÓGICA PARA CONSTRUIR OS CARDS ---
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
    })
    .catch(error => {
      console.error('Erro ao buscar projetos:', error);
      document.getElementById('projetos').innerHTML += '<p class="text-danger">Não foi possível carregar os projetos.</p>';
    });
});