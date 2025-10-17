// frontend/apiService.js (Final e Preparado para Produção)

// Detecta o ambiente (local ou publicado no Render/Vercel)
const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api' // URL para desenvolvimento local
    : 'https://conecta-social-projects.vercel.app/api'; // URL de produção

/**
 * Função centralizada e genérica para fazer todas as chamadas à API.
 * @param {string} endpoint - O caminho da API (ex: '/projetos').
 * @param {object} options - Configurações para o fetch (method, body, etc.).
 * @returns {Promise<any>} - A resposta da API em formato JSON.
 */
export async function fetchFromAPI(endpoint, options = {}) {
  // Pega o token de autenticação, seja do admin ou do voluntário
  const token = localStorage.getItem('authToken') || localStorage.getItem('volunteerAuthToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever headers se necessário
  };

  // Se houver um token, adiciona-o ao cabeçalho de autorização
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Se a resposta não for bem-sucedida, tenta extrair a mensagem de erro do backend
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Evita erro se a resposta não for JSON
      throw new Error(errorData.error || `Erro HTTP ${response.status}`);
    }

    // Para respostas sem conteúdo (como um DELETE bem-sucedido)
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro na requisição para ${API_BASE_URL}${endpoint}:`, error);
    // Lança o erro novamente para que a função que chamou possa tratá-lo
    throw error;
  }
}