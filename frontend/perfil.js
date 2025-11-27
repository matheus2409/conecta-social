import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Proteção de Rota
    const token = localStorage.getItem('volunteerAuthToken');
    if (!token) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    // 2. Elementos
    const nomeEl = document.getElementById('perfil-nome');
    const emailEl = document.getElementById('perfil-email');
    const avatarEl = document.getElementById('avatar-img');
    const listaProjetosEl = document.getElementById('lista-meus-projetos');
    const logoutBtn = document.getElementById('logout-btn');

    // 3. Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('volunteerAuthToken');
        window.location.href = 'index.html';
    });

    // 4. Carregar Dados do Voluntário
    try {
        const perfil = await fetchFromAPI('/voluntarios/perfil');
        nomeEl.textContent = perfil.nome;
        emailEl.textContent = perfil.email;
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nome)}&background=1DB954&color=fff`;
    } catch (error) {
        console.error("Erro perfil:", error);
    }

    // 5. Carregar "Meus Projetos"
    try {
        const projetos = await fetchFromAPI('/projetos/meus'); // Chama a nova rota

        listaProjetosEl.innerHTML = '';
        if (projetos.length === 0) {
            listaProjetosEl.innerHTML = '<p class="text-muted">Ainda não criaste nenhum projeto.</p>';
        } else {
            projetos.forEach(projeto => {
                const item = document.createElement('div');
                item.className = 'projeto-item';
                item.innerHTML = `
                    <div>
                        <strong style="color: white; font-size: 1.1rem;">${projeto.titulo}</strong>
                        <br>
                        <span class="badge bg-secondary">${projeto.categoria}</span>
                    </div>
                    <div>
                        <a href="projeto-detalhe.html?id=${projeto.id}" class="btn btn-sm btn-info" title="Ver">👁️</a>
                        <button class="btn btn-sm btn-danger btn-deletar" data-id="${projeto.id}" title="Apagar">🗑️</button>
                    </div>
                `;
                listaProjetosEl.appendChild(item);
            });

            // Adicionar eventos de delete
            document.querySelectorAll('.btn-deletar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm('Tem a certeza? Esta ação não pode ser desfeita.')) {
                        try {
                            const id = e.target.dataset.id;
                            await fetchFromAPI(`/projetos/${id}`, { method: 'DELETE' });
                            e.target.closest('.projeto-item').remove();
                        } catch (err) {
                            alert('Erro ao apagar: ' + err.message);
                        }
                    }
                });
            });
        }
    } catch (error) {
        listaProjetosEl.innerHTML = '<p class="text-danger">Erro ao carregar projetos.</p>';
    }
});