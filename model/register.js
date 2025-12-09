/* === FILE: js/register.js === */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMsg = document.getElementById('register-error');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 1. Kiểm tra mật khẩu nhập lại
        if (password !== confirmPassword) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Mật khẩu nhập lại không khớp!';
            return;
        }

        if (password.length < 6) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
            return;
        }

        // 2. Lấy danh sách user hiện có
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 3. Kiểm tra email đã tồn tại chưa
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Email này đã được sử dụng!';
            return;
        }

        // 4. Tạo user mới và lưu vào mảng
        const newUser = {
            fullname: fullname,
            email: email,
            password: password // Lưu ý: Thực tế không nên lưu password thô thế này, nhưng bài tập thì OK
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = 'login.html';
    });
});