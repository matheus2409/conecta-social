const TOKEN_KEY = 'admin-token';

export function login(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login.html';
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
    return getToken() !== null;
}