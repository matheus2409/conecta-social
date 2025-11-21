import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return; 
    }

    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');
    const form = document.getElementById('projeto-form');
    
    const nomeInput = document.getElementById('nome');
    const descricaoInput = document.getElementById('descricao');
    const imagemUrlInput = document.getElementById('imagem_url');
    const linkSiteInput = document.getElementById('link_site');
    const linkRepoInput = document.getElementById('link_repositorio');
    const contatoInput = document.getElementById('contato_coordenador');
    const projetoIdInput = document.getElementById('projeto-id');

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
            titulo: nomeInput.value,
            descricao: descricaoInput.value,
            imagem_url: imagemUrlInput.value,
            link_site: linkSiteInput.value,
            link_repositorio: linkRepoInput.value,
            contato_coordenador: contatoInput.value,
            categoria: 'Geral' // Categoria padrão fixa
        };

        const id = projetoIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/projetos/${id}` : '/projetos';

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Salvando...';

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
            if (confirm('Tem certeza que deseja excluir este projeto?')) {
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
            try {
                const projeto = await fetchFromAPI(`/projetos/${id}`);
                nomeInput.value = projeto.titulo || projeto.nome;
                descricaoInput.value = projeto.descricao;
                imagemUrlInput.value = projeto.imagem_url || '';
                if(projeto.link_site) linkSiteInput.value = projeto.link_site;
                if(projeto.link_repositorio) linkRepoInput.value = projeto.link_repositorio;
                if(projeto.contato_coordenador) contatoInput.value = projeto.contato_coordenador;
                
                projetoIdInput.value = projeto.id;
                submitButton.textContent = 'Salvar Alterações';
                cancelButton.style.display = 'inline-block';
                
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