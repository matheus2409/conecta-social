document.addEventListener('DOMContentLoaded', () => {
  const tabelaProjetosBody = document.getElementById('tabela-projetos');

  function carregarProjetos() {
    fetch('/api/projetos')
      .then(response => response.json())
      .then(projetos => {
        tabelaProjetosBody.innerHTML = ''; 
        if (projetos.length === 0) {
          tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto cadastrado.</td></tr>';
          return;
        }
        projetos.forEach(projeto => {
          const linhaHTML = `
            <tr id="projeto-${projeto.id}">
              <td>${projeto.nome}</td>
              <td>${projeto.categoria}</td>
              <td class="text-end">
                <a href="editar-projeto.html?id=${projeto.id}" class="btn btn-sm btn-primary btn-editar">Editar</a>
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
  // frontend/gerenciar.js

      import { getProjetos, deletarProjeto } from './apiService.js';

    async function carregarProjetos() {
    try {
        const projetos = await getProjetos();
        // ... resto do seu código para renderizar os projetos
    } catch (error) {
        console.error('Falha ao carregar projetos:', error);
        alert(error.message);
    }
}

    window.deletarProjeto = async (id) => { // Use 'window.' para torná-la global para o onclick
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            await deletarProjeto(id);
            carregarProjetos(); // Recarrega a lista
        } catch (error) {
            console.error('Falha ao deletar projeto:', error);
            alert(error.message);
        }
    }
};

// ...

  // A lógica de apagar continua a mesma...
  tabelaProjetosBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-deletar')) {
      const botao = event.target;
      const projetoId = botao.dataset.id;
      
      const confirmar = confirm('Você tem certeza que deseja apagar este projeto? Esta ação não pode ser desfeita.');

      if (confirmar) {
        fetch(`/api/projetos/${projetoId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Falha ao apagar o projeto no servidor.');
          }
          document.getElementById(`projeto-${projetoId}`).remove();
        })
        .catch(error => {
          console.error('Erro ao apagar projeto:', error);
          alert('Não foi possível apagar o projeto.');
          
        });
      }
    }
  });
  

  carregarProjetos();
});