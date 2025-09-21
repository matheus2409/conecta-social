// frontend/apiService.js

const API_BASE_URL = '/projetos';

// Função genérica para tratar as respostas do fetch
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    return response.json();
}

// Funções para cada operação do CRUD
export async function getProjetos() {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
}

export async function getProjetoPorId(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
}

export async function criarProjeto(projeto) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projeto),
    });
    return handleResponse(response);
}

export async function atualizarProjeto(id, projeto) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projeto),
    });
    return handleResponse(response);
}

export async function deletarProjeto(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    // A resposta de delete pode não ter corpo, então tratamos de forma diferente
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    return { success: true };
}