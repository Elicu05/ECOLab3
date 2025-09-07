const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentMethod = document.getElementById('payment-method');

function updateCart() {
    const cart = getCart();
    
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-quantity">${item.quantity}</span>
            </div>
        </div>
    `).join('');
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total}`;
    
    checkoutBtn.disabled = cart.items.length === 0;
}

function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    
    if (newQuantity <= 0) {
        cart.items = cart.items.filter(item => item.productId !== productId);
        if (cart.items.length === 0) {
            cart.storeId = null;
        }
    }
    
    saveCart(cart);
    updateCart();
}

checkoutBtn.addEventListener('click', async () => {

    const cart = getCart();

    try {
        const storeResponse = await fetch(`/api/restaurants/${cart.storeId}`);
        const store = await storeResponse.json();
        
        if (!store.status) {
            alert('Lo sentimos, la tienda está cerrada en este momento. No se puede procesar el pedido.');
            return;
        }
        
        const order = {
            userId: parseInt(userId),
            storeId: cart.storeId,
            products: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            total: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            paymentMethod: paymentMethod.value
        };
        
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        if (response.ok) {
            saveCart({ items: [], storeId: null });
            updateCart();
            alert('Pedido realizado con éxito');
            window.location.href = 'orders.html';
        } else {
            throw new Error('Error al crear el pedido');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Error al crear el pedido');
    }
});

window.updateQuantity = updateQuantity;

updateCart();
