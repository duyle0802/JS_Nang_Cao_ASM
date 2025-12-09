/* === FILE: js/login.js === */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 1. Lấy danh sách user từ localStorage
        // Nếu chưa có ai đăng ký thì trả về mảng rỗng
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Tìm user có email và password khớp
        const userFound = users.find(u => u.email === email && u.password === password);

        if (userFound) {
            // 3. Nếu tìm thấy -> Lưu thông tin phiên đăng nhập hiện tại
            localStorage.setItem('currentUser', JSON.stringify(userFound));
            
            alert('Đăng nhập thành công! Xin chào ' + userFound.fullname);
            window.location.href = '../index.html'; // Chuyển về trang chủ
        } else {
            // 4. Nếu không thấy -> Báo lỗi
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Email hoặc mật khẩu không đúng!';
        }
    });
});