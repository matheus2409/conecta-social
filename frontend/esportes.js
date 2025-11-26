import { fetchFromAPI } from './apiService.js';

let todosProjetos = [];

document.addEventListener('DOMContentLoaded', async () => {
    await carregarProjetos();
});

async function carregarProjetos() {
    const container = document.getElementById('lista-projetos');
    
    try {
        // Busca todos os projetos do teu banco AWS
        todosProjetos = await fetchFromAPI('/projetos');

        renderizarProjetos(todosProjetos);
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-center text-danger">Erro ao carregar projetos.</p>';
    }
}

// Função que desenha os cartões na tela
function renderizarProjetos(lista) {
    const container = document.getElementById('lista-projetos');
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhum projeto encontrado nesta categoria.</p>';
        return;
    }

    lista.forEach(projeto => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        
        // Define uma imagem padrão se não houver url
        const imagem = projeto.imagem_url || 'https://via.placeholder.com/400x200?text=Esporte';

        card.innerHTML = `
            <div class="card h-100 projeto-card shadow-sm" style="background: rgba(255,255,255,0.1); border: none; color: white;">
                <img src="${imagem}" class="card-img-top" alt="${projeto.titulo}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-success mb-2" style="width: fit-content;">${projeto.categoria || 'Geral'}</span>
                    <h5 class="card-title">${projeto.titulo}</h5>
                    <p class="card-text flex-grow-1">${projeto.descricao.substring(0, 100)}...</p>
                    <a href="projeto-detalhe.html?id=${projeto.id}" class="btn btn-outline-light mt-auto">Ver Detalhes</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função global para ser chamada pelos botões HTML
window.filtrarPor = (categoria) => {
    const titulo = document.getElementById('titulo-secao');
    
    if (categoria === 'todos') {
        titulo.textContent = 'Todos os Projetos';
        renderizarProjetos(todosProjetos);
    } else {
        titulo.textContent = `Projetos de ${categoria}`;
        // Filtra a lista localmente
        const filtrados = todosProjetos.filter(p => 
            p.categoria && p.categoria.toLowerCase().includes(categoria.toLowerCase())
        );
        renderizarProjetos(filtrados);
    }
};