/**
 * Bakery - Customer page: menu, cart, billing, pay, print
 */

const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const cartItemCount = document.getElementById('cartItemCount');
const btnPay = document.getElementById('btnPay');
const btnPrint = document.getElementById('btnPrint');
const btnClear = document.getElementById('btnClear');
const payModal = document.getElementById('payModal');
const modalClose = document.getElementById('modalClose');
const qrImage = document.getElementById('qrImage');
const upiText = document.getElementById('upiText');
const printBill = document.getElementById('printBill');
const printDate = document.getElementById('printDate');
const printBody = document.getElementById('printBody');
const printTotal = document.getElementById('printTotal');

let cart = [];

function renderMenu() {
  const menu = getMenu();
  menuGrid.innerHTML = '';
  menu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${item.name}">
      <div class="menu-card-info">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-price">₹${item.price}</div>
      </div>
    `;
    card.addEventListener('click', () => addToCart(item));
    menuGrid.appendChild(card);
  });
}

function addToCart(item) {
  const existing = cart.find(c => c.menuItemId === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }
  setCart(cart);
  updateCartUI();
  
  // Expand cart on mobile when item added
  if (window.expandCartOnMobile) {
    window.expandCartOnMobile();
  }
}

function removeFromCart(menuItemId) {
  cart = cart.filter(c => c.menuItemId !== menuItemId);
  setCart(cart);
  updateCartUI();
}

function updateQuantity(menuItemId, delta) {
  const item = cart.find(c => c.menuItemId === menuItemId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(menuItemId);
  } else {
    setCart(cart);
    updateCartUI();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
  const total = getCartTotal();
  const count = getCartItemCount();

  cartBadge.textContent = count;
  cartItemCount.textContent = `(${count} items)`;
  cartTotal.textContent = `Total: ₹${total}`;
  btnPay.disabled = count === 0;
  btnPrint.disabled = count === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Cart is empty. Click any item to add.</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.menuItemId}">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-qty">
        <button type="button" style="border:none;background:none;cursor:pointer;font-size:1rem;padding:0 4px;" aria-label="Decrease">−</button>
        ${item.quantity}
        <button type="button" style="border:none;background:none;cursor:pointer;font-size:1rem;padding:0 4px;" aria-label="Increase">+</button>
      </span>
      <span class="cart-item-price">₹${item.price * item.quantity}</span>
    </div>
  `).join('');

  cartItems.querySelectorAll('.cart-item').forEach(row => {
    const id = row.dataset.id;
    const [decBtn, incBtn] = row.querySelectorAll('button');
    decBtn.addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(id, -1); });
    incBtn.addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(id, 1); });
  });
}

function clearCart() {
  cart = [];
  setCart(cart);
  updateCartUI();
}

function openPayModal() {
  const settings = getSettings();
  const total = getCartTotal();

  if (settings.qrImageUrl) {
    qrImage.src = settings.qrImageUrl;
    qrImage.style.display = '';
    upiText.textContent = `Scan to pay ₹${total}`;
  } else if (settings.upiId) {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=Fresh+Bake&am=${total}`;
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    qrImage.style.display = '';
    upiText.textContent = `Pay ₹${total} to ${settings.upiId}`;
  } else {
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('Configure UPI in Admin settings')}`;
    qrImage.style.display = '';
    qrImage.alt = 'Configure payment in Admin';
    upiText.textContent = 'Configure UPI ID in Admin → Settings';
  }

  payModal.classList.add('active');
}

function closePayModal() {
  payModal.classList.remove('active');
}

function confirmAndCloseModal() {
  if (cart.length > 0) {
    const order = {
      id: generateId(),
      items: [...cart],
      total: getCartTotal(),
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now()
    };
    addOrder(order);
    clearCart();
  }
  closePayModal();
}

function printBillFn() {
  const total = getCartTotal();
  printDate.textContent = `Date: ${new Date().toLocaleString()}`;
  printBody.innerHTML = cart.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
      <td>₹${item.price * item.quantity}</td>
    </tr>
  `).join('');
  printTotal.textContent = `Total: ₹${total}`;

  window.print();
}

function setupMobileCart() {
  const cartPanel = document.querySelector('.cart-panel');
  const cartHeader = cartPanel.querySelector('h2');
  
  cartHeader.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      cartPanel.classList.toggle('expanded');
    }
  });

  // Auto-expand when adding items on mobile
  window.expandCartOnMobile = function() {
    if (window.innerWidth <= 768) {
      cartPanel.classList.add('expanded');
    }
  };
}

function init() {
  cart = getCart();
  renderMenu();
  updateCartUI();
  setupMobileCart();

  btnClear.addEventListener('click', clearCart);
  btnPay.addEventListener('click', openPayModal);
  btnPrint.addEventListener('click', printBillFn);
  modalClose.addEventListener('click', confirmAndCloseModal);
  payModal.addEventListener('click', (e) => {
    if (e.target === payModal) closePayModal();
  });
}

init();
