// Espera que todo o conteúdo da página (DOM) seja carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

  const formEditarProjeto = document.getElementById('form-novo-projeto');
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  // Verifica se um ID de projeto foi passado na URL.
  if (!projetoId) {
    alert('ID do projeto não encontrado na URL!');
    window.location.href = 'gerenciar.html'; // Redireciona de volta para a lista.
    return;
  }

  // --- PARTE 1: BUSCAR DADOS E PREENCHER O FORMULÁRIO ---
  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      if (!response.ok) throw new Error('Projeto não encontrado');
      return response.json();
    })
    .then(projeto => {
      // Preenche cada campo do formulário com os dados recebidos da API.
      document.getElementById('nome').value = projeto.nome;
      document.getElementById('categoria').value = projeto.categoria;
      document.getElementById('descricao').value = projeto.descrição; // Usa o nome da coluna com acento
      document.getElementById('local').value = projeto.local;
      document.getElementById('contato').value = projeto.contato;
      document.getElementById('imagem_url').value = projeto.imagem_url;
    })
    .catch(error => {
      console.error('Erro ao buscar dados do projeto:', error);
      alert('Não foi possível carregar os dados para edição.');
    });

  // --- PARTE 2: ENVIAR OS DADOS ATUALIZADOS ---
  formEditarProjeto.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede que a página recarregue.

    // Pega os novos valores de todos os campos do formulário.
    const dadosAtualizados = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      descrição: document.getElementById('descricao').value, // Envia o nome da propriedade com acento
      local: document.getElementById('local').value,
      contato: document.getElementById('contato').value,
      imagem_url: document.getElementById('imagem_url').value,
    };

    // Envia os dados para a nossa API de atualização (PUT).
    fetch(`/api/projetos/${projetoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    })
    .then(response => {
      if (!response.ok) throw new Error('Falha ao salvar as alterações');
      return response.json();
    })
    .then(data => {
      alert('Projeto atualizado com sucesso!');
      window.location.href = 'gerenciar.html'; // Redireciona de volta para a lista.
    })
    .catch(error => {
      console.error('Erro ao atualizar projeto:', error);
      alert('Não foi possível salvar as alterações.');
    });
  });
});