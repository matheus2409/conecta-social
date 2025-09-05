document.addEventListener('DOMContentLoaded', () => {
  const tabelaProjetosBody = document.getElementById('tabela-projetos');

  // Função para carregar e exibir os projetos na tabela
  function carregarProjetos() {
    fetch('/api/projetos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar projetos');
        }
        return response.json();
      })
      .then(projetos => {
        // Limpa a mensagem de "Carregando..."
        tabelaProjetosBody.innerHTML = '';

        if (projetos.length === 0) {
          tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto cadastrado.</td></tr>';
          return;
        }

        // Para cada projeto, cria uma linha na tabela
        projetos.forEach(projeto => {
          const linhaHTML = `
            <tr>
              <td>${projeto.nome}</td>
              <td>${projeto.categoria}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-primary btn-editar" data-id="${projeto.id}">Editar</button>
                <button class="btn btn-sm btn-danger btn-deletar" data-id="${projeto.id}">Apagar</button>
              </td>
            </tr>
          `;
          tabelaProjetosBody.innerHTML += linhaHTML;
        });
      })
      .catch(error => {
        console.error('Erro:', error);
        tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Falha ao carregar projetos.</td></tr>';
      });
  }

  // Carrega os projetos assim que a página é aberta
  carregarProjetos();
});