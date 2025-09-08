// ===============================================
// DÉCLARATIONS GLOBALES ET PROFILS D'ENTREPRISE
// ===============================================

let currentLang = 'en';
let pdfImageData = null;
let savedQuotes = [];
let products = [];
let clients = [];
let currentlyEditingQuoteId = null;

// ... (Copiez ici vos objets 'companyProfiles' et 'translations' existants) ...


// ===============================================
// FONCTIONS DU TABLEAU DE BORD (DASHBOARD)
// ===============================================

function saveAllQuotes() {
    localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
}

function loadAllQuotes() {
    const data = localStorage.getItem('savedQuotes');
    savedQuotes = data ? JSON.parse(data) : [];
}

function renderDashboard() {
    const container = document.getElementById('quote-list-container');
    if (savedQuotes.length === 0) {
        container.innerHTML = `<div class="empty-state"><p class="font-semibold">No quotations found.</p><p class="text-sm">Click "+ New Quotation" to get started.</p></div>`;
        return;
    }

    container.innerHTML = `
        <div class="quote-list-item quote-list-header text-sm">
            <span>CLIENT / QUOTE #</span><span>DATE</span><span>TOTAL</span><span>ACTIONS</span>
        </div>
        <div id="quote-list"></div>`;
    const list = document.getElementById('quote-list');
    list.innerHTML = '';
    savedQuotes.sort((a, b) => new Date(b.meta.savedAt) - new Date(a.meta.savedAt)); // Trie du plus récent au plus ancien

    savedQuotes.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'quote-list-item text-sm';
        const clientName = quote.fields.customerName?.en || quote.fields.customerName?.ar || 'N/A';
        const quoteNum = quote.fields.quoteNum?.en || 'N/A';
        const date = new Date(quote.meta.savedAt).toLocaleDateString('en-CA');
        const total = parseFloat(quote.totals.grandTotal).toFixed(2);

        item.innerHTML = `
            <div><p class="font-bold text-slate-800">${clientName}</p><p class="text-xs text-slate-500">${quoteNum}</p></div>
            <span class="text-slate-600">${date}</span>
            <span class="font-semibold text-slate-800">${total} SAR</span>
            <div class="quote-actions">
                <button class="load-btn" onclick="loadQuoteForEditing('${quote.meta.id}')">Edit</button>
                <button class="delete-quote-btn" onclick="deleteQuote('${quote.meta.id}')">Delete</button>
            </div>`;
        list.appendChild(item);
    });
}

function deleteQuote(quoteId) {
    if (confirm('Are you sure you want to delete this quotation permanently?')) {
        savedQuotes = savedQuotes.filter(q => q.meta.id !== quoteId);
        saveAllQuotes();
        renderDashboard();
    }
}

// ===============================================
// NAVIGATION ENTRE LES PAGES
// ===============================================

function showDashboard() {
    document.getElementById('dashboard-page').classList.remove('hidden');
    document.getElementById('editor-page').classList.add('hidden');
    renderDashboard();
}

function showEditor() {
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('editor-page').classList.remove('hidden');
}

function openCompanyModal() {
    document.getElementById('company-selection-modal').classList.remove('hidden');
}
function closeCompanyModal() {
    document.getElementById('company-selection-modal').classList.add('hidden');
}

// ===============================================
// GESTION DES DEVIS (CRÉER, CHARGER, SAUVEGARDER)
// ===============================================

function createNewQuote(companyProfile) {
    closeCompanyModal();
    currentlyEditingQuoteId = null; // C'est un nouveau devis
    applyQuoteData(getEmptyQuoteData(companyProfile)); // Applique un template vide
    showEditor();
}

function loadQuoteForEditing(quoteId) {
    const quoteData = savedQuotes.find(q => q.meta.id === quoteId);
    if (quoteData) {
        currentlyEditingQuoteId = quoteId;
        applyQuoteData(quoteData);
        showEditor();
    }
}

function saveCurrentQuote() {
    const quoteData = captureQuoteData();
    if (!quoteData.fields.customerName?.en && !quoteData.fields.customerName?.ar) {
        alert("Please enter a customer name before saving.");
        return;
    }
    
    const existingIndex = savedQuotes.findIndex(q => q.meta.id === currentlyEditingQuoteId);
    if (existingIndex > -1) { // Mise à jour d'un devis existant
        savedQuotes[existingIndex] = quoteData;
    } else { // Ajout d'un nouveau devis
        savedQuotes.push(quoteData);
    }

    saveAllQuotes();
    alert('Quotation saved successfully!');
    showDashboard();
}

function captureQuoteData() {
    syncUIData();
    const quoteData = { 
        lang: currentLang, 
        companyProfile: document.body.dataset.activeProfile,
        fields: {}, 
        items: [],
        meta: {
            id: currentlyEditingQuoteId || `quote_${new Date().getTime()}`,
            savedAt: new Date().toISOString()
        },
        totals: {
            subtotal: document.getElementById('subtotal').textContent,
            vat: document.getElementById('vat').textContent,
            grandTotal: document.getElementById('grand-total').textContent
        }
    };
    // ... (le reste de la fonction pour remplir `fields` et `items` est inchangé) ...
    return quoteData;
}

// ... (Incluez ici TOUTES vos autres fonctions : applyQuoteData, getEmptyQuoteData, addNewRow, updateTotals, setLanguage, generatePDF, etc.) ...
// ... (Ainsi que toute la logique pour les produits, clients et la modale de sélection) ...


// ===============================================
// INITIALISATION DE L'APPLICATION
// ===============================================

document.addEventListener('DOMContentLoaded', function () {
    loadAllQuotes();
    loadProducts();
    loadClients();
    showDashboard(); // Démarrer sur le tableau de bord

    // Listeners principaux
    document.getElementById('new-quote-btn').addEventListener('click', openCompanyModal);
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);
    
    const saveBtn = document.getElementById('save-quote-btn');
    if(saveBtn) {
        saveBtn.innerHTML = "Save & Close";
        saveBtn.onclick = saveCurrentQuote;
    }
    
    // ... (le reste de vos listeners existants pour PDF, langue, produits, clients, etc.) ...
});
