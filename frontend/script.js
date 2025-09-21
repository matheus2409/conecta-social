document.addEventListener('DOMContentLoaded', () => {
  // CORREÇÃO: O ID correto do teu HTML é 'grid-projetos'
  const secaoProjetos = document.getElementById('grid-projetos');
  
  // O resto dos seletores está correto
  const formBusca = document.getElementById('form-busca');
  const inputBusca = document.getElementById('input-busca');
  const btnPertoDeMim = document.getElementById('btn-perto-de-mim');

  // --- FUNÇÃO PARA DESENHAR OS CARDS (Layout atualizado) ---
  function desenharCards(projetos) {
    secaoProjetos.innerHTML = ''; // Limpa a secção antes de adicionar os novos cards

    if (!projetos || projetos.length === 0) {
      secaoProjetos.innerHTML = '<p class="mensagem-carregamento">Nenhum projeto encontrado.</p>';
      return;
    }
    
    projetos.forEach(projeto => {
      // Este é o novo HTML para cada card, que corresponde ao novo CSS
      const cardHTML = `
        <a href="projeto.html?id=${projeto.id}" class="card-projeto">
            <img src="${projeto.imagem_url}" alt="Imagem do projeto ${projeto.nome}">
            <div class="card-conteudo">
                <span class="categoria">${projeto.categoria}</span>
                <h3 class="titulo">${projeto.nome}</h3>
            </div>
        </a>
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
    
    secaoProjetos.innerHTML = '<p class="mensagem-carregamento">A carregar projetos...</p>';

    fetch(url)
      .then(response => response.json())
      .then(data => desenharCards(data))
      .catch(error => {
        console.error('Erro ao buscar projetos:', error);
        secaoProjetos.innerHTML = '<p class="mensagem-carregamento" style="color: #ff5555;">Não foi possível carregar os projetos. Tente novamente mais tarde.</p>';
      });
  }

  // --- "OUVIDOR" DO FORMULÁRIO DE BUSCA ---
  if(formBusca){
    formBusca.addEventListener('submit', (event) => {
      event.preventDefault(); 
      const termo = inputBusca.value;
      buscarProjetos(termo);
    });
  }

  // --- LÓGICA PARA O BOTÃO "ACHAR PERTO DE MIM" ---
  if(btnPertoDeMim){
    btnPertoDeMim.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('A geolocalização não é suportada pelo seu navegador.');
        return;
      }

      btnPertoDeMim.disabled = true;
      btnPertoDeMim.textContent = 'A localizar...';
      secaoProjetos.innerHTML = '<p class="mensagem-carregamento">A procurar projetos perto de si...</p>';

      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const latitude = posicao.coords.latitude;
          const longitude = posicao.coords.longitude;
          
          // ATENÇÃO: Esta parte só funcionará se tiveres a rota no backend e a função no Supabase
          // fetch(`/api/projetos-perto?lat=${latitude}&long=${longitude}`)
          //   .then(response => response.json())
          //   .then(data => desenharCards(data))
          //   .catch(error => {
          //      console.error('Erro ao buscar projetos próximos:', error);
          //      secaoProjetos.innerHTML = '<p class="mensagem-carregamento" style="color: #ff5555;">Não foi possível encontrar projetos perto de si.</p>';
          //   })
          //   .finally(() => {
          //       btnPertoDeMim.disabled = false;
          //       btnPertoDeMim.textContent = 'Achar perto de mim';
          //   });
          
          // Por agora, vamos apenas mostrar um alerta e recarregar os projetos normais
           alert(`Localização obtida!\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nA funcionalidade de busca por proximidade ainda está a ser implementada no backend.`);
           buscarProjetos(); // Recarrega a lista normal
           btnPertoDeMim.disabled = false;
           btnPertoDeMim.textContent = 'Achar perto de mim';
        },
        (erro) => {
          console.error('Erro ao obter localização:', erro);
          alert('Não foi possível obter a sua localização. Verifique se a permissão foi concedida.');
          buscarProjetos(); // Recarrega a lista normal
          btnPertoDeMim.disabled = false;
          btnPertoDeMim.textContent = 'Achar perto de mim';
        }
      );
    });
  }

  // Carrega todos os projetos quando a página abre
  buscarProjetos();
});