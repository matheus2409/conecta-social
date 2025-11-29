import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const areaDetalhe = document.getElementById('detalhe-projeto');
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');
    
    // --- LÓGICA DE PERMISSÃO ---
    const volToken = localStorage.getItem('volunteerAuthToken');
    const adminToken = localStorage.getItem('authToken');
    
    let usuarioId = null;
    let isAdmin = false;

    if (adminToken) {
        try {
            const payload = JSON.parse(atob(adminToken.split('.')[1]));
            if (payload.role === 'admin') isAdmin = true;
        } catch (e) {}
    }

    if (!isAdmin && volToken) {
        try {
            const payload = JSON.parse(atob(volToken.split('.')[1]));
            usuarioId = payload.id;
        } catch (e) {}
    }

    const isLogado = !!(volToken || adminToken);

    if (!projetoId) {
        areaDetalhe.innerHTML = '<div class="alert alert-danger text-center">ID do projeto não fornecido.</div>';
        return;
    }

    try {
        const projeto = await fetchFromAPI(`/projetos/${projetoId}`);
        const imagensExtras = await fetchFromAPI(`/projetos/${projetoId}/imagens`);
        
        document.title = `${projeto.titulo} - Detalhes`;

        const imagemCapa = projeto.imagem_url || 'https://via.placeholder.com/1200x400?text=Projeto+Social';
        const slides = [ { url: imagemCapa, active: true } ];
        
        if (imagensExtras && Array.isArray(imagensExtras)) {
            imagensExtras.forEach(img => slides.push({ url: img.imagem_url, active: false }));
        }

        let carouselIndicators = '';
        let carouselItems = '';

        slides.forEach((slide, index) => {
            const activeClass = index === 0 ? 'active' : '';
            carouselIndicators += `<button type="button" data-bs-target="#carouselProjeto" data-bs-slide-to="${index}" class="${activeClass}"></button>`;
            carouselItems += `
                <div class="carousel-item ${activeClass}" style="height: 100%;">
                    <img src="${slide.url}" class="d-block w-100" style="height: 100%; object-fit: cover; mask-image: linear-gradient(to bottom, black 60%, transparent 100%);">
                </div>
            `;
        });

        // VERIFICA SE PODE EDITAR (Admin ou Dono)
        const podeEditar = isAdmin || (usuarioId && usuarioId === projeto.criador_id);
        
        const botaoAddFoto = podeEditar ? `
            <button id="btn-nova-foto" class="btn-add-foto shadow">
                📸 Adicionar Foto
            </button>
            <input type="file" id="input-nova-foto" accept="image/*" style="display: none;">
        ` : '';

        const html = `
            <div class="detalhe-container animate-fade-in">
                <div id="carouselProjeto" class="carousel slide detalhe-header" data-bs-ride="carousel">
                    ${botaoAddFoto}
                    <div class="carousel-indicators">${carouselIndicators}</div>
                    <div class="carousel-inner" style="height: 100%;">${carouselItems}</div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselProjeto" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselProjeto" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>

                <div class="detalhe-conteudo">
                    <span class="categoria-badge">${projeto.categoria || 'Geral'}</span>
                    <h1 class="mb-3">${projeto.titulo}</h1>
                    <p class="lead text-light mb-5" style="opacity: 0.9;">${projeto.descricao_curta || ''}</p>
                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <div class="info-box">
                                <strong style="color: #1DB954;">📍 Onde Fica?</strong>
                                <p class="m-0 mt-2 text-white">${projeto.local || 'Não informado'}</p>
                                <div id="map"></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-box">
                                <strong style="color: #1DB954;">👤 Responsável</strong>
                                <p class="mt-2 text-white fs-5 fw-bold">${projeto.nome_contato || 'Responsável'}</p>
                                <hr style="border-color: #444;">
                                <strong style="color: #1DB954;">📞 Contato</strong>
                                <p class="mt-2 text-white">${projeto.contato_coordenador || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mb-5">
                        <h5 class="border-bottom border-secondary pb-2">Sobre o Projeto</h5>
                        <div style="line-height: 1.8; color: #ddd; white-space: pre-line;">${projeto.descricao || 'Sem descrição.'}</div>
                    </div>

                    <div class="comentarios-section">
                        <h3 class="mb-4">💬 Comentários</h3>
                        <div id="area-formulario" class="mb-5">
                            ${ isLogado ? `
                                <form id="form-comentario" class="form-comentario">
                                    <div class="mb-3"><textarea id="texto-comentario" class="form-control input-dark" rows="3" placeholder="Comentário..." required></textarea></div>
                                    <div class="mb-3"><label class="text-muted small">📸 Foto (opcional)</label><input type="file" id="input-imagem-comentario" class="form-control input-dark" accept="image/*"></div>
                                    <button type="submit" class="btn btn-success px-4">Enviar</button>
                                </form>
                            ` : `<div class="aviso-login">Faz login para comentar.</div>`}
                        </div>
                        <div id="lista-comentarios">A carregar...</div>
                    </div>
                </div>
            </div>
        `;

        areaDetalhe.innerHTML = html;

        // Renderiza Mapa
        if (projeto.latitude && projeto.longitude) {
            const lat = parseFloat(projeto.latitude);
            const lon = parseFloat(projeto.longitude);
            if (!isNaN(lat) && !isNaN(lon)) {
                const map = L.map('map').setView([lat, lon], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
                L.marker([lat, lon]).addTo(map).bindPopup(projeto.titulo);
            } else { document.getElementById('map').style.display = 'none'; }
        } else { document.getElementById('map').style.display = 'none'; }

        // --- LÓGICA DE UPLOAD DE FOTO ---
        if (podeEditar) {
            const btnAdd = document.getElementById('btn-nova-foto');
            const inputAdd = document.getElementById('input-nova-foto');

            if(btnAdd && inputAdd) {
                btnAdd.addEventListener('click', () => inputAdd.click());

                inputAdd.addEventListener('change', async () => {
                    if (inputAdd.files.length > 0) {
                        const file = inputAdd.files[0];
                        if(!confirm("Adicionar foto ao carrossel?")) return;

                        try {
                            btnAdd.textContent = "A enviar...";
                            const base64 = await converterImagemParaBase64(file);
                            
                            const tokenUsado = adminToken || volToken;
                            const response = await fetch(`http://localhost:3000/api/projetos/${projetoId}/imagens`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${tokenUsado}`
                                },
                                body: JSON.stringify({ imagem_url: base64 })
                            });

                            if(!response.ok) throw new Error("Erro ao salvar imagem");

                            alert("Foto adicionada!");
                            window.location.reload(); 
                        } catch (error) {
                            alert("Erro: " + error.message);
                            btnAdd.textContent = "📸 Adicionar Foto";
                        }
                    }
                });
            }
        }

        carregarComentarios(projetoId);
        configurarFormularioComentario(projetoId);

    } catch (error) {
        console.error(error);
        areaDetalhe.innerHTML = `<div class="alert alert-danger text-center">Erro: ${error.message}</div>`;
    }
});

function converterImagemParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function carregarComentarios(id) {
    const div = document.getElementById('lista-comentarios');
    try {
        const comentarios = await fetchFromAPI(`/feedbacks/projeto/${id}`);
        if(comentarios.length === 0) { div.innerHTML = '<p class="text-center text-muted">Sem comentários.</p>'; return; }
        div.innerHTML = comentarios.map(c => `
            <div class="comentario-card animate-fade-in">
                <div class="comentario-header"><span>${c.nome_usuario || 'Anónimo'}</span><span class="comentario-data">${new Date(c.criado_em).toLocaleDateString()}</span></div>
                <div style="color:#ddd">${c.mensagem}</div>
                ${c.imagem_url ? `<img src="${c.imagem_url}" class="comentario-img">` : ''}
            </div>
        `).join('');
    } catch(e) { div.innerHTML = '<p class="text-danger">Erro ao carregar comentários.</p>'; }
}

function configurarFormularioComentario(id) {
    const form = document.getElementById('form-comentario');
    if(!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const texto = document.getElementById('texto-comentario').value;
        const file = document.getElementById('input-imagem-comentario').files[0];
        const btn = form.querySelector('button');
        btn.disabled = true; btn.textContent = "A enviar...";
        try {
            let img = null;
            if(file) img = await converterImagemParaBase64(file);
            await fetchFromAPI('/feedbacks', { method: 'POST', body: JSON.stringify({ mensagem: texto, id_do_projeto: id, imagem_url: img }) });
            document.getElementById('texto-comentario').value = '';
            document.getElementById('input-imagem-comentario').value = '';
            carregarComentarios(id);
        } catch(err) { alert(err.message); }
        finally { btn.disabled = false; btn.textContent = "Enviar"; }
    });
}