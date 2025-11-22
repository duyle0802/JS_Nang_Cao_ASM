/* === FILE: cart.js (ĐÃ SỬA LỖI LOGIC) === */

// === 1. LẤY GIỎ HÀNG TỪ LOCALSTORAGE ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// === 2. CÁC HÀM XỬ LÝ GIỎ HÀNG ===

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

// Hàm cập nhật số lượng
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            // Nếu số lượng <= 0, xóa sản phẩm
            cart = cart.filter(item => item.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
    }
    
    // Lưu lại và render lại trang
    saveCart();
    renderCartPage(); // Chỉ vẽ lại giao diện
    updateCartBadge(); // Cập nhật huy hiệu
}

// === 3. HÀM RENDER CHÍNH CHO TRANG GIỎ HÀNG ===
function renderCartPage() {
    const cartContainer = document.getElementById('cart-page-container');
    if (!cartContainer) return;

    // Nếu giỏ hàng trống
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <p>Giỏ hàng của bạn đang trống.</p>
                <a href="menu.html?category=new" class="btn-primary">Bắt đầu mua sắm</a>
            </div>
        `;
        return;
    }

    let total = 0;
    
    // Tạo HTML cho từng sản phẩm
const itemsHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
        <div class="cart-page-item">
            <div class="item-product-info">
                <span class="item-icon">${item.icon}</span>
                <span class="item-name">${item.name}</span>
            </div>

            <span class="item-price">$${item.price.toFixed(2)}</span>
            
            <div class="item-quantity-controls">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
            
            <span class="item-total">$${itemTotal.toFixed(2)}</span>
            
            <button class="remove-btn" data-id="${item.id}">Xóa</button>
        </div>
    `;
}).join('');

    // Tạo HTML cho toàn bộ trang
    cartContainer.innerHTML = `
        <div class="cart-page-header">
            <span>Sản phẩm</span>
            <span>Giá</span>
            <span>Số lượng</span>
            <span>Tổng</span>
            <span></span>
        </div>
        <div class="cart-page-items-list">
            ${itemsHTML}
        </div>
        <div class="cart-page-summary">
            <strong class="cart-total-text">Tổng cộng: $${total.toFixed(2)}</strong>
            <a href="checkout.html" class="btn-primary btn-checkout">Tiến hành Thanh toán</a>
        </div>
    `;

    // !!! ĐÃ XÓA Event Listener ra khỏi đây !!!
}


// === 4. KHỞI CHẠY KHI TẢI TRANG ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render giỏ hàng lần đầu
    renderCartPage();
    // 2. Cập nhật huy hiệu lần đầu
    updateCartBadge();

    // 3. THÊM EVENT LISTENER (MỘT LẦN DUY NHẤT)
    // Thêm listener vào cartContainer, chỉ một lần khi trang tải
    const cartContainer = document.getElementById('cart-page-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            const target = event.target;
            const productId = target.dataset.id;
            
            if (!productId) return; // Không làm gì nếu click ra ngoài

            // Tìm item trong giỏ hàng
            const item = cart.find(item => item.id === productId);

            if (target.matches('.quantity-btn')) {
                // Nút +/-
                const action = target.dataset.action;
                if (!item) return; // Thoát nếu không tìm thấy item (an toàn)

                if (action === 'increase') {
                    updateQuantity(productId, item.quantity + 1);
                } else if (action === 'decrease') {
                    updateQuantity(productId, item.quantity - 1);
                }
            } else if (target.matches('.remove-btn')) {
                // Nút Xóa
                if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                    updateQuantity(productId, 0); // Đặt số lượng = 0 để xóa
                }
            }
        });
    }
});