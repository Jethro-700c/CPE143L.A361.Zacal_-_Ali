<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mint Login System</title>
<style>
    :root {
        --mint: #a8edea;
        --mint-dark: #4ad66d;
        --mint-light: #d4f8e8;
        --text-dark: #036666;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(to right, var(--mint), #b8f3e1);
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        transition: 0.3s ease;
    }

    .container, .dashboard {
        background: var(--mint-light);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        width: 90%;
        max-width: 400px;
        text-align: center;
        transition: all 0.3s ease;
    }

    h2 {
        color: var(--text-dark);
        margin-bottom: 15px;
    }

    input[type="text"], input[type="password"] {
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border-radius: 10px;
        border: 1px solid #99e2b4;
        outline: none;
        font-size: 15px;
    }

    label {
        color: #028174;
        font-weight: 500;
        font-size: 14px;
    }

    button {
        background-color: var(--mint-dark);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 15px;
        transition: 0.3s;
        margin: 5px;
    }

    button:hover {
        background-color: #34a853;
    }

    .hidden {
        display: none;
    }

    .dashboard {
        width: 95%;
        max-width: 800px;
    }

    .section {
        background: #b9fbc0;
        padding: 15px;
        margin: 10px;
        border-radius: 10px;
        text-align: left;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 15px;
    }

    .product {
        background: #c8fcea;
        border-radius: 10px;
        padding: 10px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .product img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .cart-item {
        background: #b9fbc0;
        padding: 8px;
        border-radius: 10px;
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .receipt {
        background: #e3fced;
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
    }

    #error {
        color: red;
        font-size: 14px;
        height: 18px;
    }

    @media (max-width: 600px) {
        body {
            padding: 20px;
            height: auto;
        }

        .container, .dashboard {
            width: 100%;
            padding: 20px;
        }

        .product, .cart-item {
            flex-direction: column;
            align-items: flex-start;
        }

        button {
            width: 100%;
            margin-top: 10px;
        }
    }
</style>
</head>
<body>

<!-- Login Page -->
<div class="container" id="login-page">
    <h2>Login</h2>
    <input type="text" id="username" placeholder="Username"><br>
    <input type="password" id="password" placeholder="Password"><br>
    <label><input type="checkbox" id="showPass"> Show Password</label><br><br>
    <button onclick="login()">Login</button>
    <p id="error"></p>
</div>

<!-- Admin Dashboard -->
<div class="dashboard hidden" id="admin-page">
    <h2>Admin Dashboard</h2>
    <div class="section"><h3>Sales</h3><p>₱35,000 (This Month)</p></div>
    <div class="section"><h3>Inventory</h3><p>Spaghetti: 25 pcs<br>Carbonara: 30 pcs<br>Pizza: 40 pcs</p></div>
    <div class="section"><h3>Transaction History</h3><p>Customer 1 - ₱350<br>Customer 2 - ₱500</p></div>
    <button onclick="logout()">Logout</button>
</div>

<!-- Customer Page -->
<div class="dashboard hidden" id="customer-page">
    <h2>Welcome, Customer 👋</h2>
    <div class="section">
        <h3>Available Products</h3>
        <div class="products-grid">
            <div class="product">
                <img src="Carbonara.jpg" alt="Carbonara">
                <h4>Carbonara</h4>
                <p>₱140</p>
                <button onclick="addToCart('Carbonara', 140)">Add to Cart</button>
            </div>
            <div class="product">
                <img src="Spaghetti Bolognese.jpg" alt="Spaghetti Bolognese">
                <h4>Pizza Bolognese</h4>
                <p>₱200</p>
                <button onclick="addToCart('Spaghetti Bolognese', 200)">Add to Cart</button>
            </div>
            <div class="product">
                <img src="Pizza.jpg" alt="Pizza">
                <h4>Pizza</h4>
                <p>₱180</p>
                <button onclick="addToCart('Pizza', 180)">Add to Cart</button>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>🛒 Cart</h3>
        <div id="cart"></div>
        <button onclick="checkout()">Checkout</button>
    </div>

    <div class="section">
        <h3>🧾 Receipt</h3>
        <div id="receipt"></div>
    </div>
    <button onclick="logout()">Logout</button>
</div>

<script>
    const loginPage = document.getElementById('login-page');
    const adminPage = document.getElementById('admin-page');
    const customerPage = document.getElementById('customer-page');
    const showPass = document.getElementById('showPass');
    const cartDiv = document.getElementById('cart');
    const receiptDiv = document.getElementById('receipt');
    let cart = [];

    showPass.addEventListener('change', () => {
        const passwordInput = document.getElementById('password');
        passwordInput.type = showPass.checked ? 'text' : 'password';
    });

    function login() {
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        const error = document.getElementById('error');

        if (user === "admin1" && pass === "admin123") {
            loginPage.classList.add('hidden');
            adminPage.classList.remove('hidden');
        } else if (user === "customer" && pass === "MeCustomer") {
            loginPage.classList.add('hidden');
            customerPage.classList.remove('hidden');
        } else {
            error.textContent = "Invalid username or password.";
        }
    }

    function logout() {
        adminPage.classList.add('hidden');
        customerPage.classList.add('hidden');
        loginPage.classList.remove('hidden');
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        document.getElementById('error').textContent = "";
        cart = [];
        cartDiv.innerHTML = "";
        receiptDiv.innerHTML = "";
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
</script>

</body>
</html>

