/* === FILE: js/product-detail.js === */

// === 1. LOGIC GIỎ HÀNG (Copy từ script.js) ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, icon) {
    // Tạo ID dựa trên tên (bao gồm cả size nếu có) để phân biệt
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

// === 2. HÀM TÌM SẢN PHẨM (ĐÃ SỬA LỖI CHO MẢNG PHẲNG) ===
function findProductById(productId) {
    // Dữ liệu giờ là mảng phẳng, chỉ cần .find() trực tiếp
    return allProducts.find(p => p.id === productId);
}

// === 3. HÀM RENDER TRANG CHI TIẾT ===
function renderProductDetail(product) {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Render 4 ảnh nhỏ (gallery)
    // Kiểm tra xem gallery có tồn tại không để tránh lỗi
    const galleryHTML = (product.gallery || []).slice(0, 4).map((imgSrc, index) => `
        <img src="${imgSrc}" alt="gallery image ${index + 1}" class="thumbnail-img">
    `).join('');

    // Render nhận xét
    const reviewsHTML = (product.reviews || []).slice(0, 4).map(review => `
        <div class="review-item">
            <strong>${review.author}</strong>
            <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
            <p>${review.text}</p>
        </div>
    `).join('');

    // HTML tổng thể
    container.innerHTML = `
        <div class="pdp-grid">
            <div class="pdp-gallery">
                <div class="gallery-main-image">
                    <img src="${product.image}" alt="${product.name}" id="main-product-image">
                </div>
                <div class="gallery-thumbnails">
                    ${galleryHTML}
                </div>
            </div>

            <div class="pdp-content">
                <h1>${product.name}</h1>
                <span class="pdp-price">$${product.price.toFixed(2)}</span>
                
                <div class="pdp-options">
                    <div class="option-group">
                        <label>Kích cỡ (Size):</label>
                        <div class="option-buttons size-options">
                            <button class="option-btn size-btn active" data-extra="0">S</button>
                            <button class="option-btn size-btn" data-extra="0.25">M</button>
                            <button class="option-btn size-btn" data-extra="0.50">L</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <label>Mức đường:</label>
                        <div class="option-buttons">
                            <button class="option-btn active">Ngọt ít</button>
                            <button class="option-btn">Ngọt nhiều</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <label>Mức đá:</label>
                        <div class="option-buttons">
                            <button class="option-btn active">Đá ít</button>
                            <button class="option-btn">Đá nhiều</button>
                        </div>
                    </div>
                </div>
                
                <button class="btn-primary btn-add-to-cart-pdp" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-icon="${product.icon}">
                    Thêm vào giỏ
                </button>
                
                <div class="pdp-info-tabs">
                    <h3>Thông tin sản phẩm</h3>
                    <p>${product.description}</p>
                    
                    <h3>Nhận xét (${(product.reviews || []).length})</h3>
                    <div class="review-list">
                        ${(product.reviews || []).length > 0 ? reviewsHTML : '<p>Chưa có nhận xét nào cho sản phẩm này.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;

    // === 4. THÊM LOGIC CHO TRANG ===
    addPdpListeners();
}

// === 5. HÀM XỬ LÝ SỰ KIỆN TRÊN TRANG ===
function addPdpListeners() {
    // 1. Logic click ảnh thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail-img');
    const mainImage = document.getElementById('main-product-image');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src; // Thay ảnh chính
        });
    });

    // 2. Logic chọn tùy chọn (Size, Đường, Đá)
    const optionGroups = document.querySelectorAll('.option-buttons');
    const priceElement = document.querySelector('.pdp-price');
    
    // Lấy nút và giá gốc
    const addToCartBtn = document.querySelector('.btn-add-to-cart-pdp');
    let basePrice = 0;
    if (addToCartBtn) {
        basePrice = parseFloat(addToCartBtn.dataset.price);
    }

    optionGroups.forEach(group => {
        group.addEventListener('click', (event) => {
            if (event.target.matches('.option-btn')) {
                // Xóa 'active' cũ, thêm mới
                group.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                // TÍNH GIÁ NẾU CHỌN SIZE
                if (event.target.classList.contains('size-btn')) {
                    const extraPrice = parseFloat(event.target.dataset.extra);
                    const newPrice = basePrice + extraPrice;
                    
                    // Cập nhật hiển thị
                    if (priceElement) priceElement.textContent = `$${newPrice.toFixed(2)}`;
                    // Cập nhật data cho nút
                    if (addToCartBtn) addToCartBtn.dataset.currentPrice = newPrice;
                }
            }
        });
    });
    
    // 3. Logic nút "Thêm vào giỏ"
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (event) => {
            const button = event.target;
            
            let name = button.dataset.name;
            const icon = button.dataset.icon;
            
            // Lấy giá (đã tính size)
            const finalPrice = button.dataset.currentPrice ? parseFloat(button.dataset.currentPrice) : basePrice;

            // Lấy tên Size
            const activeSizeBtn = document.querySelector('.size-btn.active');
            const sizeName = activeSizeBtn ? activeSizeBtn.textContent : 'S';

            // Cập nhật tên sản phẩm
            const finalName = `${name} (Size ${sizeName})`;
            
            addToCart(finalName, finalPrice, icon);
            
            // Hiệu ứng nút
            const originalText = button.textContent;
            button.textContent = 'Đã thêm!';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    }
}


// === 6. KHỞI CHẠY CHÍNH ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Tìm sản phẩm
    const product = findProductById(productId);

    // 3. Render
    if (product) {
        renderProductDetail(product);
        document.title = `${product.name} - Coffee Go!`;
    } else {
        const container = document.getElementById('product-detail-container');
        if (container) {
            container.innerHTML = '<h1 style="text-align:center; margin-top:50px;">404 - Không tìm thấy sản phẩm</h1><p style="text-align:center;">Sản phẩm bạn tìm không tồn tại. <a href="../index.html">Quay về trang chủ</a></p>';
        }
    }

    // 4. Cập nhật huy hiệu giỏ hàng (luôn chạy)
    updateCartBadge();
});