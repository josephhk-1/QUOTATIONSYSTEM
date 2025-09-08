// ===============================================
// DÉBUT : GESTION DU MODE SOMBRE (DARK MODE)
// ===============================================
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;

function applyTheme() {
    if (document.documentElement.classList.contains('dark')) {
        themeToggleBtn.innerHTML = sunIcon;
    } else {
        themeToggleBtn.innerHTML = moonIcon;
    }
}

themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    applyTheme();
});
// ===============================================
// FIN : GESTION DU MODE SOMBRE (DARK MODE)
// ===============================================


// ===============================================
// ÉTAT GLOBAL ET DONNÉES
// ===============================================
let currentLang = 'en';
let pdfImageData = null;
let savedQuotes = [];
let products = [];
let clients = [];
let currentlyEditingQuoteId = null;

const companyProfiles = {
     'wooden_pieces': { 
         acronym: 'WPE', 
         logo: 'logowooden.png', 
         name: { en: 'Wooden Pieces EST.', ar: 'مؤسسة القطع الخشبية' }, 
         cr: { en: 'CR: 1010798529', ar: 'س.ت: 1010798529' }, 
         vat: { en: 'Vat No.: 310618978500003', ar: 'الرقم الضريبي: 310618978500003' }, 
         address: { en: 'RFKB2501. ALQods st, Alkhaleej, P.O.Box: 2401, RIYADH 13223, Kingdom of Saudi Arabia', ar: 'RFKB2501. شارع القدس, الخليج, ص.ب: 2401, الرياض 13223, المملكة العربية السعودية' }, 
         bankDetails: { en: `<p><strong>Bank:</strong> ALINMAA BANK</p><p><strong>IBAN:</strong> SA0705000068203914512000</p>`, ar: `<p><strong>البنك:</strong> مصرف الإنماء</p><p><strong>الآيبان:</strong> SA0705000068203914512000</p>` },
         terms: { en: `<ul><li>50% Down payment</li><li>50% After delivery</li><li>Delivery within 20 to 30 days from down payment</li><li>3 years warranty on manufacturing defects</li></ul>`, ar: `<ul><li>دفعة أولى 50%</li><li>50% بعد التسليم</li><li>التسليم في غضون 20 إلى 30 يومًا</li><li>ضمان 3 سنوات على عيوب التصنيع</li></ul>` }
    },
     'rattan_palace': { 
         acronym: 'RP', 
         logo: 'logo.png',
         name: { en: 'Rattan Palace', ar: 'قصر الخيزران' }, 
         cr: { en: 'CR: 7050562888', ar: 'س.ت: 7050562888' }, 
         vat: { en: 'Vat No.: 313099850500003', ar: 'الرقم الضريبي: 313099850500003' }, 
         address: { en: 'RFKB2501. ALQods st, Alkhaleej, P.O.Box: 2401, RIYADH 13223, Kingdom of Saudi Arabia', ar: 'RFKB2501. شارع القدس, الخليج, ص.ب: 2401, الرياض 13223, المملكة العربية السعودية' }, 
         bankDetails: { en: `<p><strong>Bank:</strong> Riyad Bank</p><p><strong>IBAN:</strong> SA3020000002126072249940</p>`, ar: `<p><strong>البنك:</strong> بنك الرياض</p><p><strong>الآيبان:</strong> SA3020000002126072249940</p>` },
         terms: { en: `<ul><li>50% Down payment</li><li>50% After delivery</li><li>Delivery within 20 to 30 days</li><li>3 years warranty</li></ul>`, ar: `<ul><li>دفعة أولى 50%</li><li>50% بعد التسليم</li><li>التسليم خلال 20-30 يوم</li><li>ضمان 3 سنوات</li></ul>` }
    }
};

const translations = {
    en: { appTitle: "Quotation Editor", loadSource: "Load", saveSource: "Save", previewPdf: "Preview PDF", downloadPdf: "Download PDF", customer: "Customer", quoteNum: "Quote #:", date: "Date:", validUntil: "Valid Until:", projectDescription: "Project Description", photo: "Photo", description: "Item", quantity: "Quantity", unitPrice: "Unit Price", total: "Total", action: "Action", addRow: "+ Add Row", subtotal: "Subtotal", vat: "VAT (15%)", grandTotal: "TOTAL", terms: "Terms & Conditions", bankDetails: "Bank Details", signature: "Signature", pdfPreviewTitle: "PDF Preview", cancel: "Cancel", fileLoadError: "Error: Could not load file." },
    ar: { appTitle: "محرر عروض الأسعار", loadSource: "تحميل", saveSource: "حفظ", previewPdf: "معاينة PDF", downloadPdf: "تحميل PDF", customer: "العميل", quoteNum: "رقم العرض:", date: "التاريخ:", validUntil: "صالح حتى:", projectDescription: "وصف المشروع", photo: "صورة", description: "البند", quantity: "الكمية", unitPrice: "سعر الوحدة", total: "المجموع", action: "إجراء", addRow: "+ أضف سطراً", subtotal: "المجموع الفرعي", vat: "الضريبة (15%)", grandTotal: "الإجمالي", terms: "الشروط والأحكام", bankDetails: "التفاصيل البنكية", signature: "التوقيع", pdfPreviewTitle: "معاينة PDF", cancel: "إلغاء", fileLoadError: "خطأ: لا يمكن تحميل الملف." }
};

// ===============================================
// FONCTIONS DU TABLEAU DE BORD ET NAVIGATION
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
        container.innerHTML = `<div class="empty-state">
            <p class="font-semibold text-slate-600 dark:text-slate-300">No quotations found.</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Click "+ New Quotation" to get started.</p>
        </div>`;
        return;
    }

    container.innerHTML = `
        <div class="quote-list-item quote-list-header text-sm">
            <span class="text-slate-600 dark:text-slate-300">CLIENT / QUOTE #</span>
            <span class="text-slate-600 dark:text-slate-300">DATE</span>
            <span class="text-slate-600 dark:text-slate-300">TOTAL</span>
            <span class="text-slate-600 dark:text-slate-300">ACTIONS</span>
        </div>
        <div id="quote-list"></div>`;
    const list = document.getElementById('quote-list');
    list.innerHTML = '';
    savedQuotes.sort((a, b) => new Date(b.meta.savedAt) - new Date(a.meta.savedAt));

    savedQuotes.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'quote-list-item text-sm';
        const clientName = quote.fields.customerName?.en || quote.fields.customerName?.ar || 'N/A';
        const quoteNum = quote.fields.quoteNum?.en || 'N/A';
        const date = new Date(quote.meta.savedAt).toLocaleDateString('en-CA');
        const total = parseFloat(quote.totals.grandTotal).toFixed(2);

        item.innerHTML = `
            <div>
                <p class="font-bold text-slate-800 dark:text-slate-100">${clientName}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">${quoteNum}</p>
            </div>
            <span class="text-slate-600 dark:text-slate-300">${date}

            // ===============================================
// CAPTURE ET APPLICATION DES DONNÉES
// ===============================================

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

    document.querySelectorAll('.editable').forEach(el => {
        const fieldName = el.dataset.field;
        if(fieldName) quoteData.fields[fieldName] = { en: el.dataset.en || '', ar: el.dataset.ar || '' };
    });

    document.querySelectorAll('#table-body tr').forEach(row => {
        const descEl = row.querySelector('.item-description');
        const imgEl = row.querySelector('img');
        quoteData.items.push({
            photo: imgEl.dataset.photoBase64 || '',
            desc_en: descEl.dataset.en || '', desc_ar: descEl.dataset.ar || '',
            qty: row.querySelector('.quantity').value, price: row.querySelector('.unit-price').value
        });
    });
    return quoteData;
}

function applyQuoteData(data) {
    document.body.dataset.activeProfile = data.companyProfile;
    switchCompanyProfile(data.companyProfile);
    if(data.fields) {
        Object.keys(data.fields).forEach(fieldName => {
            const el = document.querySelector(`.editable[data-field="${fieldName}"]`);
            if (el) {
                el.dataset.en = data.fields[fieldName].en;
                el.dataset.ar = data.fields[fieldName].ar;
            }
        });
    }
    document.getElementById('table-body').innerHTML = '';
    if(data.items) {
        data.items.forEach(item => addNewRow(item));
    }
    setLanguage(data.lang || 'en');
    updateTotals();
}

function getEmptyQuoteData(profileKey) {
    const profile = companyProfiles[profileKey];
    const emptyData = {
        companyProfile: profileKey,
        lang: 'en',
        fields: {
            companyName: profile.name,
            companyCR: profile.cr,
            companyVat: profile.vat,
            companyAddress: profile.address,
            bankDetails: profile.bankDetails,
            terms: profile.terms,
        },
        items: []
    };
    // Générer un numéro de devis pour le nouveau devis
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const quoteNumber = `Q-${profile.acronym}-${day}${month}${year}`;
    emptyData.fields.quoteNum = { en: quoteNumber, ar: quoteNumber };

    return emptyData;
}


// ===============================================
// FONCTIONS DE L'ÉDITEUR
// ===============================================

function switchCompanyProfile(profileKey) {
    const profile = companyProfiles[profileKey];
    if (!profile) return;
    document.body.dataset.activeProfile = profileKey;
    document.getElementById('company-logo').src = profile.logo;
    
    const fieldMapping = {
        name: 'companyName', cr: 'companyCR', vat: 'companyVat',
        address: 'companyAddress', bankDetails: 'bankDetails', terms: 'terms'
    };

    for (const key in fieldMapping) {
        const el = document.querySelector(`[data-field="${fieldMapping[key]}"]`);
        if (el && profile[key]) {
            el.dataset.en = profile[key].en;
            el.dataset.ar = profile[key].ar;
        }
    }
    setLanguage(currentLang);
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    document.querySelectorAll('.editable').forEach(el => {
        el.innerHTML = el.dataset[lang] || '';
    });
}

function syncUIData() { 
    document.querySelectorAll('.editable').forEach(el => {
        el.dataset[currentLang] = el.innerHTML;
    }); 
}

function updateTotals() {
    let subtotal = 0;
    document.querySelectorAll('#table-body tr').forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
        const total = quantity * unitPrice;
        row.querySelector('.total').textContent = total.toFixed(2);
        subtotal += total;
    });
    const vat = subtotal * 0.15;
    const grandTotal = subtotal + vat;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('vat').textContent = vat.toFixed(2);
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}

function addNewRow(item = { photo: '', desc_en: '', desc_ar: '', qty: 1, price: 0 }) {
    const tableBody = document.getElementById('table-body');
    const row = document.createElement('tr');
    row.className = 'border-b border-slate-200 dark:border-slate-700';
    
    row.innerHTML = `
        <td class="p-2 photo-col">
            <div class="photo-upload-container">
                <img src="${item.photo || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${item.photo ? '' : 'hidden'}" data-photo-base64="${item.photo || ''}">
                <div class="placeholder-icon ${item.photo ? 'hidden' : ''}"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                <input type="file" class="hidden" accept="image/*">
            </div>
        </td>
        <td class="p-2 relative"><div class="w-full p-2 editable item-description" contenteditable="true" data-en="${item.desc_en}" data-ar="${item.desc_ar}" spellcheck="false"></div><button class="load-product-btn absolute top-1 right-1 text-blue-500 no-print">...</button></td>
        <td class="p-2"><input type="number" value="${item.qty}" class="quantity w-full text-center p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"></td>
        <td class="p-2"><input type="number" value="${item.price}" step="0.01" class="unit-price w-full text-right p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"></td>
        <td class="p-2 text-right total">0.00</td>
        <td class="p-2 text-center no-print"><button class="remove-row text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button></td>
    `;
    tableBody.appendChild(row);

    const descDiv = row.querySelector('.item-description');
    descDiv.innerHTML = descDiv.dataset[currentLang];
    descDiv.addEventListener('input', () => syncUIData());
    
    row.querySelectorAll('input.quantity, input.unit-price').forEach(input => input.addEventListener('input', updateTotals));
    row.querySelector('.remove-row').addEventListener('click', () => { row.remove(); updateTotals(); });

    const photoContainer = row.querySelector('.photo-upload-container');
    const fileInput = row.querySelector('input[type="file"]');
    const imgEl = row.querySelector('img');
    const placeholder = row.querySelector('.placeholder-icon');

    photoContainer.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgEl.src = e.target.result;
                imgEl.dataset.photoBase64 = e.target.result;
                imgEl.classList.remove('hidden');
                placeholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
    updateTotals();
}

// ===============================================
// BIBLIOTHÈQUES (PRODUITS & CLIENTS)
// ===============================================
function saveProducts() { localStorage.setItem('products', JSON.stringify(products)); }
function loadProducts() { products = JSON.parse(localStorage.getItem('products')) || []; renderProducts(); }
function renderProducts() { /* ... */ } // Placeholder, la vraie fonction est plus bas
function addProduct() { /* ... */ }
function deleteProduct(event) { /* ... */ }
// ... Idem pour les clients

// ===============================================
// MODALES
// ===============================================
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
}

modalCloseBtn.onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };

async function generatePDF() { /* ... */ } // Placeholder
function closePreviewModal() {
    document.getElementById('pdf-preview-modal').classList.add('hidden');
    pdfImageData = null;
}

// ===============================================
// INITIALISATION
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    loadAllQuotes();
    // Vous devez ajouter le HTML de l'éditeur et des contrôles ici
    // pour que le reste du script fonctionne.
    // Par exemple :
    document.getElementById('print-area').innerHTML = ``;
    document.getElementById('controls-panel').innerHTML = ``;
    
    // Attacher les listeners
    document.getElementById('new-quote-btn').addEventListener('click', openCompanyModal);
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);
    
    // ... et tous les autres listeners dont vous avez besoin
    
    showDashboard();
});

