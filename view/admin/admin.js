/* === FILE: view/admin/admin.js === */
// Import từ model (chú ý số lượng dấu ../ tùy thuộc cấu trúc thư mục của bạn)
// Nếu admin.js nằm cạnh admin.html trong view/admin/, thì api.js ở ../../model/api.js
import { 
    getProducts, createProduct, updateProduct, deleteProduct,
    getUsers, createUser, updateUser, deleteUser 
} from '../../model/api.js';

// --- 1. XỬ LÝ CHUYỂN TAB (Fix lỗi quan trọng nhất) ---
const sectionProducts = document.getElementById('section-products');
const sectionUsers = document.getElementById('section-users');
const tabProd = document.getElementById('tab-prod');
const tabUser = document.getElementById('tab-user');

// Gán hàm vào window để HTML onclick gọi được
window.switchTab = function(tabName) {
    if (tabName === 'products') {
        sectionProducts.classList.remove('hidden');
        sectionUsers.classList.add('hidden');
        tabProd.classList.add('active');
        tabUser.classList.remove('active');
        loadProducts(); // Load lại dữ liệu cho chắc
    } else {
        sectionProducts.classList.add('hidden');
        sectionUsers.classList.remove('hidden');
        tabProd.classList.remove('active');
        tabUser.classList.add('active');
        loadUsers(); // Load dữ liệu user
    }
};

// --- 2. LOGIC SẢN PHẨM ---
let products = [];
let editingProdId = null;
const prodTbody = document.querySelector('#products-table tbody');
const prodForm = document.getElementById('product-form');

async function loadProducts() {
    try {
        products = await getProducts();
        renderProducts(document.getElementById('search').value);
    } catch (e) { console.error(e); }
}

function renderProducts(filter = '') {
    prodTbody.innerHTML = '';
    const q = filter.toLowerCase();
    const list = products.filter(p => (p.name||'').toLowerCase().includes(q) || (p.id||'').includes(q));
    
    list.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.icon || ''}</td>
            <td>${p.category || ''}</td>
            <td>${p.isNew ? '<span style="color:green">New</span> ' : ''} ${p.isBestseller ? '<span style="color:orange">Hot</span>' : ''}</td>
            <td>
                <button class="btn-ghost small" onclick="editProduct('${p.id}')">Sửa</button>
                <button class="btn-primary small" style="background:#d9534f" onclick="removeProduct('${p.id}')">Xóa</button>
            </td>
        `;
        prodTbody.appendChild(tr);
    });
    document.getElementById('total-count').textContent = list.length;
}

// Gán function con vào window để gọi được từ button trong bảng
window.editProduct = (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingProdId = id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-icon').value = p.icon;
    document.getElementById('p-image').value = p.image;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-description').value = p.description;
    document.getElementById('p-isNew').checked = p.isNew;
    document.getElementById('p-isBestseller').checked = p.isBestseller;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.removeProduct = async (id) => {
    if (confirm('Xóa sản phẩm này?')) {
        await deleteProduct(id);
        loadProducts();
    }
};

prodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        icon: document.getElementById('p-icon').value,
        image: document.getElementById('p-image').value,
        category: document.getElementById('p-category').value,
        description: document.getElementById('p-description').value,
        isNew: document.getElementById('p-isNew').checked,
        isBestseller: document.getElementById('p-isBestseller').checked,
    };

    if (editingProdId) {
        await updateProduct(editingProdId, { ...data, id: editingProdId });
    } else {
        await createProduct({ ...data, id: 'n' + Date.now() });
    }
    prodForm.reset();
    editingProdId = null;
    loadProducts();
});

document.getElementById('reset-prod-btn').addEventListener('click', () => {
    prodForm.reset();
    editingProdId = null;
});
document.getElementById('search').addEventListener('input', (e) => renderProducts(e.target.value));


// --- 3. LOGIC NGƯỜI DÙNG (USER) ---
let users = [];
let editingUserId = null;
const userTbody = document.querySelector('#users-table tbody');
const userForm = document.getElementById('user-form');

async function loadUsers() {
    try {
        users = await getUsers();
        renderUsers();
    } catch (e) { console.error(e); }
}

function renderUsers() {
    userTbody.innerHTML = '';
    users.forEach(u => {
        const tr = document.createElement('tr');
        const roleColor = u.role === 'admin' ? 'color:red;font-weight:bold' : 'color:green';
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.fullname || ''}</td>
            <td>${u.email}</td>
            <td>${u.password}</td>
            <td style="${roleColor}">${u.role}</td>
            <td>
                <button class="btn-ghost small" onclick="editUser('${u.id}')">Sửa</button>
                <button class="btn-primary small" style="background:#d9534f" onclick="removeUser('${u.id}')">Xóa</button>
            </td>
        `;
        userTbody.appendChild(tr);
    });
}

window.editUser = (id) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    editingUserId = id;
    document.getElementById('u-email').value = u.email;
    document.getElementById('u-password').value = u.password;
    document.getElementById('u-fullname').value = u.fullname;
    document.getElementById('u-role').value = u.role;
};

window.removeUser = async (id) => {
    if (confirm('Bạn chắc chắn muốn xóa user này?')) {
        await deleteUser(id);
        loadUsers();
    }
};

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById('u-email').value,
        password: document.getElementById('u-password').value,
        fullname: document.getElementById('u-fullname').value,
        role: document.getElementById('u-role').value
    };

    if (editingUserId) {
        await updateUser(editingUserId, { ...data, id: editingUserId });
        alert('Cập nhật user thành công');
    } else {
        await createUser({ ...data, id: 'u' + Date.now() });
        alert('Thêm user thành công');
    }
    userForm.reset();
    editingUserId = null;
    loadUsers();
});

document.getElementById('reset-user-btn').addEventListener('click', () => {
    userForm.reset();
    editingUserId = null;
});

// --- 4. INIT ---
// Chạy khi trang vừa tải
(function init() {
    // Check login
    const cu = JSON.parse(localStorage.getItem('currentUser'));
    if (!cu || cu.role !== 'admin') {
        alert('Bạn không có quyền truy cập!');
        window.location.href = '../../index.html'; // Quay về trang chủ
        return;
    }
    document.getElementById('admin-greeting').textContent = `Xin chào, ${cu.fullname || cu.email}`;

    // Logout logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../../view/login.html';
    });

    // Mặc định load sản phẩm
    loadProducts();
})();