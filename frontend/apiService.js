const API_BASE_URL = '/api/projetos';

// Função auxiliar para tratar as respostas do fetch
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Erro ${response.status}` }));
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    // Para respostas 204 (No Content), não há corpo para converter para JSON
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

// Funções para cada operação do CRUD
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
    return handleResponse(response);
}