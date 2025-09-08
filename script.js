// ... (tout votre code JS existant jusqu'à DOMContentLoaded) ...

// --- DEBUT : Logique de la Bibliothèque de Produits ---
let products = [];

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    renderProducts();
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'list-item text-sm';
        item.innerHTML = `
            <span>${product.desc_en} / ${product.desc_ar} - <strong>${product.price}</strong></span>
            <button class="delete-btn" data-index="${index}">&times;</button>
        `;
        productList.appendChild(item);
    });
    // Attacher les listeners pour la suppression
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteProduct));
}

function addProduct() {
    const desc_en = document.getElementById('new-product-desc-en').value;
    const desc_ar = document.getElementById('new-product-desc-ar').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    if ((desc_en || desc_ar) && !isNaN(price)) {
        products.push({ desc_en, desc_ar, price });
        saveProducts();
        renderProducts();
        // Vider les champs
        document.getElementById('new-product-desc-en').value = '';
        document.getElementById('new-product-desc-ar').value = '';
        document.getElementById('new-product-price').value = '';
    } else {
        alert('Please fill in at least one description and a valid price.');
    }
}

function deleteProduct(event) {
    const index = event.target.dataset.index;
    products.splice(index, 1);
    saveProducts();
    renderProducts();
}

// --- FIN : Logique de la Bibliothèque de Produits ---


// --- DEBUT : Logique du Gestionnaire de Clients ---
let clients = [];

function saveClients() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

function loadClients() {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
        clients = JSON.parse(savedClients);
    }
    renderClients();
}

function renderClients() {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = '';
    clients.forEach((client, index) => {
        const item = document.createElement('div');
        item.className = 'list-item text-sm';
        item.innerHTML = `
            <span>${client.name_en} / ${client.name_ar}</span>
            <button class="delete-client-btn" data-index="${index}">&times;</button>
        `;
        clientList.appendChild(item);
    });
    document.querySelectorAll('.delete-client-btn').forEach(btn => btn.addEventListener('click', deleteClient));
}

function addClient() {
    const name_en = document.getElementById('new-client-name-en').value;
    const name_ar = document.getElementById('new-client-name-ar').value;
    const address_en = document.getElementById('new-client-address-en').value;
    const address_ar = document.getElementById('new-client-address-ar').value;
    if (name_en || name_ar) {
        clients.push({ name_en, name_ar, address_en, address_ar });
        saveClients();
        renderClients();
        // Vider les champs
        document.getElementById('new-client-name-en').value = '';
        document.getElementById('new-client-name-ar').value = '';
        document.getElementById('new-client-address-en').value = '';
        document.getElementById('new-client-address-ar').value = '';
    } else {
        alert('Please fill in at least one client name.');
    }
}

function deleteClient(event) {
    const index = event.target.dataset.index;
    clients.splice(index, 1);
    saveClients();
    renderClients();
}

// --- FIN : Logique du Gestionnaire de Clients ---


// Événements
document.addEventListener('DOMContentLoaded', function () {
    // ... (votre code DOMContentLoaded existant) ...

    // Chargement initial des données
    loadProducts();
    loadClients();

    // Listeners pour les nouveaux boutons
    document.getElementById('add-product-btn').addEventListener('click', addProduct);
    document.getElementById('add-client-btn').addEventListener('click', addClient);
    
    // Logique des onglets
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            
            button.classList.add('active');
            document.getElementById(`tab-${button.dataset.tab}`).classList.remove('hidden');
            document.getElementById(`tab-${button.dataset.tab}`).classList.add('active');
        });
    });
});

// MODIFIER la fonction addNewRow pour inclure le chargement de produit
function addNewRow(item = { photo: '', desc_en: '', desc_ar: '', qty: 1, price: 0 }) {
    // ... (votre code existant dans addNewRow) ...
    // REMPLACER la ligne `row.innerHTML = ...` par ceci :
    row.innerHTML = `
        <td class="p-2 photo-col">
            </td>
        <td class="p-2 relative">
            <div class="w-full p-2 editable item-description" contenteditable="true" data-en="${item.desc_en}" data-ar="${item.desc_ar}" spellcheck="false"></div>
            <button class="load-product-btn absolute top-1 right-1 text-blue-500 no-print">...</button>
        </td>
        <td class="p-2"><input type="number" value="${item.qty}" class="quantity w-full text-center p-2 border rounded"></td>
        <td class="p-2"><input type="number" value="${item.price}" step="0.01" class="unit-price w-full text-right p-2 border rounded"></td>
        <td class="p-2 text-right total">0.00</td>
        <td class="p-2 text-center no-print"><button class="remove-row text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button></td>
    `;
    
    // ... (le reste de votre code dans addNewRow) ...

    // Ajouter le listener pour le nouveau bouton "..."
    row.querySelector('.load-product-btn').addEventListener('click', (e) => {
        // Logique pour afficher une liste de produits et remplir la ligne
        // (Pour l'instant, on peut mettre une simple prompt box)
        const productIndex = prompt(`Enter product number (1 to ${products.length})`);
        if (productIndex && products[productIndex - 1]) {
            const product = products[productIndex - 1];
            const descEl = row.querySelector('.item-description');
            descEl.dataset.en = product.desc_en;
            descEl.dataset.ar = product.desc_ar;
            descEl.innerHTML = descEl.dataset[currentLang];
            row.querySelector('.unit-price').value = product.price;
            updateTotals();
        }
    });

    // ... (tout votre code JS existant) ...

// --- DEBUT : Logique de la Fenêtre Modale de Sélection ---
const modal = document.getElementById('selection-modal');
const modalTitle = document.getElementById('modal-title');
const modalList = document.getElementById('modal-list');
const modalSearch = document.getElementById('modal-search');
const modalCloseBtn = document.getElementById('modal-close-btn');

let currentSelectionCallback = null;

function openModal(title, items, renderItem, onSelect) {
    modalTitle.textContent = title;
    currentSelectionCallback = onSelect;
    
    const render = (filter = '') => {
        modalList.innerHTML = '';
        items.forEach((item, index) => {
            if (renderItem(item).toLowerCase().includes(filter.toLowerCase())) {
                const itemEl = document.createElement('div');
                itemEl.className = 'modal-list-item';
                itemEl.innerHTML = renderItem(item);
                itemEl.onclick = () => {
                    currentSelectionCallback(item);
                    closeModal();
                };
                modalList.appendChild(itemEl);
            }
        });
    };
    
    render();
    modalSearch.value = '';
    modalSearch.onkeyup = () => render(modalSearch.value);
    
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    modalList.innerHTML = '';
    modalSearch.onkeyup = null;
}

modalCloseBtn.onclick = closeModal;
// Fermer aussi si on clique sur le fond noir
modal.onclick = (e) => {
    if (e.target === modal) {
        closeModal();
    }
};

// --- FIN : Logique de la Fenêtre Modale ---

// MODIFIER les listeners dans DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // ... (tout le reste de votre code DOMContentLoaded) ...
    document.querySelector('.load-customer-btn').addEventListener('click', () => {
        openModal(
            'Select a Client',
            clients,
            (client) => `<strong>${client.name_en || client.name_ar}</strong><br><small>${client.address_en || client.address_ar}</small>`,
            (client) => {
                const nameEl = document.querySelector('[data-field="customerName"]');
                const addressEl = document.querySelector('[data-field="customerAddress"]');
                nameEl.dataset.en = client.name_en;
                nameEl.dataset.ar = client.name_ar;
                addressEl.dataset.en = client.address_en;
                addressEl.dataset.ar = client.address_ar;
                setLanguage(currentLang); // Met à jour l'affichage
            }
        );
    });
});


// MODIFIER la fonction addNewRow
function addNewRow(item = { photo: '', desc_en: '', desc_ar: '', qty: 1, price: 0 }) {
    // ... (votre code existant dans addNewRow) ...
    // ... (ne changez PAS la partie row.innerHTML) ...
    
    // REMPLACER l'ancien listener par le nouveau
    const row = tableBody.lastChild; // Récupère la ligne qu'on vient d'ajouter
    row.querySelector('.load-product-btn').addEventListener('click', () => {
        openModal(
            'Select a Product',
            products,
            (product) => `<strong>${product.desc_en || product.desc_ar}</strong> - Price: ${product.price}`,
            (product) => {
                const descEl = row.querySelector('.item-description');
                descEl.dataset.en = product.desc_en;
                descEl.dataset.ar = product.desc_ar;
                row.querySelector('.unit-price').value = product.price;
                setLanguage(currentLang); // Met à jour la description
                updateTotals(); // Met à jour les totaux
                autoSaveQuote(); // Sauvegarde les changements
            }
        );
    });
}
}
