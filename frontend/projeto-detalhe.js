import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const areaDetalhe = document.getElementById('detalhe-projeto');
    
    // Pega o ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');

    if (!projetoId) {
        areaDetalhe.innerHTML = '<div class="alert alert-danger text-center">ID do projeto não fornecido.</div>';
        return;
    }

    try {
        const projeto = await fetchFromAPI(`/projetos/${projetoId}`);
        document.title = `${projeto.titulo} - Detalhes`;

        // Prepara dados (evita null/undefined)
        const imagem = projeto.imagem_url || 'https://via.placeholder.com/1200x400?text=Projeto+Social';
        const contatoNome = projeto.nome_contato || 'Responsável';
        const contatoInfo = projeto.contato_coordenador || 'Não informado';
        const localTexto = projeto.local || 'Localização não informada';
        const descricaoCurta = projeto.descricao_curta || '';

        // Monta o HTML
        const html = `
            <div class="detalhe-container animate-fade-in">
                
                <header class="detalhe-header">
                    <img src="${imagem}" alt="Capa" onerror="this.src='https://via.placeholder.com/1200x400?text=Imagem+Quebrada'">
                </header>

                <div class="detalhe-conteudo">
                    <span class="categoria-badge">${projeto.categoria || 'Geral'}</span>
                    <h1 class="mb-3">${projeto.titulo}</h1>
                    
                    <p class="lead text-light mb-5" style="opacity: 0.9; font-size: 1.2rem;">
                        ${descricaoCurta}
                    </p>

                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <div class="info-box d-flex flex-column justify-content-center">
                                <strong style="color: #1DB954; font-size: 1.1rem;">📍 Onde Fica?</strong>
                                <p class="m-0 mt-2 text-white">${localTexto}</p>
                                <div id="map"></div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="info-box">
                                <strong style="color: #1DB954; font-size: 1.1rem;">👤 Responsável</strong>
                                <p class="mt-2 text-white fs-5 fw-bold text-uppercase">${contatoNome}</p>
                                <hr style="border-color: #444;">
                                <strong style="color: #1DB954; font-size: 1.1rem;">📞 Contato</strong>
                                <p class="mt-2 text-white">${contatoInfo}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <h5 class="border-bottom border-secondary pb-2">Sobre o Projeto</h5>
                        <div style="line-height: 1.8; color: #ddd; white-space: pre-line; font-size: 1.05rem;">
                            ${projeto.descricao || 'Sem descrição detalhada.'}
                        </div>
                    </div>

                    ${projeto.link_site ? `
                        <div class="text-center mt-5 mb-3">
                            <a href="${projeto.link_site}" target="_blank" class="btn btn-success btn-lg px-5 shadow-lg rounded-pill fw-bold">
                                🌐 Visitar Site Oficial
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        areaDetalhe.innerHTML = html;

        // Renderiza o MAPA (se houver coordenadas)
        if (projeto.latitude && projeto.longitude) {
            const lat = parseFloat(projeto.latitude);
            const lon = parseFloat(projeto.longitude);

            if (!isNaN(lat) && !isNaN(lon)) {
                const map = L.map('map').setView([lat, lon], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${projeto.titulo}</b><br>${localTexto}`)
                    .openPopup();
            } else {
                document.getElementById('map').innerHTML = '<p class="text-muted small text-center mt-5">Mapa indisponível.</p>';
            }
        } else {
            document.getElementById('map').style.display = 'none'; // Esconde se não houver mapa
        }

    } catch (error) {
        console.error("Erro:", error);
        areaDetalhe.innerHTML = `<div class="alert alert-danger text-center">Erro: ${error.message}</div>`;
    }
});