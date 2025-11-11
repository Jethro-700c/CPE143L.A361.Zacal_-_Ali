const defaultMenuItems = {
  food: [
    { name: "Carbonara", price: 180 },
    { name: "Pizza", price: 250 },
    { name: "Spaghetti", price: 160 },
  ],
  drink: [
    { name: "Iced Tea", price: 40 },
    { name: "Coke", price: 50 },
    { name: "Water", price: 20 },
  ],
  dessert: [
    { name: "Cake", price: 90 },
    { name: "Brownie", price: 70 },
    { name: "Ice Cream", price: 60 },
  ],
  additional: [
    { name: "Fries", price: 60 },
    { name: "Garlic Bread", price: 55 },
    { name: "Salad", price: 75 },
  ],
};

function renderInventoryTable() {
  const menuItems = defaultMenuItems;
  const allItems = [];
  Object.keys(menuItems).forEach(cat => {
    menuItems[cat].forEach(item => {
      allItems.push(item.name);
    });
  });
  const tbody = document.querySelector('#inventoryTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  allItems.forEach(name => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${name}</td>
            <td><input type="number" min="0" name="${name}" value="0" style="width:80px"></td>
            <td><button type="button" class="reset-btn" data-name="${name}">Reset</button></td>
        `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const name = this.getAttribute('data-name');
      const input = tbody.querySelector(`input[name='${name}']`);
      if (input) input.value = 0;
    });
  });
}

function renderPriceTable() {
  const menuItems = defaultMenuItems;
  const tbody = document.querySelector('#priceTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.keys(menuItems).forEach(category => {
    menuItems[category].forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
                <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>${item.name}</td>
                <td><input type="number" min="1" name="${category}|${item.name}" value="${item.price}" required style="width:80px"></td>
                <td><button type="button" class="delete-btn" data-cat="${category}" data-name="${item.name}">Delete</button></td>
            `;
      tbody.appendChild(tr);
    });
  });
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const cat = this.getAttribute('data-cat');
      const name = this.getAttribute('data-name');
      if (confirm(`Delete ${name} from ${cat}?`)) {
        deleteMenuItem(cat, name);
      }
    });
  });
}

function deleteMenuItem(category, name) {
  const menuItems = defaultMenuItems;
  menuItems[category] = menuItems[category].filter(item => item.name !== name);
  renderPriceTable();
  renderInventoryTable();
  const conf = document.getElementById('priceConfirmation');
  if (conf) conf.textContent = `${name} deleted!`;
}

function initAdminPage() {
  renderPriceTable();
  renderInventoryTable();
  const priceForm = document.getElementById('priceForm');
  if (priceForm) {
    priceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      for (const [key, value] of formData.entries()) {
        const [cat, name] = key.split('|');
        const item = defaultMenuItems[cat].find(i => i.name === name);
        if (item) item.price = parseInt(value, 10);
      }
      const conf = document.getElementById('priceConfirmation');
      if (conf) conf.textContent = 'Prices updated!';
    });
  }
  const inventoryForm = document.getElementById('inventoryForm');
  if (inventoryForm) {
    inventoryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const msg = document.getElementById('inventoryMsg');
      if (msg) msg.textContent = 'Inventory updated!';
    });
  }
  const addMenuItemForm = document.getElementById('addMenuItemForm');
  if (addMenuItemForm) {
    addMenuItemForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const cat = document.getElementById('newItemCategory').value;
      const name = document.getElementById('newItemName').value.trim();
      const price = parseInt(document.getElementById('newItemPrice').value, 10);
      const img = document.getElementById('newItemImg').value.trim();
      const msg = document.getElementById('addItemMsg');
      if (!cat || !name || !price || price < 1 || !img) {
        msg.textContent = 'Please fill out all fields.';
        return;
      }
      const menuItems = defaultMenuItems;
      if (menuItems[cat].some(i => i.name.toLowerCase() === name.toLowerCase())) {
        msg.textContent = 'Item already exists in this category!';
        return;
      }
      menuItems[cat].push({ name, price, img });
      renderPriceTable();
      renderInventoryTable();
      msg.textContent = `Added ${name} to ${cat}!`;
      this.reset();
    });
  }
  window.deleteMenuItem = deleteMenuItem;
}

if (window.location.pathname.endsWith('adminpage.html')) {
  document.addEventListener('DOMContentLoaded', initAdminPage);
}

const foodList = document.getElementById("food-list");
const selectedCount = document.getElementById("selected-count");

let selectedItems = [];
let currentCategory = "food";

function getMenuItemsWithImages() {
  return defaultMenuItems;
}

const menuItems = getMenuItemsWithImages();

function showCategory(category) {
  currentCategory = category;
  if (!foodList) return;
  foodList.innerHTML = "";

  menuItems[category].forEach((item) => {
    const existing = selectedItems.find((i) => i.name === item.name);
    const qty = existing ? existing.quantity : 0;

    const inventory = 999; 

    const div = document.createElement("div");
    div.classList.add("product");
    if (inventory <= 0) {
      div.innerHTML = `
                <div class="quantity-control out-of-stock">
                    <span>Out of stock</span>
                </div>
                <img src="${item.img}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p class="price">₱${item.price}</p>
                <button disabled style="opacity:0.5;cursor:not-allowed;">Select</button>
            `;
    } else {
      div.innerHTML = `
                <div class="quantity-control">
                    <button onclick="changeQuantity('${item.name}', -1)">–</button>
                    <span id="qty-${item.name}">${qty}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
                <img src="${item.img}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p class="price">₱${item.price}</p>
                <button onclick="toggleSelect('${item.name}', this)">Select</button>
            `;
    }
    foodList.appendChild(div);
  });
}

function changeQuantity(name, amount) {
  const inventory = 999; 

  const item = selectedItems.find((i) => i.name === name);

  if (item) {
    if (amount > 0 && item.quantity + amount > inventory) {
      alert('Not enough stock!');
      return;
    }
    item.quantity += amount;
    if (item.quantity <= 0) {
      selectedItems = selectedItems.filter((i) => i.name !== name);
    }
  } else if (amount > 0) {
    if (inventory < amount) {
      alert('Not enough stock!');
      return;
    }
    selectedItems.push({ name, quantity: amount });
  }

  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.textContent = selectedItems.find((i) => i.name === name)?.quantity || 0;

  updateSelectedCount();
}

function toggleSelect(name, btn) {
  const inventory = 999; 

  const item = selectedItems.find((i) => i.name === name);

  if (item) {
    selectedItems = selectedItems.filter((i) => i.name !== name);
    btn.classList.remove("selected");
    btn.textContent = "Select";
  } else {
    if (inventory < 1) {
      alert('Not enough stock!');
      return;
    }
    selectedItems.push({ name, quantity: 1 });
    btn.classList.add("selected");
    btn.textContent = "Selected";
  }

  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.textContent = selectedItems.find((i) => i.name === name)?.quantity || 0;

  updateSelectedCount();
}

function updateSelectedCount() {
  if (!selectedCount) return;
  const total = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  selectedCount.textContent = `Selected items: ${total}`;
}

function addSelected() {
  if (selectedItems.length === 0) {
    alert("Please select at least one item!");
    return;
  }

  let total = 0;
  const summary = selectedItems.map(i => {
    let price = 0;
    for (const cat in menuItems) {
      const found = menuItems[cat].find(item => item.name === i.name);
      if (found) { price = found.price; break; }
    }
    total += price * i.quantity;
    return `${i.name} ×${i.quantity} (₱${price * i.quantity})`;
  }).join(", ");
  alert(`You added:\n${summary}\nTotal: ₱${total}`);

  selectedItems = [];
  updateSelectedCount();
  showCategory(currentCategory);
}

function resetSelection() {
  selectedItems = [];
  updateSelectedCount();
  showCategory(currentCategory);
}

if (foodList && selectedCount) {
  showCategory("food");
}