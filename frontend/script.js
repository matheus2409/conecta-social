document.addEventListener('DOMContentLoaded', () => {
  // O JavaScript vai procurar pelo elemento com o ID 'grid-projetos'
  const secaoProjetos = document.getElementById('grid-projetos');
  
  // --- TRAVA DE SEGURANÇA ---
  // Se o elemento não for encontrado no HTML, o script para aqui e avisa na consola.
  if (!secaoProjetos) {
    console.error("Erro Crítico: O contentor de projetos com o ID 'grid-projetos' não foi encontrado no ficheiro HTML.");
    return; // Interrompe a execução para evitar mais erros.
  }

  const formBusca = document.getElementById('form-busca');
  const inputBusca = document.getElementById('input-busca');
  const btnPertoDeMim = document.getElementById('btn-perto-de-mim');

  // --- FUNÇÃO PARA DESENHAR OS CARDS (Layout atualizado) ---
  function desenharCards(projetos) {
    secaoProjetos.innerHTML = ''; // Limpa a secção antes de adicionar os novos cards

    if (!projetos || projetos.length === 0) {
      secaoProjetos.innerHTML = '<p class="mensagem-carregamento">Nenhum projeto foi encontrado.</p>';
      return;
    }
    
    projetos.forEach(projeto => {
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
        secaoProjetos.innerHTML = '<p class="mensagem-carregamento" style="color: #ff6b6b;">Não foi possível carregar os projetos. Tente novamente mais tarde.</p>';
      });
  }

  // --- "OUVIDOR" DO FORMULÁRIO DE BUSCA ---
  if (formBusca) {
    formBusca.addEventListener('submit', (event) => {
      event.preventDefault(); 
      const termo = inputBusca.value;
      buscarProjetos(termo);
    });
  }

  // --- LÓGICA COMPLETA PARA O BOTÃO "ACHAR PERTO DE MIM" ---
  if (btnPertoDeMim) {
    btnPertoDeMim.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('A geolocalização não é suportada pelo seu navegador.');
        return;
      }

      btnPertoDeMim.disabled = true;
      btnPertoDeMim.textContent = 'A localizar...';
      secaoProjetos.innerHTML = '<p class="mensagem-carregamento">A procurar projetos perto de si...</p>';

      navigator.geolocation.getCurrentPosition(
        // Callback de sucesso
        (posicao) => {
          const latitude = posicao.coords.latitude;
          const longitude = posicao.coords.longitude;

          // AGORA VAI CHAMAR A API REALMENTE
          fetch(`/api/projetos-perto?lat=${latitude}&long=${longitude}`)
            .then(response => {
              if (!response.ok) throw new Error('A resposta da rede não foi bem-sucedida.');
              return response.json();
            })
            .then(data => desenharCards(data))
            .catch(error => {
              console.error('Erro ao buscar projetos próximos:', error);
              secaoProjetos.innerHTML = '<p class="mensagem-carregamento" style="color: #ff6b6b;">Não foi possível encontrar projetos perto de si.</p>';
            })
            .finally(() => {
              btnPertoDeMim.disabled = false;
              btnPertoDeMim.textContent = 'Achar perto de mim';
            });
        },
        // Callback de erro
        (erro) => {
          console.error('Erro ao obter localização:', erro);
          secaoProjetos.innerHTML = '<p class="mensagem-carregamento">Para usar esta funcionalidade, precisa de permitir o acesso à sua localização.</p>';
          alert('Não foi possível obter a sua localização. Verifique se a permissão foi concedida no seu navegador.');
          buscarProjetos(); // Carrega os projetos normais como alternativa
          btnPertoDeMim.disabled = false;
          btnPertoDeMim.textContent = 'Achar perto de mim';
        }
      );
    });
  }

  // Carrega todos os projetos na primeira vez que a página abre
  buscarProjetos();
});