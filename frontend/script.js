import { getProjetos } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    // ... (restante do seu código, se houver)

    const projetosContainer = document.getElementById('projetos-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const paginacaoContainer = document.getElementById('paginacao');
    const buscaInput = document.getElementById('busca');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnLimpar = document.getElementById('btn-limpar-filtros');

    let paginaAtual = 1;

    function toggleSpinner(show) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
        if (show) {
            projetosContainer.innerHTML = ''; // Limpa o container ao carregar
        }
    }
    
    async function carregarProjetos() {
        toggleSpinner(true);
        const termoBusca = buscaInput.value.trim();
        const categoria = filtroCategoria.value;

        try {
            const data = await getProjetos(paginaAtual, termoBusca, categoria);
            
            if (data.projetos && data.projetos.length > 0) {
                projetosContainer.innerHTML = ''; // Limpa o spinner
                data.projetos.forEach(projeto => {
                    const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm">
                                <img src="${projeto.imagem_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}" class="card-img-top" alt="${projeto.titulo}">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${projeto.titulo}</h5>
                                    <p class="card-text flex-grow-1">${projeto.descricao.substring(0, 100)}...</p>
                                    <a href="projeto.html?id=${projeto.id}" class="btn btn-primary mt-auto">Saiba Mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                    projetosContainer.innerHTML += card;
                });
                renderizarPaginacao(data.totalDePaginas, data.paginaAtual);
            } else {
                projetosContainer.innerHTML = '<p class="col-12 text-center">Nenhum projeto encontrado.</p>';
                paginacaoContainer.innerHTML = '';
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            projetosContainer.innerHTML = `<p class="col-12 text-center text-danger">Erro ao carregar os projetos: ${error.message}</p>`;
        } finally {
            toggleSpinner(false);
        }
    }

    function renderizarPaginacao(totalDePaginas, pagina) {
        paginacaoContainer.innerHTML = '';
        if (totalDePaginas <= 1) return;

        // Botão "Anterior"
        const prevDisabled = pagina <= 1 ? 'disabled' : '';
        paginacaoContainer.innerHTML += `<li class="page-item ${prevDisabled}"><a class="page-link" href="#" data-pagina="${pagina - 1}">Anterior</a></li>`;

        // Botões das páginas
        for (let i = 1; i <= totalDePaginas; i++) {
            const active = i === pagina ? 'active' : '';
            paginacaoContainer.innerHTML += `<li class="page-item ${active}"><a class="page-link" href="#" data-pagina="${i}">${i}</a></li>`;
        }

        // Botão "Próximo"
        const nextDisabled = pagina >= totalDePaginas ? 'disabled' : '';
        paginacaoContainer.innerHTML += `<li class="page-item ${nextDisabled}"><a class="page-link" href="#" data-pagina="${pagina + 1}">Próximo</a></li>`;
    }

    // Event Listeners
    buscaInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            paginaAtual = 1;
            carregarProjetos();
        }
    });

    filtroCategoria.addEventListener('change', () => {
        paginaAtual = 1;
        carregarProjetos();
    });
    
    btnLimpar.addEventListener('click', () => {
        buscaInput.value = '';
        filtroCategoria.value = '';
        paginaAtual = 1;
        carregarProjetos();
    });

    paginacaoContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.tagName === 'A' && !target.parentElement.classList.contains('disabled')) {
            paginaAtual = parseInt(target.dataset.pagina);
            carregarProjetos();
        }
    });

    carregarProjetos();
});