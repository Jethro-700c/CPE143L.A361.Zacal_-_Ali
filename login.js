document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorEl = document.getElementById('error');

    if (!loginForm) return; // nothing to do on other pages

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = usernameInput ? usernameInput.value.trim() : '';
        const pass = passwordInput ? passwordInput.value.trim() : '';

        // Basic client-side validation
        if (!user || !pass) {
            if (errorEl) errorEl.textContent = 'Please enter both username and password.';
            return;
        }

        // Demo credentials (replace with real auth)
        if (user === 'admin1' && pass === 'admin123') {
            // Go to admin page
            window.location.href = 'adminpage.html';
            return;
        }

        if (user === 'c' && pass === '123') {
            // Go to customer main page
            window.location.href = 'MainPage.html';
            return;
        }

        // Default failure
        if (errorEl) errorEl.textContent = 'Invalid username or password.';
    });
});
