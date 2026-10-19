// ============================================
//  PawsWorld Pet Store - app.js
// ============================================

// ---- PET DATA ----
const PETS = [
  { id: 1,  name: "Buddy",    breed: "Golden Retriever", category: "dog",    emoji: "🐕", price: 850,  tags: ["Friendly", "Playful", "Family"] },
  { id: 2,  name: "Luna",     breed: "Siberian Husky",   category: "dog",    emoji: "🐺", price: 1200, tags: ["Energetic", "Loyal", "Smart"] },
  { id: 3,  name: "Whiskers", breed: "Persian Cat",      category: "cat",    emoji: "😺", price: 600,  tags: ["Calm", "Cuddly", "Indoor"] },
  { id: 4,  name: "Shadow",   breed: "British Shorthair",category: "cat",    emoji: "🐱", price: 750,  tags: ["Quiet", "Gentle", "Independent"] },
  { id: 5,  name: "Tweety",   breed: "Canary",           category: "bird",   emoji: "🐦", price: 120,  tags: ["Singer", "Colorful", "Easy Care"] },
  { id: 6,  name: "Polly",    breed: "African Grey",     category: "bird",   emoji: "🦜", price: 980,  tags: ["Talking", "Smart", "Rare"] },
  { id: 7,  name: "Cotton",   breed: "Holland Lop",      category: "rabbit", emoji: "🐇", price: 200,  tags: ["Fluffy", "Gentle", "Quiet"] },
  { id: 8,  name: "Caramel",  breed: "Rex Rabbit",       category: "rabbit", emoji: "🐰", price: 180,  tags: ["Soft", "Active", "Social"] },
  { id: 9,  name: "Max",      breed: "German Shepherd",  category: "dog",    emoji: "🦮", price: 1100, tags: ["Guard", "Smart", "Athletic"] },
  { id: 10, name: "Cleo",     breed: "Ragdoll Cat",      category: "cat",    emoji: "😸", price: 900,  tags: ["Floppy", "Docile", "Blue Eyes"] },
  { id: 11, name: "Rio",      breed: "Macaw Parrot",     category: "bird",   emoji: "🦚", price: 1500, tags: ["Colorful", "Loud", "Long Life"] },
  { id: 12, name: "Snowball",  breed: "Angora Rabbit",   category: "rabbit", emoji: "🐾", price: 220,  tags: ["Fluffy", "Long Fur", "Gentle"] },
];

// ---- STATE ----
let cart = JSON.parse(localStorage.getItem('pawsworld_cart') || '[]');
let activeFilter = 'all';
let searchQuery = '';

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderPets();
  renderCart();
  updateCartBadge();
  setupEventListeners();
  setNavActive();
});

// ---- SETUP EVENT LISTENERS ----
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPets();
    });
  });

  // Search input
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderPets();
  });

  // Nav active on scroll
  window.addEventListener('scroll', setNavActive);
}

// ---- RENDER PETS ----
function renderPets() {
  const grid = document.getElementById('pets-grid');
  const noResults = document.getElementById('no-results');

  let filtered = PETS.filter(pet => {
    const matchesFilter = activeFilter === 'all' || pet.category === activeFilter;
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery) ||
                          pet.breed.toLowerCase().includes(searchQuery) ||
                          pet.category.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  grid.innerHTML = filtered.map((pet, index) => {
    const inCart = cart.some(item => item.id === pet.id);
    return `
      <div class="pet-card" style="animation-delay: ${index * 0.06}s" id="pet-card-${pet.id}">
        <span class="pet-emoji">${pet.emoji}</span>
        <span class="pet-category">${pet.category}</span>
        <div class="pet-name">${pet.name}</div>
        <div class="pet-breed">${pet.breed}</div>
        <div class="pet-tags">
          ${pet.tags.map(tag => `<span class="pet-tag">${tag}</span>`).join('')}
        </div>
        <div class="pet-footer">
          <span class="pet-price">$${pet.price}</span>
          <button
            class="add-cart-btn ${inCart ? 'added' : ''}"
            id="add-btn-${pet.id}"
            onclick="addToCart(${pet.id})"
            ${inCart ? 'disabled' : ''}
          >
            ${inCart ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ---- ADD TO CART ----
function addToCart(petId) {
  const pet = PETS.find(p => p.id === petId);
  if (!pet) return;

  if (cart.some(item => item.id === petId)) {
    showToast(`${pet.name} is already in your cart! 🛒`);
    return;
  }

  cart.push(pet);
  saveCart();
  renderPets();
  renderCart();
  updateCartBadge();
  showToast(`${pet.emoji} ${pet.name} added to cart!`);
}

// ---- REMOVE FROM CART ----
function removeFromCart(petId) {
  const pet = cart.find(p => p.id === petId);
  cart = cart.filter(p => p.id !== petId);
  saveCart();
  renderPets();
  renderCart();
  updateCartBadge();
  if (pet) showToast(`${pet.name} removed from cart.`);
}

// ---- CLEAR CART ----
function clearCart() {
  if (cart.length === 0) { showToast('Your cart is already empty!'); return; }
  cart = [];
  saveCart();
  renderPets();
  renderCart();
  updateCartBadge();
  showToast('Cart cleared! 🗑️');
}

// ---- CHECKOUT ----
function checkout() {
  if (cart.length === 0) {
    showToast('Add some pets first! 🐾');
    return;
  }
  const names = cart.map(p => p.name).join(', ');
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  alert(`🎉 Order Placed!\n\nPets: ${names}\nTotal: $${total}\n\nThank you for choosing PawsWorld! Your furry friends will arrive soon. 🐾`);
  clearCart();
}

// ---- RENDER CART ----
function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    subtotalEl.textContent = '$0';
    totalEl.textContent = '$0';
    return;
  }

  emptyEl.style.display = 'none';

  const itemsHTML = cart.map(pet => `
    <div class="cart-item" id="cart-item-${pet.id}">
      <span class="cart-item-emoji">${pet.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${pet.name}</div>
        <div class="cart-item-breed">${pet.breed}</div>
      </div>
      <span class="cart-item-price">$${pet.price}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${pet.id})">Remove</button>
    </div>
  `).join('');

  cartItemsEl.innerHTML = itemsHTML;

  const subtotal = cart.reduce((sum, p) => sum + p.price, 0);
  subtotalEl.textContent = `$${subtotal}`;
  totalEl.textContent = `$${subtotal}`;
}

// ---- UPDATE CART BADGE ----
function updateCartBadge() {
  document.getElementById('cart-count').textContent = cart.length;
}

// ---- SAVE CART TO LOCAL STORAGE ----
function saveCart() {
  localStorage.setItem('pawsworld_cart', JSON.stringify(cart));
}

// ---- TOAST NOTIFICATION ----
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- NAV ACTIVE STATE ON SCROLL ----
function setNavActive() {
  const sections = ['home', 'pets', 'cart', 'about'];
  const links = document.querySelectorAll('.nav-link');

  let currentSection = 'home';
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100) currentSection = id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}
