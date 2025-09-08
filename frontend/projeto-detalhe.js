// Espera que todo o conteúdo da página (DOM) seja carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LÓGICA PARA EXIBIR DETALHES DO PROJETO ---

  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  // Verifica se o ID do projeto foi encontrado na URL.
  if (!projetoId) {
    document.querySelector('main').innerHTML = '<p class="text-danger">ID do projeto não fornecido na URL.</p>';
    return; // Interrompe a execução se não houver ID.
  }

  // Faz a chamada à API para buscar os dados do projeto específico.
  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Projeto não encontrado.');
      }
      return response.json();
    })
    .then(projeto => {
      // Preenche o título da página
      document.title = `${projeto.nome} - Conecta Social`;

      // --- LÓGICA PARA O CABEÇALHO COM IMAGEM ---
      const cabecalho = document.getElementById('detalhe-cabecalho');
      if (cabecalho && projeto.imagem_url) {
        const imgFundo = document.createElement('img');
        imgFundo.src = projeto.imagem_url;
        imgFundo.className = 'detalhe-imagem-fundo';
        cabecalho.prepend(imgFundo);
      }
      
      // Preenche os títulos e textos da página
      document.getElementById('projeto-nome').textContent = projeto.nome;
      document.getElementById('projeto-tematica').textContent = projeto.categoria;
      document.getElementById('projeto-descricao').textContent = projeto.descricao_completa;
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local}`;
      document.getElementById('projeto-contato').textContent = `Contato: ${projeto.nome_contato} (${projeto.contato || 'Não informado'})`;
      
      // Formata a data de cadastro (created_at)
      const dataCadastro = new Date(projeto.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        timeZone: 'UTC'
      });
      document.getElementById('projeto-data-hora').textContent = `Cadastrado em: ${dataCadastro}`;
      
      document.getElementById('projeto_id_hidden').value = projetoId;
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do projeto:', error);
      document.querySelector('main').innerHTML = `<p class="text-danger">Não foi possível carregar os detalhes do projeto. Motivo: ${error.message}</p>`;
    });

    
  // --- 2. LÓGICA PARA O FORMULÁRIO DE FEEDBACK ---
  
  const formFeedback = document.getElementById('form-feedback');
  formFeedback.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const nomeUsuario = document.getElementById('nome').value;
    const mensagemUsuario = document.getElementById('mensagem').value;
    const idDoProjeto = document.getElementById('projeto_id_hidden').value;

    const dadosFeedback = {
      nome_usuario: nomeUsuario,
      mensagem: mensagemUsuario,
      id_do_projeto: idDoProjeto
    };

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
      formFeedback.reset(); 
    })
    .catch(error => {
      console.error('Erro ao enviar feedback:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
    });
  });
});