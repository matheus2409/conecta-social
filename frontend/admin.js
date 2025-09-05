document.addEventListener('DOMContentLoaded', () => {
  const formNovoProjeto = document.getElementById('form-novo-projeto');

  formNovoProjeto.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // Pega os valores de todos os campos do formulário
    const dadosProjeto = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      descrição: document.getElementById('descricao').value, // <-- CORREÇÃO APLICADA AQUI
      local: document.getElementById('local').value,
      contato: document.getElementById('contato').value,
      imagem_url: document.getElementById('imagem_url').value,
    };

    // Envia os dados para a nova API usando fetch
    fetch('/api/projetos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosProjeto),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao criar o projeto');
      }
      return response.json();
    })
    .then(data => {
      alert('Projeto adicionado com sucesso!');
      formNovoProjeto.reset(); // Limpa o formulário
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Não foi possível adicionar o projeto. Verifique os dados e tente novamente.');
    });
  });
});