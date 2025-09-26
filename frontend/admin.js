// frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // URLs da API (ajuste se necessário para o ambiente de produção)
    const apiUrlProjetos = 'http://localhost:3001/api/projetos';
    const apiUrlEsportes = 'http://localhost:3001/api/esportes';

    // Elementos do formulário
    const form = document.getElementById('projeto-form');
    const projetoIdInput = document.getElementById('projeto-id');
    const nomeInput = document.getElementById('nome');
    const descricaoInput = document.getElementById('descricao');
    const imagemUrlInput = document.getElementById('imagem_url');
    const linkSiteInput = document.getElementById('link_site');
    const linkRepositorioInput = document.getElementById('link_repositorio');
    const contatoCoordenadorInput = document.getElementById('contato_coordenador');
    const esporteSelect = document.getElementById('esporte-select'); // Novo campo
    const submitButton = document.getElementById('form-submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');

    // --- CARREGAMENTO INICIAL DE DADOS ---

    // Função para carregar os esportes e popular o select
    async function carregarEsportes() {
        try {
            const response = await fetch(apiUrlEsportes);
            if (!response.ok) throw new Error('Falha ao buscar esportes.');
            const esportes = await response.json();

            esportes.forEach(esporte => {
                const option = document.createElement('option');
                option.value = esporte.id;
                option.textContent = esporte.nome;
                esporteSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar esportes:', error);
            alert('Não foi possível carregar a lista de esportes.');
        }
    }

    // Função para carregar e exibir os projetos
    async function carregarProjetos() {
        try {
            const response = await fetch(apiUrlProjetos);
            if (!response.ok) throw new Error('Falha ao buscar projetos.');
            const projetos = await response.json();
            
            projetosListaContainer.innerHTML = '';
            projetos.forEach(projeto => {
                const projetoDiv = document.createElement('div');
                projetoDiv.className = 'projeto-item';
                projetoDiv.innerHTML = `
                    <span>${projeto.nome}</span>
                    <div>
                        <button class="edit-btn" data-id="${projeto.id}">Editar</button>
                        <button class="delete-btn" data-id="${projeto.id}">Excluir</button>
                    </div>
                `;
                projetosListaContainer.appendChild(projetoDiv);
            });
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            projetosListaContainer.innerHTML = '<p>Não foi possível carregar os projetos.</p>';
        }
    }

    // Carrega tudo ao iniciar a página
    carregarEsportes();
    carregarProjetos();

    // --- LÓGICA DO FORMULÁRIO (CRIAR E ATUALIZAR) ---

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projetoData = {
            nome: nomeInput.value,
            descricao: descricaoInput.value,
            imagem_url: imagemUrlInput.value,
            link_site: linkSiteInput.value,
            link_repositorio: linkRepositorioInput.value,
            contato_coordenador: contatoCoordenadorInput.value, // Novo campo
            esporte_id: parseInt(esporteSelect.value, 10) // Novo campo (convertido para número)
        };
        
        const id = projetoIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrlProjetos}/${id}` : apiUrlProjetos;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projetoData)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Erro ao salvar projeto.');
            }

            alert(`Projeto ${id ? 'atualizado' : 'criado'} com sucesso!`);
            resetarFormulario();
            carregarProjetos();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert(error.message);
        }
    });

    // --- AÇÕES (EDITAR, DELETAR, CANCELAR) ---

    projetosListaContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // Ação de Deletar
        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este projeto?')) {
                try {
                    const response = await fetch(`${apiUrlProjetos}/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Falha ao excluir.');
                    
                    alert('Projeto excluído com sucesso!');
                    carregarProjetos();

                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert('Não foi possível excluir o projeto.');
                }
            }
        }

        // Ação de Editar
        if (target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${apiUrlProjetos}/${id}`);
                if (!response.ok) throw new Error('Projeto não encontrado.');
                const projeto = await response.json();

                // Preenche o formulário com os dados do projeto
                projetoIdInput.value = projeto.id;
                nomeInput.value = projeto.nome;
                descricaoInput.value = projeto.descricao;
                imagemUrlInput.value = projeto.imagem_url;
                linkSiteInput.value = projeto.link_site;
                linkRepositorioInput.value = projeto.link_repositorio;
                contatoCoordenadorInput.value = projeto.contato_coordenador;
                esporteSelect.value = projeto.esporte_id;

                submitButton.textContent = 'Atualizar Projeto';
                cancelEditButton.style.display = 'inline-block';
                window.scrollTo(0, 0); // Rola a página para o topo

            } catch (error) {
                console.error('Erro ao buscar para edição:', error);
                alert('Não foi possível carregar os dados para edição.');
            }
        }
    });

    function resetarFormulario() {
        form.reset();
        projetoIdInput.value = '';
        submitButton.textContent = 'Adicionar Projeto';
        cancelEditButton.style.display = 'none';
    }

    cancelEditButton.addEventListener('click', resetarFormulario);
    
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
});