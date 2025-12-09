/* === FILE: js/script.js (Dùng cho index, about, contact...) === */

// === 1. LOGIC GIỎ HÀNG (Dùng chung cho mọi trang) ===
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


// === 2. LOGIC RENDER (Chỉ cho trang chủ) ===
function createProductCardHTML(product) {
    // Lưu ý: Đường dẫn ảnh cần xử lý một chút tùy vào vị trí file HTML
    // Ở trang chủ (index.html) thì link đến detail phải đi vào thư mục view/
    // Nhưng logic này sẽ được xử lý tốt hơn nếu dùng đường dẫn tuyệt đối hoặc server.
    // Tạm thời ta để link trỏ vào view/product-detail.html
    
    // Kiểm tra xem đang ở đâu để tạo link đúng
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const detailLink = isIndexPage ? `view/product-detail.html?id=${product.id}` : `product-detail.html?id=${product.id}`;

    return `
        <div class="product-card">
            <div class="product-card-image">
                <a href="${detailLink}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>
            <div class="product-card-content">
                <h4>
                    <a href="${detailLink}">${product.name}</a>
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

// Hàm render SẢN PHẨM TRANG CHỦ (ĐÃ SỬA LỖI)
function renderHomepageProducts() {
    const newGrid = document.getElementById('new-products-grid');
    const bestsellerGrid = document.getElementById('bestseller-products-grid');

    if (!newGrid || !bestsellerGrid) return;

    // === SỬA LỖI Ở ĐÂY: Dùng .filter() thay vì gọi trực tiếp thuộc tính ===
    
    // Lọc sản phẩm mới (isNew: true)
    const newProducts = allProducts.filter(p => p.isNew).slice(0, 5);
    newGrid.innerHTML = newProducts.map(createProductCardHTML).join('');

    // Lọc sản phẩm bán chạy (isBestseller: true)
    const bestsellerProducts = allProducts.filter(p => p.isBestseller).slice(0, 5);
    bestsellerGrid.innerHTML = bestsellerProducts.map(createProductCardHTML).join('');
}


// === 3. EVENT DELEGATION (Dùng chung cho mọi trang) ===
document.addEventListener('click', function(event) {
    if (event.target.matches('.btn-add-to-cart')) {
        const button = event.target;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const icon = button.dataset.icon;
        addToCart(name, price, icon);
    }
});

// === 4. KHỞI CHẠY (Logic chung cho mọi trang) ===
document.addEventListener('DOMContentLoaded', () => { 
    
    // CHỈ RENDER NẾU TÌM THẤY GRID CỦA TRANG CHỦ
    if (document.getElementById('new-products-grid')) {
        renderHomepageProducts(); 
    }
    
    // Cập nhật huy hiệu (luôn chạy)
    updateCartBadge();

    // Hiệu ứng cuộn (luôn chạy)
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