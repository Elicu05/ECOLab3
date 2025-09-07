const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role');

if (!userId || role !== 'rider') {
    window.location.href = '/';
}

const riderName = document.getElementById('rider-name');
const availableOrders = document.getElementById('available-orders');
const acceptedOrders = document.getElementById('accepted-orders');
const orderModal = document.getElementById('order-modal');
const orderDetails = document.getElementById('order-details');
const acceptOrderBtn = document.getElementById('accept-order-btn');
const closeModal = document.querySelector('.close');
const logoutBtn = document.getElementById('logout-btn');

let selectedOrder = null;

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});

closeModal.addEventListener('click', () => {
    orderModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
    }
});

acceptOrderBtn.addEventListener('click', async () => {
    if (!selectedOrder) return;
    
    try {
        const response = await fetch(`/api/orders/${selectedOrder.orderId}/accept`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                riderId: parseInt(userId)
            })
        });
        
        if (response.ok) {
            orderModal.style.display = 'none';
            loadOrders();
        } else {
            throw new Error('Error accepting order');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al aceptar el pedido');
    }
});

async function loadRiderInfo() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const rider = orders.find(o => o.riderId === parseInt(userId));
        if (rider) {
            riderName.textContent = `Repartidor #${userId}`;
        }
    } catch (error) {
        console.error('Error loading rider info:', error);
    }
}

async function loadOrders() {
    try {
        const [allOrdersResponse, myOrdersResponse] = await Promise.all([
            fetch('/api/orders'),
            fetch(`/api/riders/${userId}/orders`)
        ]);
        
        const allOrders = await allOrdersResponse.json();
        const myOrders = await myOrdersResponse.json();
        
        // Filter available orders (pending and not assigned)
        const availableOrdersList = allOrders.filter(order => 
            order.status === 'pending' && !order.riderId
        );
        
        // Render available orders
        availableOrders.innerHTML = availableOrdersList.map(order => `
            <div class="order-card" onclick="showOrderDetails(${order.orderId})">
                <div class="order-header">
                    <span class="order-id">Pedido #${order.orderId}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-info">
                    <div>Restaurante #${order.storeId}</div>
                    <div>Cliente #${order.userId}</div>
                </div>
                <div class="order-total">Total: $${order.total}</div>
            </div>
        `).join('');
        
        acceptedOrders.innerHTML = myOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Pedido #${order.orderId}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-info">
                    <div>Restaurante #${order.storeId}</div>
                    <div>Cliente #${order.userId}</div>
                </div>
                <div class="order-total">Total: $${order.total}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function showOrderDetails(orderId) {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const order = orders.find(o => o.orderId === orderId);
        
        if (order) {
            selectedOrder = order;
            
            orderDetails.innerHTML = `
                <div class="detail-group">
                    <div class="detail-label">Pedido #${order.orderId}</div>
                    <div class="detail-value">Estado: ${order.status}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Restaurante</div>
                    <div class="detail-value">ID: ${order.storeId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Cliente</div>
                    <div class="detail-value">ID: ${order.userId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Método de Pago</div>
                    <div class="detail-value">${order.paymentMethod}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Total</div>
                    <div class="detail-value">$${order.total}</div>
                </div>
            `;
            
            acceptOrderBtn.style.display = 'block';
            orderModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading order details:', error);
    }
}

window.showOrderDetails = showOrderDetails;

loadRiderInfo();
loadOrders();

setInterval(loadOrders, 30000);