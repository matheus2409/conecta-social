document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-novo-projeto');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const dadosProjeto = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      imagem_url: document.getElementById('imagem_url').value,
      descricao_curta: document.getElementById('descricao_curta').value,
      descricao_completa: document.getElementById('descricao_completa').value,
      local: document.getElementById('local').value,
      nome_contato: document.getElementById('nome_contato').value,
      contato: document.getElementById('contato').value,
    };
    fetch('/api/projetos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosProjeto),
    }).then(res => res.ok ? alert('Projeto adicionado com sucesso!') : alert('Erro ao adicionar projeto.'))
      .then(() => form.reset())
      .catch(err => console.error(err));
  });
});