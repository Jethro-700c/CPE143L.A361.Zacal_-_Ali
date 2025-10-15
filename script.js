const loginPage = document.getElementById('login-page');
const adminPage = document.getElementById('admin-page');
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
        window.location.href = "adminpage.html";
    } else if (user === "c" && pass === "123") {
        window.location.href = "MainPage.html";
    } else if (error) {
        error.textContent = "Invalid username or password.";
    }
}

function logout() {
    if (adminPage) adminPage.classList.add('hidden');
    if (customerPage) customerPage.classList.add('hidden');
    if (loginPage) loginPage.classList.remove('hidden');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const error = document.getElementById('error');

    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
    if (error) error.textContent = "";

    cart = [];
    if (cartDiv) cartDiv.innerHTML = "";
    if (receiptDiv) receiptDiv.innerHTML = "";
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
