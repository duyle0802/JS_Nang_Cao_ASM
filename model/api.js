const API_BASE = 'http://localhost:3000';
const RESOURCE = 'products';

async function request(path = '', options = {}) {
  const url = `${API_BASE}/${path}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API request failed', err, url);
    throw err;
  }
}

export async function getProducts() {
  try {
    return await request(RESOURCE);
  } catch (err) {
    // fallback to localStorage or global allProducts
    const raw = localStorage.getItem('products_v1');
    if (raw) return JSON.parse(raw);
    if (typeof allProducts !== 'undefined') return allProducts;
    return [];
  }
}

export async function getProduct(id) {
  return await request(`${RESOURCE}/${id}`);
}

export async function createProduct(data) {
  return await request(RESOURCE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function updateProduct(id, data) {
  return await request(`${RESOURCE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deleteProduct(id) {
  return await request(`${RESOURCE}/${id}`, { method: 'DELETE' });
}

// expose for debugging
window.__api = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
