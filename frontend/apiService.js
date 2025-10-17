// frontend/apiService.js (versão final e otimizada)

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

export async function fetchFromAPI(endpoint, options = {}) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('volunteerAuthToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro HTTP ${response.status}`);
    }

    if (response.status === 204) return { success: true };

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro na requisição a ${endpoint}:`, error);
    throw error;
  }
}