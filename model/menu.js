/* === FILE: js/menu.js (Dùng cho view/menu.html) === */

import { getProducts } from './api.js';

// === 1. LOGIC GIỎ HÀNG (Giữ nguyên) ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, icon) {
    const productId = name.replace(/ /g, '-').toLowerCase(); 
    let existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const productData = { id: productId, name: name, price: price, icon: icon, quantity: 1 };
        cart.push(productData);
    }
    
    saveCart();
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (!cartBadge) return; 

    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });

    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.add('active');
    } else {
        cartBadge.textContent = '0';
        cartBadge.classList.remove('active');
    }
}

// === 2. LOGIC RENDER (CẬP NHẬT) ===
function createProductCardHTML(product) {
    // Lưu ý: Vì menu.html và product-detail.html đều nằm trong thư mục view/
    // Nên đường dẫn href là ngang cấp, không cần ../
    return `
        <div class="product-card">
            <div class="product-card-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>
            <div class="product-card-content">
                <h4>
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h4>
                <p class="product-card-price">$${product.price.toFixed(2)}</p>
                <button
                    class="btn-add-to-cart"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-icon="${product.icon}"
                >
                    Đặt hàng
                </button>
            </div>
        </div>
    `;
}

// Hàm render TRANG MENU ĐẦY ĐỦ (LOGIC LỌC MỚI)
async function renderFullMenu() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category'); // Lấy ?category=...
    const filter = urlParams.get('filter');     // Lấy ?filter=...

    const titleElement = document.getElementById('menu-title');
    const gridElement = document.getElementById('full-menu-grid');
    
    if (!gridElement) return;

    let productsToDisplay = [];
    let pageTitle = "Menu";

    // === LOGIC LỌC DỰA TRÊN MẢNG PHẲNG (FLAT ARRAY) ===
    const allProducts = await getProducts();

    // 1. Lọc theo Nhóm (từ Trang chủ bấm sang)
    if (category === 'new') {
        productsToDisplay = allProducts.filter(p => p.isNew === true);
        pageTitle = "Sản phẩm mới ☕";
    } else if (category === 'bestseller') {
        productsToDisplay = allProducts.filter(p => p.isBestseller === true);
        pageTitle = "Sản phẩm bán chạy 🔥";
    
    // 2. Lọc theo Danh mục (từ Menu Dropdown)
    } else if (filter === 'cafe') {
        productsToDisplay = allProducts.filter(p => p.category === 'cafe');
        pageTitle = "Cà Phê Đậm Đà ☕";
    } else if (filter === 'tea') {
        productsToDisplay = allProducts.filter(p => p.category === 'tea');
        pageTitle = "Trà & Đồ Uống Khác 🍹";
    
    // 3. Mặc định (Hiện tất cả)
    } else {
        productsToDisplay = allProducts;
        pageTitle = "Toàn bộ Menu";
    }

    // Cập nhật giao diện
    titleElement.textContent = pageTitle;
    
    if (productsToDisplay.length > 0) {
        gridElement.innerHTML = productsToDisplay.map(createProductCardHTML).join('');
    } else {
        gridElement.innerHTML = '<p style="text-align:center; width:100%; margin-top:20px;">Không tìm thấy sản phẩm nào.</p>';
    }
}


// === 3. EVENT DELEGATION (Giữ nguyên) ===
document.addEventListener('click', function(event) {
    if (event.target.matches('.btn-add-to-cart')) {
        const button = event.target;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const icon = button.dataset.icon;
        addToCart(name, price, icon);
    }
});

// === 4. KHỞI CHẠY (Giữ nguyên) ===
document.addEventListener('DOMContentLoaded', () => { 
    
    // CHỈ RENDER NẾU TÌM THẤY GRID CỦA TRANG MENU
    if (document.getElementById('full-menu-grid')) {
        renderFullMenu(); 
    }
    
    updateCartBadge();

    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });
});