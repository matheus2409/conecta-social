// Espera que todo o conteúdo da página (DOM) seja carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LÓGICA PARA EXIBIR DETALHES DO PROJETO ---

  // Pega os parâmetros da URL (ex: ?id=123)
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  // Seleciona o elemento onde os detalhes do projeto serão exibidos.
  const detalhesContainer = document.getElementById('detalhes-projeto');

  // Verifica se o ID do projeto foi encontrado na URL.
  if (!projetoId) {
    detalhesContainer.innerHTML = '<p class="text-danger">ID do projeto não fornecido na URL.</p>';
    return; // Interrompe a execução se não houver ID.
  }

  // Faz a chamada à API para buscar os dados do projeto específico.
  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      // Se a resposta não for bem-sucedida (ex: erro 404), lança um erro.
      if (!response.ok) {
        throw new Error('Projeto não encontrado.');
      }
      // Se a resposta for OK, converte-a para JSON.
      return response.json();
    })
    .then(projeto => {
      // --- Preenche os elementos da página com os dados recebidos ---
      
      document.title = `${projeto.nome} - Conecta Social`; // Atualiza o título da aba do navegador.

      document.getElementById('projeto-nome').textContent = projeto.nome;
      document.getElementById('projeto-tematica').textContent = projeto.categoria;
      document.getElementById('projeto-descricao').textContent = projeto.descrição;
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local}`;
      document.getElementById('projeto-contato').textContent = `Contato: ${projeto.contato || 'Não informado'}`;
      document.getElementById('projeto_id_hidden').value = projetoId;

      // --- Lógica de Formatação de Data ---
      const dataCriacaoValor = projeto.data_criacao;
      let dataFormatada = 'Data não informada'; // Define um valor padrão.

      // Verifica se a data existe e está no formato "dd/mm/aaaa".
      if (dataCriacaoValor && dataCriacaoValor.includes('/')) {
        const partes = dataCriacaoValor.split('/'); // ex: ["24", "09", "2007"]
        // Converte para o formato que o JavaScript entende de forma segura: "aaaa-mm-dd"
        const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`; 
        const dataObj = new Date(dataISO);

        // Formata a data para o padrão brasileiro (dd/mm/aaaa).
        dataFormatada = dataObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC' // Usar UTC previne erros de fuso horário.
        });
      } else if (dataCriacaoValor) {
        // Se a data não tiver barras, exibe como veio da API.
        dataFormatada = dataCriacaoValor;
      }
      
      document.getElementById('projeto-data-hora').textContent = `Cadastrado em: ${dataFormatada}`;
    })
    .catch(error => {
      // --- Tratamento de Erros ---
      console.error('Erro ao buscar detalhes do projeto:', error);
      detalhesContainer.innerHTML = `<p class="text-danger">Não foi possível carregar os detalhes do projeto. Motivo: ${error.message}</p>`;
    });

    
  // --- 2. LÓGICA PARA O FORMULÁRIO DE FEEDBACK ---
  
  const formFeedback = document.getElementById('form-feedback');
  formFeedback.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página ao enviar.

    // Pega os valores dos campos do formulário.
    const nomeUsuario = document.getElementById('nome').value;
    const mensagemUsuario = document.getElementById('mensagem').value;
    const idDoProjeto = document.getElementById('projeto_id_hidden').value;

    const dadosFeedback = {
      nome_usuario: nomeUsuario,
      mensagem: mensagemUsuario,
      id_do_projeto: idDoProjeto
    };

    // Envia os dados do feedback para a API.
    fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosFeedback),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao enviar o feedback.');
        }
        return response.json();
    })
    .then(data => {
      alert('Obrigado pelo seu feedback!');
      formFeedback.reset(); // Limpa o formulário após o envio.
    })
    .catch(error => {
      console.error('Erro ao enviar feedback:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
    });
  });
});