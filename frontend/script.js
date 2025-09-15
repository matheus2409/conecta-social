document.addEventListener('DOMContentLoaded', () => {
  const secaoProjetos = document.getElementById('projetos');
  const formBusca = document.getElementById('form-busca');
  const inputBusca = document.getElementById('input-busca');
  const btnPertoDeMim = document.getElementById('btn-perto-de-mim'); // Novo

  // --- FUNÇÃO PARA DESENHAR OS CARDS NA TELA ---
  function desenharCards(projetos) {
    // ... (esta função continua exatamente a mesma)
    secaoProjetos.innerHTML = '<h2>Projetos em Destaque</h2>';

    if (projetos.length === 0) {
      secaoProjetos.innerHTML += '<p>Nenhum projeto encontrado.</p>';
      return;
    }
    projetos.forEach(projeto => {
      const cardHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="card-title">${projeto.nome}</h3>
            <h6 class="card-subtitle mb-2 text-muted">${projeto.categoria}</h6>
            <p class="card-text">${projeto.descricao_curta}</p>
            <a href="projeto.html?id=${projeto.id}" class="btn btn-primary">Ver mais detalhes</a>
          </div>
        </div>
      `;
      secaoProjetos.innerHTML += cardHTML;
    });
  }

  // --- FUNÇÃO PARA BUSCAR OS PROJETOS NA API ---
  function buscarProjetos(termoDeBusca = '') {
    // ... (esta função continua exatamente a mesma)
    let url = '/api/projetos';
    if (termoDeBusca) {
      url += `?busca=${encodeURIComponent(termoDeBusca)}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => desenharCards(data))
      .catch(error => {
        console.error('Erro ao buscar projetos:', error);
        secaoProjetos.innerHTML = '<h2 class="text-danger">Não foi possível carregar os projetos.</h2>';
      });
  }

  // --- "OUVIDOR" DO FORMULÁRIO DE BUSCA ---
  formBusca.addEventListener('submit', (event) => {
    // ... (este código continua exatamente o mesmo)
    event.preventDefault(); 
    const termo = inputBusca.value;
    buscarProjetos(termo);
  });

  // --- NOVO: LÓGICA PARA O BOTÃO "ACHAR PERTO DE MIM" ---
  btnPertoDeMim.addEventListener('click', () => {
    // 1. Verifica se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    // Desativa o botão para evitar cliques duplos
    btnPertoDeMim.disabled = true;
    btnPertoDeMim.textContent = 'Localizando...';

    // 2. Pede a posição atual do usuário
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        // 3. SUCESSO! Obtivemos as coordenadas
        const latitude = posicao.coords.latitude;
        const longitude = posicao.coords.longitude;

        alert(`Localização obtida!\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nPróximo passo: buscar projetos perto daqui!`);
        
        // Futuramente, chamaremos a API aqui:
        // buscarProjetosPerto(latitude, longitude);

        // Reativa o botão
        btnPertoDeMim.disabled = false;
        btnPertoDeMim.textContent = 'Achar perto de mim';
      },
      (erro) => {
        // 4. ERRO! O usuário negou a permissão ou houve um problema.
        console.error('Erro ao obter localização:', erro);
        alert('Não foi possível obter sua localização. Verifique se a permissão foi concedida nas configurações do seu navegador.');
        
        // Reativa o botão
        btnPertoDeMim.disabled = false;
        btnPertoDeMim.textContent = 'Achar perto de mim';
      }
    );
  });


  // Carrega todos os projetos na primeira vez que a página abre
  buscarProjetos();
});