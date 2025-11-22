/* === FILE: checkout.js (CHO TRANG checkout.html) === */

// === 1. LẤY GIỎ HÀNG TỪ LOCALSTORAGE ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// === 2. HÀM CẬP NHẬT HUY HIỆU (Tương tự cart.js) ===
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

// === 3. HÀM RENDER TÓM TẮT ĐƠN HÀNG ===
function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-summary-list');
    const summaryTotal = document.getElementById('checkout-summary-total');
    
    if (!summaryList || !summaryTotal) return;

    if (cart.length === 0) {
        summaryList.innerHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p>';
        summaryTotal.innerHTML = '';
        return;
    }

    let total = 0;
    
    const itemsHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="summary-item">
                <span>${item.name} <span class="summary-quantity">x ${item.quantity}</span></span>
                <strong>$${itemTotal.toFixed(2)}</strong>
            </div>
        `;
    }).join('');

    summaryList.innerHTML = itemsHTML;
    summaryTotal.innerHTML = `<strong>Tổng cộng: $${total.toFixed(2)}</strong>`;
}

// === 4. XỬ LÝ FORM VÀ THANH TOÁN ===
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    // Xử lý ẩn/hiện mã QR MoMo
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const momoQRDiv = document.getElementById('momo-qr');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'momo') {
                momoQRDiv.style.display = 'block';
            } else {
                momoQRDiv.style.display = 'none';
            }
        });
    });

    // Xử lý khi nhấn nút "Đặt Hàng"
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Ngăn form gửi đi

        // (Đây là nơi bạn sẽ thêm logic xác thực form)
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        if (!name || !phone) {
            alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại.');
            return;
        }
        
        // (Đây là nơi bạn sẽ gửi email biên lai)
        const email = document.getElementById('email').value;
        console.log(`Gửi biên lai đến ${email}`);

        // Xử lý đơn hàng thành công
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        
        // Xóa giỏ hàng
        cart = [];
        localStorage.removeItem('cart');
        
        // Cập nhật huy hiệu
        updateCartBadge();

        // Chuyển về trang chủ
        window.location.href = 'index.html';
    });
}

// === 5. KHỞI CHẠY KHI TẢI TRANG ===
document.addEventListener('DOMContentLoaded', () => {
    // Nếu giỏ hàng trống, không cho checkout, đẩy về trang giỏ hàng
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    renderCheckoutSummary();
    updateCartBadge();
    setupCheckoutForm();
});