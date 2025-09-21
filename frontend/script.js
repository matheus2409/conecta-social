document.addEventListener('DOMContentLoaded', () => {
  const secaoProjetos = document.getElementById('projetos');
  const formBusca = document.getElementById('form-busca');
  const inputBusca = document.getElementById('input-busca');
  const btnPertoDeMim = document.getElementById('btn-perto-de-mim');

  // --- FUNÇÃO PARA DESENHAR OS CARDS NA TELA ---
  function desenharCards(projetos) {
    secaoProjetos.innerHTML = '<h2>Projetos em Destaque</h2>';

    if (!projetos || projetos.length === 0) {
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
    let url = '/api/projetos';
    if (termoDeBusca) {
      url += `?busca=${encodeURIComponent(termoDeBusca)}`;
    }
    
    secaoProjetos.innerHTML = '<h2>Carregando projetos...</h2>';

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
    event.preventDefault(); 
    const termo = inputBusca.value;
    buscarProjetos(termo);
  });

  // --- LÓGICA ATUALIZADA PARA O BOTÃO "ACHAR PERTO DE MIM" ---
  btnPertoDeMim.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    btnPertoDeMim.disabled = true;
    btnPertoDeMim.textContent = 'A localizar...';
    secaoProjetos.innerHTML = '<h2>A procurar projetos perto de si...</h2>';

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const latitude = posicao.coords.latitude;
        const longitude = posicao.coords.longitude;

        // Chama a nossa nova API de geolocalização
        fetch(`/api/projetos-perto?lat=${latitude}&long=${longitude}`)
          .then(response => {
            if (!response.ok) throw new Error('A resposta da rede não foi bem-sucedida');
            return response.json();
          })
          .then(data => {
            desenharCards(data); // Reutiliza a função de desenhar cards
          })
          .catch(error => {
            console.error('Erro ao buscar projetos próximos:', error);
            secaoProjetos.innerHTML = '<h2 class="text-danger">Não foi possível encontrar projetos perto de si.</h2>';
          })
          .finally(() => {
            // Reativa o botão
            btnPertoDeMim.disabled = false;
            btnPertoDeMim.textContent = 'Achar perto de mim';
          });
      },
      (erro) => {
        console.error('Erro ao obter localização:', erro);
        alert('Não foi possível obter a sua localização. Verifique se a permissão foi concedida nas configurações do seu navegador.');
        secaoProjetos.innerHTML = '<h2>Conceda a permissão de localização para encontrar projetos.</h2>';
        // Reativa o botão
        btnPertoDeMim.disabled = false;
        btnPertoDeMim.textContent = 'Achar perto de mim';
      }
    );
  });

  // Carrega todos os projetos na primeira vez que a página abre
  buscarProjetos();
});