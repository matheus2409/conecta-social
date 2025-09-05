document.addEventListener('DOMContentLoaded', () => {
  const formEditarProjeto = document.getElementById('form-novo-projeto'); // O form tem o mesmo ID do de criar
  const params = new URLSearchParams(window.location.search);
  const projetoId = params.get('id');

  if (!projetoId) {
    alert('ID do projeto não encontrado!');
    window.location.href = 'gerenciar.html'; // Volta para a lista se não houver ID
    return;
  }

  // --- PARTE 1: BUSCAR DADOS E PREENCHER O FORMULÁRIO ---
  fetch(`/api/projetos/${projetoId}`)
    .then(response => {
      if (!response.ok) throw new Error('Projeto não encontrado');
      return response.json();
    })
    .then(projeto => {
      // Preenche cada campo do formulário com os dados do projeto
      document.getElementById('nome').value = projeto.nome;
      document.getElementById('categoria').value = projeto.categoria;
      document.getElementById('descricao').value = projeto.descrição;
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
    event.preventDefault();

    // Pega os novos valores dos campos do formulário
    const dadosAtualizados = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      descrição: document.getElementById('descricao').value,
      local: document.getElementById('local').value,
      contato: document.getElementById('contato').value,
      imagem_url: document.getElementById('imagem_url').value,
    };

    // Envia os dados para a nossa nova API de PUT
    fetch(`/api/projetos/${projetoId}`, {
      method: 'PUT', // Usamos o método PUT para atualizar
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
      window.location.href = 'gerenciar.html'; // Volta para a lista de projetos
    })
    .catch(error => {
      console.error('Erro ao atualizar projeto:', error);
      alert('Não foi possível salvar as alterações.');
    });
  });
});