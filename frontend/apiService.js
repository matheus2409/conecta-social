import { getToken, logout } from './auth.js';

const API_BASE_URL = '/api/projetos';

async function handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
        // Se o token for inválido ou expirar, desloga o usuário
        logout();
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Erro ${response.status}` }));
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

// Função para criar os cabeçalhos, adicionando o token se existir
function createHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Funções do CRUD atualizadas para usar os novos cabeçalhos
export async function getProjetos(pagina = 1, busca = '', categoria = '') {
    const url = new URL(API_BASE_URL, window.location.origin);
    url.searchParams.append('pagina', pagina);
    if (busca) url.searchParams.append('q', busca);
    if (categoria) url.searchParams.append('categoria', categoria);
    
    const response = await fetch(url);
    return handleResponse(response);
}

export async function getProjetoPorId(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
}

export async function criarProjeto(projeto) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(projeto),
    });
    return handleResponse(response);
}

export async function atualizarProjeto(id, projeto) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(projeto),
    });
    return handleResponse(response);
}

export async function deletarProjeto(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
    });
    return handleResponse(response);
}