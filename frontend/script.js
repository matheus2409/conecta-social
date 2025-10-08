// frontend/script.js (versão final corrigida)
import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const projetosContainer = document.getElementById('projetos-container');
  const loadingIndicator = document.getElementById('loading');

  async function carregarProjetos() {
    loadingIndicator.style.display = 'block';
    projetosContainer.innerHTML = '';

    try {
      // Faz a requisição à API
      const projetos = await fetchFromAPI('/projetos');

      if (!projetos || projetos.length === 0) {
        projetosContainer.innerHTML =
          '<p>Ainda não há projetos cadastrados. Seja o primeiro a adicionar um!</p>';
      } else {
        projetos.forEach((projeto) => {
          const card = document.createElement('div');
          card.className = 'projeto-card';
          card.innerHTML = `
            <h3>${projeto.titulo || projeto.nome}</h3>
            <p>${projeto.descricao || 'Sem descrição'}</p>
            ${
              projeto.link
                ? `<a href="${projeto.link}" target="_blank" rel="noopener noreferrer">Ver Projeto</a>`
                : ''
            }
          `;
          projetosContainer.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      projetosContainer.innerHTML = `
        <div class="error-message">
          <p>❌ Não foi possível carregar os projetos.</p>
          <p>Tente novamente mais tarde.</p>
        </div>
      `;
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }

  carregarProjetos();
});
