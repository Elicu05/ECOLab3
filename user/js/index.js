// DOM Elements
const storesList = document.getElementById('stores-list');

// Functions
async function loadStores() {
    try {
        const response = await fetch('/api/restaurants');
        const stores = await response.json();
        
        storesList.innerHTML = stores.map(store => `
            <div class="store-card" onclick="goToStore(${store.storeId})">
                <h3>${store.name}</h3>
                <p>${store.description}</p>
                <span class="store-status ${store.status ? 'open' : 'closed'}">
                    ${store.status ? 'Abierto' : 'Cerrado'}
                </span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading stores:', error);
    }
}

function goToStore(storeId) {
    window.location.href = `store.html?id=${storeId}`;
}

// Make goToStore available globally
window.goToStore = goToStore;

// Initial load
loadStores();
