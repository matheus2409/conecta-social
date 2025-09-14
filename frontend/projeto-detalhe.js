document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  if (!projetoId) {
    document.querySelector('main').innerHTML = '<p>ID do projeto não fornecido.</p>';
    return;
  }

  fetch(`/api/projetos/${projetoId}`)
    .then(response => response.json())
    .then(projeto => {
      document.title = `${projeto.nome} - Conecta Social`;

      const cabecalho = document.getElementById('detalhe-cabecalho');
      const imgFundo = document.createElement('img');
      imgFundo.src = projeto.imagem_url;
      imgFundo.className = 'detalhe-imagem-fundo';
      cabecalho.prepend(imgFundo);
      
      document.getElementById('projeto-nome').textContent = projeto.nome;
      document.getElementById('projeto-tematica').textContent = projeto.categoria;
      document.getElementById('projeto-descricao').textContent = projeto.descricao_completa;
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local}`;
      document.getElementById('projeto-contato').textContent = `Contato: ${projeto.nome_contato} (${projeto.contato || 'Não informado'})`;
      
      const dataCadastro = new Date(projeto.created_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      document.getElementById('projeto-data-hora').textContent = `Cadastrado em: ${dataCadastro}`;
      
      document.getElementById('projeto_id_hidden').value = projetoId;
    })
    .catch(error => console.error('Erro ao buscar detalhes do projeto:', error));

  // Lógica do formulário de feedback (sem alterações)
  const formFeedback = document.getElementById('form-feedback');
  formFeedback.addEventListener('submit', (event) => {
    event.preventDefault();
    const dadosFeedback = {
      nome_usuario: document.getElementById('nome').value,
      mensagem: document.getElementById('mensagem').value,
      id_do_projeto: document.getElementById('projeto_id_hidden').value
    };
    fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosFeedback),
    }).then(res => res.ok ? alert('Obrigado pelo seu feedback!') : alert('Erro ao enviar feedback.'))
      .then(() => formFeedback.reset())
      .catch(err => console.error(err));
  });
});