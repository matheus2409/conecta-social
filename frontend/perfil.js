// frontend/perfil.js

document.addEventListener('DOMContentLoaded', async () => {
    // Proteção de rota
    if (!localStorage.getItem('volunteerAuthToken')) {
        window.location.href = 'login-voluntario.html';
        return;
    }

    const perfilContainer = document.getElementById('perfil-container');

    try {
        // Usa fetchFromAPI, que irá enviar o token automaticamente
        const perfil = await fetchFromAPI('/voluntarios/perfil');
        
        perfilContainer.innerHTML = `
            <h2>Olá, ${perfil.nome}!</h2>
            <p><strong>Email:</strong> ${perfil.email}</p>
            <p><strong>Biografia:</strong> ${perfil.bio || 'Adicione uma biografia para se apresentar aos projetos.'}</p>
            <p><strong>Interesses:</strong> ${perfil.interesses ? perfil.interesses.join(', ') : 'Ainda não definiu interesses.'}</p>
            <hr>
            <h3>Projetos Recomendados para Si</h3>
            <div id="recomendacoes">
                <p>(Em breve, aqui aparecerão os projetos que mais combinam contigo!)</p>
            </div>
        `;

    } catch (error) {
        perfilContainer.innerHTML = `<p class="error-text">Não foi possível carregar o seu perfil. Tente fazer login novamente.</p>`;
    }
});