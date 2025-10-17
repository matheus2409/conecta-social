// frontend/script.js (versão final corrigida)
import { fetchFromAPI } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const projetosContainer = document.getElementById('projetos-container');
  const loadingIndicator = document.getElementById('loading-spinner');

  async function carregarProjetos() {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }
    projetosContainer.innerHTML = '';

    try {
      const projetos = await fetchFromAPI('/projetos');

      if (!projetos || projetos.length === 0) {
        projetosContainer.innerHTML =
          '<div class="col-12"><p class="text-center text-muted">Ainda não há projetos cadastrados.</p></div>';
      } else {
        projetosContainer.innerHTML = ''; 
        projetos.forEach((projeto) => {
          const card = document.createElement('div');
          card.className = 'col-md-6 col-lg-4 mb-4';
          card.innerHTML = `
            <div class="card h-100 projeto-card shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${projeto.titulo || projeto.nome}</h5>
                <p class="card-text flex-grow-1">${projeto.descricao || 'Sem descrição'}</p>
                <a href="projeto-detalhe.html?id=${projeto.id}" class="btn btn-primary mt-auto align-self-start">Ver Detalhes</a>
              </div>
            </div>
          `;
          projetosContainer.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      projetosContainer.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
              <p class="fw-bold">❌ Não foi possível carregar os projetos.</p>
              <p>O servidor pode estar offline ou a conexão foi bloqueada. Tente novamente mais tarde.</p>
              <small>Detalhe do erro: ${error.message}</small>
            </div>
        </div>
      `;
    } finally {
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }
  }

  carregarProjetos();
});