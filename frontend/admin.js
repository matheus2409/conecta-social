document.addEventListener('DOMContentLoaded', () => {
  const formNovoProjeto = document.getElementById('form-novo-projeto');

  formNovoProjeto.addEventListener('submit', (event) => {
    event.preventDefault();

    const dadosProjeto = {
      nome: document.getElementById('nome').value,
      descricao_curta: document.getElementById('descricao_curta').value,
      descricao_completa: document.getElementById('descricao_completa').value,
      nome_contato: document.getElementById('nome_contato').value,
      contato: document.getElementById('contato').value,
      categoria: document.getElementById('categoria').value,
      local: document.getElementById('local').value,
      imagem_url: document.getElementById('imagem_url').value,
    };

    // O resto do fetch continua igual...
    fetch('/api/projetos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosProjeto),
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao criar o projeto');
      return response.json();
    })
    .then(data => {
      alert('Projeto adicionado com sucesso!');
      formNovoProjeto.reset();
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Não foi possível adicionar o projeto. Verifique os dados e tente novamente.');
    });
  });
});