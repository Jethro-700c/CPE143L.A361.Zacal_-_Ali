const loginPage = document.getElementById('login-page');
const customerPage = document.getElementById('customer-page');
const showPass = document.getElementById('showPass');
const cartDiv = document.getElementById('cart');
const receiptDiv = document.getElementById('receipt');
let cart = [];


function login() {
    const user = document.getElementById('username')?.value.trim();
    const pass = document.getElementById('password')?.value.trim();
    const error = document.getElementById('error');

    if (user === "admin1" && pass === "admin123") {
        alert("Admin login successful!");
        // You can redirect to admin page if you have one
        window.location.href = "adminpage.html";
    } else if (user === "c" && pass === "123") {
        loginPage.classList.add('hidden');
        customerPage.classList.remove('hidden');
    } else {
        error.textContent = "Invalid username or password.";
    }
}

function logout() {
    // Clear any stored session data (if used)
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}

    // Try to reset SPA-style UI if those elements exist
    const adminPage = document.getElementById('admin-page');
    const customerPageEl = document.getElementById('customer-page');
    const loginPageEl = document.getElementById('login-page');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const error = document.getElementById('error');

    if (adminPage || customerPageEl || loginPageEl) {
        if (adminPage) adminPage.classList.add('hidden');
        if (customerPageEl) customerPageEl.classList.add('hidden');
        if (loginPageEl) loginPageEl.classList.remove('hidden');

        if (usernameInput) usernameInput.value = "";
        if (passwordInput) passwordInput.value = "";
        if (error) error.textContent = "";

        cart = [];
        if (cartDiv) cartDiv.innerHTML = "";
        if (receiptDiv) receiptDiv.innerHTML = "";

        // If this is a full-page admin view, redirect back to login to be safe
        if (adminPage && !loginPageEl) {
            window.location.href = 'login.html';
        }
        return;
    }

    // Default: redirect the browser back to login page
    window.location.href = 'login.html';
}

function addToCart(product, price) {
    cart.push({ product, price });
    displayCart();
}

function displayCart() {
    cartDiv.innerHTML = "";
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `${item.product} - ₱${item.price} <button onclick="removeItem(${index})">Remove</button>`;
        cartDiv.appendChild(div);
    });
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
    let receiptHTML = "<h4>Receipt</h4><ul>";
    cart.forEach(item => {
        receiptHTML += `<li>${item.product} - ₱${item.price}</li>`;
        total += item.price;
    });
    receiptHTML += `</ul><strong>Total: ₱${total}</strong>`;
    receiptDiv.innerHTML = receiptHTML;
    cart = [];
    cartDiv.innerHTML = "";
}

function showRegister() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');

}

function register() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const error = document.getElementById('reg-error');

    if (!username || !password || !confirmPassword) {
        error.textContent = 'Please fill out all fields.';
        return;
    }

    if (password !== confirmPassword) {
        error.textContent = 'Passwords do not match.';
        return;
    }

    error.textContent = '';
    alert('Registration successful!');
    showLogin(); 
}


