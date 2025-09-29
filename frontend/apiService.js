// frontend/apiService.js (versão melhorada)

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função genérica para fazer pedidos 'fetch' à nossa API.
 * Lida com o token de autenticação automaticamente.
 * @param {string} endpoint O endpoint da API (ex: '/projetos')
 * @param {object} options Opções do fetch (method, headers, body, etc.)
 * @returns {Promise<any>} Os dados da resposta em JSON
 */
async function fetchFromAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Permite sobrescrever ou adicionar headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Tenta extrair uma mensagem de erro do backend
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }

    // Se a resposta não tiver corpo (ex: DELETE com status 204), retorna um sucesso
    if (response.status === 204) {
        return { success: true };
    }

    return response.json();
}