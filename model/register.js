/* === FILE: js/register.js === */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMsg = document.getElementById('register-error');
    const API_URL = 'http://localhost:3000/users'; // Địa chỉ API users

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 1. Kiểm tra validation cơ bản
        if (password !== confirmPassword) {
            showError('Mật khẩu nhập lại không khớp!');
            return;
        }

        if (password.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            // 2. Kiểm tra email đã tồn tại chưa bằng cách gọi API
            // json-server hỗ trợ lọc: GET /users?email=...
            const checkRes = await fetch(`${API_URL}?email=${email}`);
            const existingUsers = await checkRes.json();

            if (existingUsers.length > 0) {
                showError('Email này đã được sử dụng!');
                return;
            }

            // 3. Tạo user mới với role mặc định là 'user'
            const newUser = {
                fullname: fullname,
                email: email,
                password: password, 
                role: 'user' // Mặc định là khách hàng
            };

            const createRes = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (createRes.ok) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                window.location.href = 'login.html';
            } else {
                showError('Có lỗi xảy ra khi đăng ký.');
            }

        } catch (err) {
            console.error(err);
            showError('Lỗi kết nối đến máy chủ.');
        }
    });

    function showError(message) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = message;
    }
});