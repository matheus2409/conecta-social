// frontend/admin.js (versão simplificada e melhorada)

document.addEventListener('DOMContentLoaded', () => {
    // A verificação do token continua perfeita
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');

    async function carregarProjetos() {
        try {
            // Usamos a nossa função centralizada! Fica muito mais limpo.
            const projetos = await fetchFromAPI('/projetos');

            projetosListaContainer.innerHTML = '';
            projetos.forEach(projeto => {
                const projetoDiv = document.createElement('div');
                projetoDiv.className = 'projeto-item';
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
            projetosListaContainer.innerHTML = `<p class="alert alert-warning">${error.message}</p>`;
        }
    }

    projetosListaContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Tem a certeza que deseja excluir este projeto?')) {
                try {
                    // Usamos a nossa função centralizada também para apagar
                    await fetchFromAPI(`/projetos/${id}`, { method: 'DELETE' });
                    alert('Projeto excluído com sucesso!');
                    carregarProjetos();
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert(`Não foi possível excluir o projeto: ${error.message}`);
                }
            }
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    carregarProjetos();
});