document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-novo-projeto');
  const areaNotificacao = document.getElementById('area-notificacao');

  // Função para exibir notificações na tela
  function mostrarNotificacao(mensagem, tipo = 'success') {
    const classeAlerta = tipo === 'success' ? 'alert-success' : 'alert-danger';
    areaNotificacao.innerHTML = `<div class="alert ${classeAlerta}" role="alert">${mensagem}</div>`;

    // Limpa a mensagem após 5 segundos para não poluir a tela
    setTimeout(() => {
      areaNotificacao.innerHTML = '';
    }, 5000);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const btnSubmit = form.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'A adicionar...';

    const dadosProjeto = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      imagem_url: document.getElementById('imagem_url').value,
      descricao_curta: document.getElementById('descricao_curta').value,
      descricao_completa: document.getElementById('descricao_completa').value,
      local: document.getElementById('local').value,
      nome_contato: document.getElementById('nome_contato').value,
      contato: document.getElementById('contato').value,
      // Adiciona latitude e longitude (se existirem nos campos)
      latitude: parseFloat(document.getElementById('latitude').value) || null,
      longitude: parseFloat(document.getElementById('longitude').value) || null,
    };

    try {
      const response = await fetch('/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosProjeto),
      });

      if (!response.ok) {
        // Se a resposta do servidor não for 'ok', lança um erro
        throw new Error('Falha ao adicionar o projeto. O servidor respondeu com um erro.');
      }

      mostrarNotificacao('Projeto adicionado com sucesso!', 'success');
      form.reset();

    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      mostrarNotificacao('Ocorreu um erro. Por favor, tente novamente.', 'danger');
    } finally {
      // Reativa o botão, independentemente do resultado
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Adicionar Projeto';
    }
  });
});