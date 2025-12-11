/* === FILE: js/login.js === */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');
    const API_URL = 'http://localhost:3000/users';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            // 1. Tìm user có email và password khớp qua API
            // GET /users?email=...&password=...
            const response = await fetch(`${API_URL}?email=${email}&password=${password}`);
            const usersFound = await response.json();

            if (usersFound.length > 0) {
                // 2. Đăng nhập thành công
                const user = usersFound[0];
                
                // Lưu thông tin phiên đăng nhập vào localStorage (Client-side session)
                localStorage.setItem('currentUser', JSON.stringify(user));

                alert('Đăng nhập thành công! Xin chào ' + user.fullname);

                // 3. Kiểm tra Role để điều hướng
                if (user.role === 'admin') {
                    // Nếu là admin -> Vào trang quản trị
                    // Lưu ý đường dẫn: login.html đang ở view/, admin.html đang ở view/admin/
                    window.location.href = 'admin/admin.html';
                } else {
                    // Nếu là user thường -> Về trang chủ
                    window.location.href = '../index.html';
                }

            } else {
                // 4. Không tìm thấy user -> Báo lỗi
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Email hoặc mật khẩu không đúng!';
            }

        } catch (err) {
            console.error(err);
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.';
        }
    });
});