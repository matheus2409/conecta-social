// frontend/apiService.js (Final e Preparado para Produção)

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api' // URL para desenvolvimento local
    : '/api'; // URL relativa para produção (Vercel, Render, etc.)

/**
 * Função centralizada para fazer todas as chamadas à API.
 * @param {string} endpoint - O caminho da API (ex: '/projetos').
 * @param {object} options - Configurações para o fetch (method, body, etc.).
 * @returns {Promise<any>} - A resposta da API em formato JSON.
 */
export async function fetchFromAPI(endpoint, options = {}) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('volunteerAuthToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro na requisição para ${API_BASE_URL}${endpoint}:`, error);
    throw error;
  }
}