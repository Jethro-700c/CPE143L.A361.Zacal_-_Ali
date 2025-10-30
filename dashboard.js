const foodList = document.getElementById("food-list");
const selectedCount = document.getElementById("selected-count");

let selectedItems = [];
let currentCategory = "food";

// Example data
const menuItems = {
  food: [
    { name: "Carbonara", img: "images/Carbonara.svg" },
    { name: "Pizza", img: "images/Pizza.svg" },
    { name: "Spaghetti", img: "images/Spaghetti.svg" },
  ],
  drink: [
    { name: "Iced Tea", img: "images/icedtea.svg" },
    { name: "Coke", img: "images/coke.svg" },
    { name: "Water", img: "images/water.svg" },
  ],
  dessert: [
    { name: "Cake", img: "images/cake.svg" },
    { name: "Brownie", img: "images/brownie.svg" },
    { name: "Ice Cream", img: "images/icecream.svg" },
  ],
  additional: [
    { name: "Fries", img: "images/fries.svg" },
    { name: "Garlic Bread", img: "images/garlicbread.svg" },
    { name: "Salad", img: "images/salad.svg" },
  ],
};

function showCategory(category) {
  currentCategory = category;
  foodList.innerHTML = "";

  menuItems[category].forEach((item) => {
    const existing = selectedItems.find((i) => i.name === item.name);
    const qty = existing ? existing.quantity : 0;

    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <div class="quantity-control">
        <button onclick="changeQuantity('${item.name}', -1)">–</button>
        <span id="qty-${item.name}">${qty}</span>
        <button onclick="changeQuantity('${item.name}', 1)">+</button>
      </div>
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <button onclick="toggleSelect('${item.name}', this)">Select</button>
    `;
    foodList.appendChild(div);
  });
}

function changeQuantity(name, amount) {
  const item = selectedItems.find((i) => i.name === name);

  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      selectedItems = selectedItems.filter((i) => i.name !== name);
    }
  } else if (amount > 0) {
    selectedItems.push({ name, quantity: amount });
  }

  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.textContent = selectedItems.find((i) => i.name === name)?.quantity || 0;

  updateSelectedCount();
}

function toggleSelect(name, btn) {
  const item = selectedItems.find((i) => i.name === name);

  if (item) {
    selectedItems = selectedItems.filter((i) => i.name !== name);
    btn.classList.remove("selected");
    btn.textContent = "Select";
  } else {
    selectedItems.push({ name, quantity: 1 });
    btn.classList.add("selected");
    btn.textContent = "Selected";
  }

  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.textContent = selectedItems.find((i) => i.name === name)?.quantity || 0;

  updateSelectedCount();
}

function updateSelectedCount() {
  const total = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  selectedCount.textContent = `Selected items: ${total}`;
}

function addSelected() {
  if (selectedItems.length === 0) {
    alert("Please select at least one item!");
    return;
  }

  const summary = selectedItems.map(i => `${i.name} ×${i.quantity}`).join(", ");
  alert(`You added:\n${summary}`);

  selectedItems = [];
  updateSelectedCount();
  showCategory(currentCategory);
}

// Initialize
showCategory("food");


function resetSelection() {
  selectedItems = [];
  updateSelectedCount();
  showCategory(currentCategory);
}

function logout() {
  window.location.href = "login.html";
}