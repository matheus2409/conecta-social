import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar autenticação
    const token = localStorage.getItem('volunteerAuthToken');
    if (!token) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    // 2. Elementos da DOM
    const nomeEl = document.getElementById('perfil-nome');
    const emailEl = document.getElementById('perfil-email');
    const bioEl = document.getElementById('perfil-bio');
    const interessesEl = document.getElementById('lista-interesses');
    const avatarEl = document.getElementById('avatar-img');
    const logoutBtn = document.getElementById('logout-btn');

    // 3. Função de Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('volunteerAuthToken');
        window.location.href = 'index.html';
    });

    // 4. Carregar dados
    try {
        const perfil = await fetchFromAPI('/voluntarios/perfil');

        // Preencher dados
        nomeEl.textContent = perfil.nome;
        emailEl.textContent = perfil.email;
        
        // Atualiza avatar com as iniciais do nome
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nome)}&background=1DB954&color=fff&size=128`;

        if (perfil.bio) {
            bioEl.textContent = perfil.bio;
        } else {
            bioEl.innerHTML = '<em style="color: #888;">Adicione uma biografia para que os projetos te conheçam melhor!</em>';
        }

        // Renderizar interesses como "tags"
        interessesEl.innerHTML = '';
        if (perfil.interesses && perfil.interesses.length > 0) {
            perfil.interesses.forEach(interesse => {
                const tag = document.createElement('span');
                tag.textContent = interesse;
                tag.style.cssText = `
                    background-color: rgba(29, 185, 84, 0.2); 
                    color: #1ed760; 
                    padding: 5px 12px; 
                    border-radius: 15px; 
                    font-size: 0.9rem; 
                    border: 1px solid #1ed760;
                `;
                interessesEl.appendChild(tag);
            });
        } else {
            interessesEl.innerHTML = '<span style="color: #888;">Nenhum interesse definido.</span>';
        }

    } catch (error) {
        console.error(error);
        alert('Sessão expirada ou erro ao carregar perfil.');
        localStorage.removeItem('volunteerAuthToken');
        window.location.href = 'login-voluntario.html';
    }
});