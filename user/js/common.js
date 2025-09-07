// Auth check
const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role');

if (!userId || role !== 'user') {
    window.location.href = '/';
}

// Common DOM Elements
const cartCount = document.getElementById('cart-count');
const logoutBtn = document.getElementById('logout-btn');

// Event Listeners
logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});

// Cart functions
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [], storeId: null };
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Initial cart count
updateCartCount();
