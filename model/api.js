/* === FILE: model/api.js === */
const API_BASE = 'http://localhost:3000';

async function request(path, options = {}) {
    const url = `${API_BASE}/${path}`;
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

// --- PRODUCTS ---
export const getProducts = () => request('products');
export const createProduct = (data) => request('products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateProduct = (id, data) => request(`products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteProduct = (id) => request(`products/${id}`, { method: 'DELETE' });

// --- USERS (MỚI THÊM) ---
export const getUsers = () => request('users');
export const createUser = (data) => request('users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteUser = (id) => request(`users/${id}`, { method: 'DELETE' });