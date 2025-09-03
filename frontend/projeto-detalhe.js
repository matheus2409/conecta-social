document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  if (!projetoId) {
    document.getElementById('detalhes-projeto').innerHTML = '<p class="text-danger">ID do projeto não fornecido.</p>';
    return;
  }

  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Projeto não encontrado');
      }
      return response.json();
    })
    .then(projeto => {
      document.title = `${projeto.nome} - Conecta Social`;
      
      document.getElementById('projeto-nome').textContent = projeto.nome;
      document.getElementById('projeto-tematica').textContent = projeto.categoria;
      document.getElementById('projeto-descricao').textContent = projeto.descrição;
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local}`;
      
      const dataCriacao = new Date(projeto.data_criacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      document.getElementById('projeto-data-hora').textContent = `Cadastrado em: ${dataCriacao}`;

      // NOVO: Adiciona a informação de contato
      document.getElementById('projeto-contato').textContent = `Contato: ${projeto.contato || 'Não informado'}`;
      
      document.getElementById('projeto_id_hidden').value = projetoId;
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do projeto:', error);
      document.getElementById('detalhes-projeto').innerHTML = `<p class="text-danger">Não foi possível carregar os detalhes do projeto. ${error.message}</p>`;
    });

  // O código do formulário de feedback continua igual...
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
    .then(response => response.json())
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