// frontend/admin.js (Atualizado e sem Esportes)

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return; 
    }

    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');
    const form = document.getElementById('projeto-form');
    
    // Referências aos inputs
    const nomeInput = document.getElementById('nome');
    const descricaoInput = document.getElementById('descricao');
    const imagemUrlInput = document.getElementById('imagem_url');
    const linkSiteInput = document.getElementById('link_site');
    const linkRepoInput = document.getElementById('link_repositorio');
    const contatoInput = document.getElementById('contato_coordenador');
    const projetoIdInput = document.getElementById('projeto-id');

    // Botões de ação
    const submitButton = document.getElementById('form-submit-button');
    const cancelButton = document.getElementById('cancel-edit-button');

    async function carregarProjetos() {
        try {
            const projetos = await fetchFromAPI('/projetos');
            projetosListaContainer.innerHTML = ''; 
            projetos.forEach(projeto => {
                const projetoDiv = document.createElement('div');
                projetoDiv.className = 'list-group-item d-flex justify-content-between align-items-center';
                projetoDiv.style.marginBottom = '10px';
                projetoDiv.style.padding = '10px';
                projetoDiv.style.background = '#2c2c2c';
                projetoDiv.style.borderRadius = '5px';
                
                projetoDiv.innerHTML = `
                    <span>${projeto.titulo || projeto.nome}</span>
                    <div>
                        <button class="btn btn-sm btn-info edit-btn" data-id="${projeto.id}" style="margin-right: 5px;">Editar</button>
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projetoData = {
            titulo: nomeInput.value, // Adaptando para o campo que o backend espera
            descricao: descricaoInput.value,
            imagem_url: imagemUrlInput.value,
            link_site: linkSiteInput.value, // Se o backend suportar
            link_repositorio: linkRepoInput.value, // Se o backend suportar
            contato_coordenador: contatoInput.value, // Se o backend suportar
            categoria: 'Geral' // Categoria fixa, já que removemos o select
        };

        const id = projetoIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/projetos/${id}` : '/projetos';

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'A salvar...';

            await fetchFromAPI(url, {
                method: method,
                body: JSON.stringify(projetoData)
            });

            alert('Projeto salvo com sucesso!');
            form.reset();
            projetoIdInput.value = '';
            submitButton.textContent = 'Adicionar Projeto';
            cancelButton.style.display = 'none';
            carregarProjetos();

        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            if (!id) submitButton.textContent = 'Adicionar Projeto';
            else submitButton.textContent = 'Salvar Alterações';
        }
    });

    projetosListaContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem a certeza que deseja excluir este projeto?')) {
                try {
                    await fetchFromAPI(`/projetos/${id}`, { method: 'DELETE' });
                    alert('Projeto excluído com sucesso!');
                    carregarProjetos();
                } catch (error) {
                    alert(`Não foi possível excluir: ${error.message}`);
                }
            }
        }

        if (target.classList.contains('edit-btn')) {
            // Carrega os dados para o formulário para edição rápida
            try {
                const projeto = await fetchFromAPI(`/projetos/${id}`);
                nomeInput.value = projeto.titulo || projeto.nome;
                descricaoInput.value = projeto.descricao;
                imagemUrlInput.value = projeto.imagem_url || '';
                // Preencha os outros campos se o seu backend retorná-los
                
                projetoIdInput.value = projeto.id;
                submitButton.textContent = 'Salvar Alterações';
                cancelButton.style.display = 'inline-block';
                
                // Rola a página até o formulário
                form.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                alert('Erro ao carregar dados para edição.');
            }
        }
    });
    
    cancelButton.addEventListener('click', () => {
        form.reset();
        projetoIdInput.value = '';
        submitButton.textContent = 'Adicionar Projeto';
        cancelButton.style.display = 'none';
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    carregarProjetos();
});