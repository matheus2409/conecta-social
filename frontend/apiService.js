// frontend/apiService.js

// Define a URL base dependendo se estamos no PC ou na Vercel
const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api'; 

/**
 * Função centralizada para chamadas à API.
 * Lida com JSON e evita erros de sintaxe se o servidor falhar.
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

    // Se a resposta for "No Content" (ex: delete com sucesso), retorna ok
    if (response.status === 204) {
      return { success: true };
    }

    // Tenta ler o texto da resposta
    const text = await response.text();

    // Tenta transformar esse texto em JSON
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        // SE ENTRAR AQUI: O servidor devolveu erro HTML ou texto estranho (o teu erro atual)
        console.error("❌ Erro: O servidor não devolveu JSON:", text);
        throw new Error("Erro de comunicação com o servidor (Resposta inválida).");
    }

    // Verifica se a resposta HTTP foi sucesso (200-299)
    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    return data;

  } catch (error) {
    console.error(`❌ Falha na requisição para ${endpoint}:`, error);
    throw error;
  }
}