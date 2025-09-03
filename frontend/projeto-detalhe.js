document.addEventListener('DOMContentLoaded', () => {
  // Pega o ID da URL
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  if (!projetoId) {
    document.getElementById('detalhes-projeto').innerHTML = '<p class="text-danger">ID do projeto não fornecido.</p>';
    return;
  }

  // Chama a API para buscar o projeto específico
  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Projeto não encontrado');
      }
      return response.json();
    })
    .then(projeto => {
      // Com os dados do projeto em mãos, preenchemos a página
      document.title = `${projeto.nome} - Conecta Social`;
      
      // --- CORREÇÕES APLICADAS AQUI PARA BATER COM A SUA TABELA ---
      document.getElementById('projeto-nome').textContent = projeto.nome;
      document.getElementById('projeto-tematica').textContent = projeto.categoria; // Usa a coluna 'categoria'
      document.getElementById('projeto-descricao').textContent = projeto.descrição; // Usa a coluna 'descrição' (com acento)
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local}`; // Usa a coluna 'local'
      
      // Como não temos a coluna 'data_hora_texto', vamos usar a 'data_criacao'
      const dataCriacao = new Date(projeto.data_criacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      document.getElementById('projeto-data-hora').textContent = `Cadastrado em: ${dataCriacao}`;
      
      document.getElementById('projeto_id_hidden').value = projetoId;
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do projeto:', error);
      document.getElementById('detalhes-projeto').innerHTML = `<p class="text-danger">Não foi possível carregar os detalhes do projeto. ${error.message}</p>`;
    });

  // --- O código do formulário de feedback continua igual ---
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