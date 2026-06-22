import { API_BASE_URL } from './config';
import { getToken } from './pages/tokenUtils';

/**
 * Thin wrapper around fetch. It prefixes the API base URL, JSON-encodes the
 * body, and attaches the JWT Authorization header when a token is stored.
 * It returns the raw Response, so callers keep using response.ok and
 * response.json() the same way they did with a bare fetch.
 */
async function request(path, { method = 'GET', body, headers = {} } = {}) {
    const finalHeaders = { ...headers };
    let payload;

    if (body !== undefined) {
        finalHeaders['Content-Type'] = 'application/json';
        payload = JSON.stringify(body);
    }

    const token = getToken();
    if (token) {
        finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${path}`, { method, headers: finalHeaders, body: payload });
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
