import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Proteção de rota: Verifica se existe token
    const token = localStorage.getItem('volunteerAuthToken');
    if (!token) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    // 2. Referências aos elementos da página
    const nomeEl = document.getElementById('perfil-nome');
    const emailEl = document.getElementById('perfil-email');
    const bioEl = document.getElementById('perfil-bio');
    const interessesEl = document.getElementById('lista-interesses');
    const avatarEl = document.getElementById('avatar-img');
    const logoutBtn = document.getElementById('logout-btn');

    // 3. Configurar botão de Sair
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('volunteerAuthToken');
        window.location.href = 'index.html';
    });

    // 4. Carregar dados da API
    try {
        // Usa a função auxiliar que já tens em apiService.js
        const perfil = await fetchFromAPI('/voluntarios/perfil');

        // Preencher texto simples
        nomeEl.textContent = perfil.nome;
        emailEl.textContent = perfil.email;
        
        // Gerar avatar com iniciais usando serviço externo gratuito
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nome)}&background=1DB954&color=fff&size=128&bold=true`;
        avatarEl.src = avatarUrl;

        // Lógica para biografia vazia
        if (perfil.bio) {
            bioEl.textContent = perfil.bio;
        } else {
            bioEl.innerHTML = '<em style="color: #888;">Ainda não adicionou uma biografia. Clique em "Editar Perfil" para se apresentar!</em>';
        }

        // Renderizar lista de interesses como "tags"
        interessesEl.innerHTML = '';
        if (perfil.interesses && perfil.interesses.length > 0) {
            perfil.interesses.forEach(interesse => {
                const tag = document.createElement('span');
                tag.textContent = interesse;
                // Estilo "pill" (pílula) para as tags
                tag.style.cssText = `
                    background-color: rgba(29, 185, 84, 0.15); 
                    color: #1ed760; 
                    padding: 6px 14px; 
                    border-radius: 20px; 
                    font-size: 0.9rem; 
                    border: 1px solid rgba(29, 185, 84, 0.3);
                `;
                interessesEl.appendChild(tag);
            });
        } else {
            interessesEl.innerHTML = '<span style="color: #888;">Nenhum interesse definido.</span>';
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert('Sessão expirada ou erro de conexão. Por favor, faça login novamente.');
        localStorage.removeItem('volunteerAuthToken');
        window.location.href = 'login-voluntario.html';
    }
});