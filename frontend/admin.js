// frontend/admin.js (Atualizado e Organizado)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Centralizamos a URL da API aqui
    const API_BASE_URL = 'http://localhost:3000/api';

    // Elementos da página
    const form = document.getElementById('projeto-form');
    const projetoIdInput = document.getElementById('projeto-id');
    const nomeInput = document.getElementById('nome');
    // ... (adicione aqui os outros inputs do seu formulário)
    const projetosListaContainer = document.getElementById('projetos-lista-admin');
    const logoutButton = document.getElementById('logout-button');

    // Função para carregar e exibir os projetos
    async function carregarProjetos() {
        try {
            // 2. Usamos a variável para montar a URL
            const response = await fetch(`${API_BASE_URL}/projetos`);
            if (!response.ok) throw new Error('Falha ao buscar projetos.');
            const projetos = await response.json();
            
            projetosListaContainer.innerHTML = '';
            projetos.forEach(projeto => {
                const projetoDiv = document.createElement('div');
                projetoDiv.className = 'projeto-item'; // Mantenha ou use classes do Bootstrap
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
            projetosListaContainer.innerHTML = '<p class="alert alert-warning">Não foi possível carregar os projetos.</p>';
        }
    }

    // Lógica do Formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... (sua lógica de formulário continua aqui, usando a API_BASE_URL)
    });

    // Lógica para os botões de Editar e Apagar
    projetosListaContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // Ação de Apagar
        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem a certeza que deseja excluir este projeto?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` } // Envia o token
                    });

                    if (!response.ok) {
                       const errorData = await response.json();
                       // O backend agora responderá com 401 ou 403 se o token for inválido
                       throw new Error(errorData.error || 'Falha ao excluir.');
                    }
                    
                    alert('Projeto excluído com sucesso!');
                    carregarProjetos();

                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert(`Não foi possível excluir o projeto. Erro: ${error.message}`);
                }
            }
        }
        // ... (sua lógica de edição continua aqui)
    });
    
    // Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    // Carregamento inicial
    carregarProjetos();
});