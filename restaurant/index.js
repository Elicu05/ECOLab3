const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role');
const storeId = localStorage.getItem('storeId');

if (!userId || role !== 'store' || !storeId) {
    window.location.href = '/';
}

const storeName = document.getElementById('store-name');
const statusToggle = document.getElementById('status-toggle');
const statusText = document.getElementById('status-text');
const productsList = document.getElementById('products-list');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const closeModal = document.querySelector('.close');
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});

statusToggle.addEventListener('change', async () => {
    try {
        const response = await fetch(`/api/restaurants/${storeId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: statusToggle.checked
            })
        });
        
        if (response.ok) {
            updateStatusText(statusToggle.checked);
        } else {
            throw new Error('Error updating store status');
        }
    } catch (error) {
        console.error('Error:', error);
        statusToggle.checked = !statusToggle.checked;
        alert('Error al actualizar el estado del restaurante');
    }
});

addProductBtn.addEventListener('click', () => {
    productForm.reset();
    productModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        image: document.getElementById('product-image').value || ' '
    };
    
    try {
        const response = await fetch(`/api/restaurants/${storeId}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            productModal.style.display = 'none';
            loadProducts();
        } else {
            throw new Error('Error creating product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el producto');
    }
});

function updateStatusText(status) {
    statusText.textContent = status ? 'Abierto' : 'Cerrado';
    statusText.className = status ? 'status-open' : 'status-closed';
}

async function loadStoreInfo() {
    try {
        const response = await fetch(`/api/restaurants/${storeId}`);
        const store = await response.json();
        
        storeName.textContent = store.name;
        statusToggle.checked = store.status;
        updateStatusText(store.status);
    } catch (error) {
        console.error('Error loading store info:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`/api/restaurants/${storeId}/products`);
        const products = await response.json();
        
        productsList.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

loadStoreInfo();
loadProducts();