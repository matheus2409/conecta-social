// frontend/admin.js (Atualizado)

document.addEventListener('DOMContentLoaded', () => {
    // Redireciona para o login se não houver token
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return; // Para a execução do script se não estiver logado
    }

    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');
    // Adicione aqui as referências para o seu formulário se precisar
    // const form = document.getElementById('projeto-form');

    /**
     * Carrega os projetos do backend e os exibe na página.
     */
    async function carregarProjetos() {
        try {
            // Usa a nossa função centralizada do apiService.js!
            const projetos = await fetchFromAPI('/projetos');

            projetosListaContainer.innerHTML = ''; // Limpa a lista antes de adicionar os novos
            projetos.forEach(projeto => {
                const projetoDiv = document.createElement('div');
                projetoDiv.className = 'list-group-item d-flex justify-content-between align-items-center';
                projetoDiv.innerHTML = `
                    <span>${projeto.nome}</span>
                    <div>
                        <button class="btn btn-sm btn-info edit-btn" data-id="${projeto.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${projeto.id}">Excluir</button>
                    </div>
                `;
                projetosListaContainer.appendChild(projetoDiv);
            });
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            projetosListaContainer.innerHTML = `<p class="alert alert-warning">Não foi possível carregar os projetos. ${error.message}</p>`;
        }
    }

    /**
     * Delega os eventos de clique para os botões de editar e apagar.
     */
    projetosListaContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // Ação de Apagar
        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem a certeza que deseja excluir este projeto?')) {
                try {
                    // Usa a nossa função centralizada também para apagar!
                    await fetchFromAPI(`/projetos/${id}`, { method: 'DELETE' });
                    alert('Projeto excluído com sucesso!');
                    carregarProjetos(); // Recarrega a lista para refletir a mudança
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert(`Não foi possível excluir o projeto. Erro: ${error.message}`);
                }
            }
        }

        // Ação de Editar (a implementar)
        if (target.classList.contains('edit-btn')) {
            // Aqui vamos adicionar a lógica para edição no próximo passo!
            alert(`Funcionalidade de editar o projeto com ID: ${id} a ser implementada.`);
            // window.location.href = `editar-projeto.html?id=${id}`;
        }
    });
    
    // Lógica para o botão de Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    // Carregamento inicial dos projetos quando a página abre
    carregarProjetos();
});