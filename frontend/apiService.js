// frontend/apiService.js (Atualizado)

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função central para todos os pedidos à API do nosso projeto.
 * Lida com a adição automática do token de autenticação e trata os erros de forma padronizada.
 * @param {string} endpoint O caminho da API que queremos aceder (ex: '/projetos').
 * @param {object} options As opções para o `fetch` (ex: method, body).
 * @returns {Promise<any>} Os dados da resposta em formato JSON.
 */
async function fetchFromAPI(endpoint, options = {}) {
    // 1. Pega o token do localStorage usando a chave padronizada.
    const token = localStorage.getItem('authToken');

    // 2. Prepara os cabeçalhos (headers) da requisição.
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 3. Se um token existir, adiciona-o ao cabeçalho de Autorização.
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // 4. Faz a chamada à API.
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 5. Se a resposta não for bem-sucedida (ex: erro 401, 404, 500), trata o erro.
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Tenta ler o corpo do erro
            const errorMessage = errorData.error || `Erro HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        // 6. Se a resposta for um '204 No Content' (comum em pedidos DELETE), retorna sucesso.
        if (response.status === 204) {
            return { success: true };
        }

        // 7. Se tudo correu bem, retorna os dados em JSON.
        return response.json();

    } catch (error) {
        console.error(`Erro na chamada da API para ${endpoint}:`, error);
        // Re-lança o erro para que a função que chamou o fetchFromAPI possa tratá-lo também.
        throw error;
    }
}