// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const projetosContainer = document.getElementById('projetos-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const paginacaoContainer = document.getElementById('paginacao');
    const buscaInput = document.getElementById('busca');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnLimpar = document.getElementById('btn-limpar-filtros');

    let paginaAtual = 1;
    let termoBusca = '';
    let categoriaSelecionada = '';

    // Função para mostrar ou esconder o spinner
    function toggleSpinner(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
    
    async function carregarProjetos() {
        toggleSpinner(true);
        projetosContainer.innerHTML = ''; // Limpa os projetos antigos

        try {
            // Constrói a URL com os parâmetros de busca, filtro e paginação
            const url = `/projetos?pagina=${paginaAtual}&q=${termoBusca}&categoria=${categoriaSelecionada}`;
            const response = await fetch(url);
            const data = await response.json();
            
            toggleSpinner(false);
            
            if (data.projetos && data.projetos.length > 0) {
                data.projetos.forEach(projeto => {
                    const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${projeto.imagem_url || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${projeto.titulo}">
                                <div class="card-body">
                                    <h5 class="card-title">${projeto.titulo}</h5>
                                    <p class="card-text">${projeto.descricao.substring(0, 100)}...</p>
                                    <a href="projeto.html?id=${projeto.id}" class="btn btn-primary">Saiba Mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                    projetosContainer.innerHTML += card;
                });
                renderizarPaginacao(data.totalDePaginas, data.paginaAtual);
            } else {
                projetosContainer.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
                paginacaoContainer.innerHTML = ''; // Limpa a paginação se não houver resultados
            }
        } catch (error) {
            toggleSpinner(false);
            console.error('Erro ao carregar projetos:', error);
            projetosContainer.innerHTML = '<p class="text-center text-danger">Erro ao carregar os projetos.</p>';
        }
    }

    function renderizarPaginacao(totalDePaginas, paginaAtual) {
        paginacaoContainer.innerHTML = '';
        if (totalDePaginas <= 1) return;

        // Botão "Anterior"
        paginacaoContainer.innerHTML += `
            <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual - 1}">Anterior</a>
            </li>
        `;

        // Botões das páginas
        for (let i = 1; i <= totalDePaginas; i++) {
            paginacaoContainer.innerHTML += `
                <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                    <a class="page-link" href="#" data-pagina="${i}">${i}</a>
                </li>
            `;
        }

        // Botão "Próximo"
        paginacaoContainer.innerHTML += `
            <li class="page-item ${paginaAtual === totalDePaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual + 1}">Próximo</a>
            </li>
        `;
    }

    // Event Listeners
    buscaInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            termoBusca = buscaInput.value;
            paginaAtual = 1;
            carregarProjetos();
        }
    });

    filtroCategoria.addEventListener('change', () => {
        categoriaSelecionada = filtroCategoria.value;
        paginaAtual = 1;
        carregarProjetos();
    });
    
    btnLimpar.addEventListener('click', () => {
        buscaInput.value = '';
        filtroCategoria.value = '';
        termoBusca = '';
        categoriaSelecionada = '';
        paginaAtual = 1;
        carregarProjetos();
    });

    paginacaoContainer.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A' && !e.target.parentElement.classList.contains('disabled')) {
            paginaAtual = parseInt(e.target.dataset.pagina);
            carregarProjetos();
        }
    });

    // Carga inicial
    carregarProjetos();
});// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const projetosContainer = document.getElementById('projetos-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const paginacaoContainer = document.getElementById('paginacao');
    const buscaInput = document.getElementById('busca');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const btnLimpar = document.getElementById('btn-limpar-filtros');

    let paginaAtual = 1;
    let termoBusca = '';
    let categoriaSelecionada = '';

    // Função para mostrar ou esconder o spinner
    function toggleSpinner(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
    
    async function carregarProjetos() {
        toggleSpinner(true);
        projetosContainer.innerHTML = ''; // Limpa os projetos antigos

        try {
            // Constrói a URL com os parâmetros de busca, filtro e paginação
            const url = `/projetos?pagina=${paginaAtual}&q=${termoBusca}&categoria=${categoriaSelecionada}`;
            const response = await fetch(url);
            const data = await response.json();
            
            toggleSpinner(false);
            
            if (data.projetos && data.projetos.length > 0) {
                data.projetos.forEach(projeto => {
                    const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${projeto.imagem_url || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${projeto.titulo}">
                                <div class="card-body">
                                    <h5 class="card-title">${projeto.titulo}</h5>
                                    <p class="card-text">${projeto.descricao.substring(0, 100)}...</p>
                                    <a href="projeto.html?id=${projeto.id}" class="btn btn-primary">Saiba Mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                    projetosContainer.innerHTML += card;
                });
                renderizarPaginacao(data.totalDePaginas, data.paginaAtual);
            } else {
                projetosContainer.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
                paginacaoContainer.innerHTML = ''; // Limpa a paginação se não houver resultados
            }
        } catch (error) {
            toggleSpinner(false);
            console.error('Erro ao carregar projetos:', error);
            projetosContainer.innerHTML = '<p class="text-center text-danger">Erro ao carregar os projetos.</p>';
        }
    }

    function renderizarPaginacao(totalDePaginas, paginaAtual) {
        paginacaoContainer.innerHTML = '';
        if (totalDePaginas <= 1) return;

        // Botão "Anterior"
        paginacaoContainer.innerHTML += `
            <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual - 1}">Anterior</a>
            </li>
        `;

        // Botões das páginas
        for (let i = 1; i <= totalDePaginas; i++) {
            paginacaoContainer.innerHTML += `
                <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                    <a class="page-link" href="#" data-pagina="${i}">${i}</a>
                </li>
            `;
        }

        // Botão "Próximo"
        paginacaoContainer.innerHTML += `
            <li class="page-item ${paginaAtual === totalDePaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual + 1}">Próximo</a>
            </li>
        `;
    }

    // Event Listeners
    buscaInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            termoBusca = buscaInput.value;
            paginaAtual = 1;
            carregarProjetos();
        }
    });

    filtroCategoria.addEventListener('change', () => {
        categoriaSelecionada = filtroCategoria.value;
        paginaAtual = 1;
        carregarProjetos();
    });
    
    btnLimpar.addEventListener('click', () => {
        buscaInput.value = '';
        filtroCategoria.value = '';
        termoBusca = '';
        categoriaSelecionada = '';
        paginaAtual = 1;
        carregarProjetos();
    });

    paginacaoContainer.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A' && !e.target.parentElement.classList.contains('disabled')) {
            paginaAtual = parseInt(e.target.dataset.pagina);
            carregarProjetos();
        }
    });

    // Carga inicial
    carregarProjetos();
});