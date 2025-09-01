document.addEventListener('DOMContentLoaded', () => {
  // --- CÓDIGO QUE VOCÊ JÁ TINHA PARA BUSCAR OS DETALHES DO PROJETO ---
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
      document.getElementById('projeto-tematica').textContent = projeto.tematica;
      document.getElementById('projeto-descricao').textContent = projeto.descricao_completa;
      document.getElementById('projeto-local').textContent = `Onde: ${projeto.local_texto}`;
      document.getElementById('projeto-data-hora').textContent = `Quando: ${projeto.data_hora_texto}`;
      document.getElementById('projeto_id_hidden').value = projetoId;
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do projeto:', error);
      document.getElementById('detalhes-projeto').innerHTML = `<p class="text-danger">Não foi possível carregar os detalhes do projeto. ${error.message}</p>`;
    });

  // =================================================================
  // NOVO: CÓDIGO PARA CUIDAR DO ENVIO DO FORMULÁRIO DE FEEDBACK
  // =================================================================
  const formFeedback = document.getElementById('form-feedback');

  formFeedback.addEventListener('submit', (event) => {
    // 1. Previne o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // 2. Pega os dados dos campos do formulário
    const nomeUsuario = document.getElementById('nome').value;
    const mensagemUsuario = document.getElementById('mensagem').value;
    const idDoProjeto = document.getElementById('projeto_id_hidden').value;

    // 3. Monta o objeto de dados para enviar
    const dadosFeedback = {
      nome_usuario: nomeUsuario,
      mensagem: mensagemUsuario,
      id_do_projeto: idDoProjeto
    };

    // 4. Envia os dados para a API usando fetch com o método POST
    fetch('/api/feedbacks', {
      method: 'POST', // Especifica que é uma requisição POST
      headers: {
        'Content-Type': 'application/json', // Avisa ao servidor que estamos enviando JSON
      },
      body: JSON.stringify(dadosFeedback), // Converte nosso objeto JS em uma string JSON
    })
    .then(response => response.json())
    .then(data => {
      // 5. Se tudo deu certo, mostra uma mensagem de sucesso e limpa o formulário
      console.log('Resposta do servidor:', data);
      alert('Obrigado pelo seu feedback!');
      formFeedback.reset(); // Limpa os campos do formulário
    })
    .catch(error => {
      // 6. Se deu erro, mostra um alerta e o erro no console
      console.error('Erro ao enviar feedback:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
    });
  });
});