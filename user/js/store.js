// Get store ID from URL
const urlParams = new URLSearchParams(window.location.search);
const storeId = urlParams.get('id');

if (!storeId) {
    window.location.href = 'index.html';
}

// DOM Elements
const storeName = document.getElementById('store-name');
const storeDescription = document.getElementById('store-description');
const storeStatus = document.getElementById('store-status');
const storeProducts = document.getElementById('store-products');

// Functions
async function loadStore() {
    try {
        const [storeResponse, productsResponse] = await Promise.all([
            fetch(`/api/restaurants/${storeId}`),
            fetch(`/api/restaurants/${storeId}/products`)
        ]);
        
        const store = await storeResponse.json();
        const products = await productsResponse.json();
        
        storeName.textContent = store.name;
        storeDescription.textContent = store.description;
        storeStatus.className = `store-status ${store.status ? 'open' : 'closed'}`;
        storeStatus.textContent = store.status ? 'Abierto' : 'Cerrado';
        
        storeProducts.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                    ${!store.status ? 'disabled' : ''}>
                    ${store.status ? 'Agregar al Carrito' : 'Tienda Cerrada'}
                </button>
            </div>
        `).join('');
        
        if (!store.status) {
            storeProducts.insertAdjacentHTML('beforebegin', `
                <div class="store-closed-message">
                    Lo sentimos, esta tienda está cerrada en este momento.
                </div>
            `);
        }
    } catch (error) {
        console.error('Error loading store:', error);
    }
}

function addToCart(product) {
    const cart = getCart();
    
    if (cart.storeId && cart.storeId !== product.storeId) {
        if (!confirm('Tu carrito contiene productos de otro restaurante. ¿Deseas vaciarlo?')) {
            return;
        }
        cart.items = [];
    }
    
    cart.storeId = product.storeId;
    
    const existingItem = cart.items.find(item => item.productId === product.productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ ...product, quantity: 1 });
    }
    
    saveCart(cart);
    alert('Producto agregado al carrito');
}

// Make addToCart available globally
window.addToCart = addToCart;

// Initial load
loadStore();
