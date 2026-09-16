const API_BASE = '/api';

export function getToken() {
    return localStorage.getItem('sinaubareng_token');
}

export function setToken(token) {
    if (token) {
        localStorage.setItem('sinaubareng_token', token);
    } else {
        localStorage.removeItem('sinaubareng_token');
    }
}

export function getUser() {
    const user = localStorage.getItem('sinaubareng_user');
    return user ? JSON.parse(user) : null;
}

export function setUser(user) {
    if (user) {
        localStorage.setItem('sinaubareng_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('sinaubareng_user');
    }
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Set Content-Type unless it's a FormData object
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        if (typeof options.body === 'object') {
            options.body = JSON.stringify(options.body);
        }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        setToken(null);
        setUser(null);
        window.dispatchEvent(new Event('auth_failed'));
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMsg = (data && (data.message || (data.errors && Object.values(data.errors)[0]?.[0]))) 
            || 'Terjadi kesalahan sistem.';
        throw new Error(errorMsg);
    }

    return data;
}

export const api = {
    get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
    post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
    put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
    delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};
