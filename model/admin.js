import { getProducts, createProduct, updateProduct, deleteProduct } from './api.js';

const STORAGE_KEY = 'products_v1';
let products = [];
let editingId = null;

const tbody = document.querySelector('#products-table tbody');
const totalCountEl = document.getElementById('total-count');
const form = document.getElementById('product-form');
const searchInput = document.getElementById('search');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTable(filter = '') {
  if (!tbody) return;
  tbody.innerHTML = '';
  const q = filter.trim().toLowerCase();
  const list = products.filter(p => {
    if (!q) return true;
    return (p.name || '').toLowerCase().includes(q) || (p.id || '').toLowerCase().includes(q);
  });
  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${escapeHtml(p.name || '')}</td>
      <td>$${Number(p.price || 0).toFixed(2)}</td>
      <td>${escapeHtml(p.icon || '')}</td>
      <td>${escapeHtml(p.category || '')}</td>
      <td>${p.isNew ? 'New ' : ''}${p.isBestseller ? 'Bestseller' : ''}</td>
      <td>
        <button class="small" data-action="edit" data-id="${p.id}">Sửa</button>
        <button class="small" data-action="delete" data-id="${p.id}">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  totalCountEl.textContent = products.length;
}

function generateId() {
  return 'c' + Date.now().toString(36);
}

function resetForm() {
  form.reset();
  editingId = null;
  document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
}

function populateForm(product) {
  document.getElementById('p-name').value = product.name || '';
  document.getElementById('p-price').value = product.price || '';
  document.getElementById('p-icon').value = product.icon || '';
  document.getElementById('p-image').value = product.image || '';
  document.getElementById('p-category').value = product.category || '';
  document.getElementById('p-description').value = product.description || '';
  document.getElementById('p-isNew').checked = !!product.isNew;
  document.getElementById('p-isBestseller').checked = !!product.isBestseller;
  document.getElementById('form-title').textContent = 'Sửa sản phẩm: ' + product.id;
}

async function loadAndRender() {
  try {
    products = await getProducts();
  } catch (err) {
    // if API failed, try localStorage fallback
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) products = JSON.parse(raw);
    else products = [];
  }
  renderTable(searchInput.value || '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('p-name').value.trim();
  const price = parseFloat(document.getElementById('p-price').value) || 0;
  const icon = document.getElementById('p-icon').value.trim();
  const image = document.getElementById('p-image').value.trim();
  const category = document.getElementById('p-category').value.trim();
  const description = document.getElementById('p-description').value.trim();
  const isNew = document.getElementById('p-isNew').checked;
  const isBestseller = document.getElementById('p-isBestseller').checked;

  if (!name) return alert('Vui lòng nhập tên sản phẩm');

  if (editingId) {
    try {
      await updateProduct(editingId, { id: editingId, name, price, icon, image, category, description, reviews: [], isNew, isBestseller });
      await loadAndRender();
      resetForm();
      alert('Cập nhật thành công');
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    }
  } else {
    const newId = generateId();
    try {
      await createProduct({ id: newId, name, price, icon, image, category, description, reviews: [], isNew, isBestseller });
      await loadAndRender();
      resetForm();
      alert('Thêm thành công');
    } catch (err) {
      alert('Thêm thất bại: ' + err.message);
    }
  }
});

// reset button
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => resetForm());

// table actions (edit/delete)
tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'edit') {
    const p = products.find(x => x.id === id);
    if (p) {
      editingId = p.id;
      populateForm(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (action === 'delete') {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      await loadAndRender();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    }
  }
});

// search
searchInput.addEventListener('input', (e) => renderTable(e.target.value || ''));

// init
loadAndRender();

// expose helpers for console debugging
window.__admin = { reload: loadAndRender };
