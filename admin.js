function logout() {
    alert("Logging out...");
    window.location.href = "login.html"; // redirect to login page
}

document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const qty = document.getElementById('itemQty').value;

    const confirmation = document.getElementById('confirmation');
    confirmation.textContent = `✅ ${name} (${qty}) added successfully!`;

    document.getElementById('itemName').value = '';
    document.getElementById('itemQty').value = '';
});
