// DOM Elements
const ordersList = document.getElementById('orders-list');

// Functions
async function loadOrders() {
    try {
        const response = await fetch(`/api/users/${userId}/orders`);
        const orders = await response.json();
        
        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Pedido #${order.orderId}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-total">Total: $${order.total}</div>
                <div class="order-payment">Pago: ${order.paymentMethod}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Initial load
loadOrders();
