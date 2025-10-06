// frontend/apiService.js (Corrigido)

// A URL base para todas as chamadas à API.
// Altere aqui quando publicar o seu projeto online.
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função central para todos os pedidos à API do nosso projeto.
 * Lida com a adição automática do token de autenticação e trata os erros de forma padronizada.
 * @param {string} endpoint O caminho da API que queremos aceder (ex: '/projetos').
 * @param {object} options As opções para o `fetch` (ex: method, body).
 * @returns {Promise<any>} Os dados da resposta em formato JSON.
 */
async function fetchFromAPI(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');

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
            const errorMessage = errorData.error || `Erro HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return { success: true };
        }

        return response.json();

    } catch (error) {
        console.error(`Erro na chamada da API para ${endpoint}:`, error);
        throw error;
    }
}