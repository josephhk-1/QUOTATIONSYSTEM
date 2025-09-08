// ===============================================
// DARK MODE LOGIC
// ===============================================
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;

function applyTheme() {
    themeToggleBtn.innerHTML = document.documentElement.classList.contains('dark') ? sunIcon : moonIcon;
}
themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    applyTheme();
});

// ===============================================
// GLOBAL STATE & DATA
// ===============================================
let currentLang = localStorage.getItem('language') || 'en';
let pdfImageData = null, savedQuotes = [], products = [], clients = [], currentlyEditingQuoteId = null;

const companyProfiles = {
     'wooden_pieces': { 
         acronym: 'WPE', logo: 'logowooden.png', 
         name: { en: 'Wooden Pieces EST.', ar: 'مؤسسة القطع الخشبية' }, 
         cr: { en: 'CR: 1010798529', ar: 'س.ت: 1010798529' }, 
         vat: { en: 'Vat No.: 310618978500003', ar: 'الرقم الضريبي: 310618978500003' }, 
         address: { en: 'Alkhaleej, RIYADH 13223, Saudi Arabia', ar: 'الخليج, الرياض 13223, المملكة العربية السعودية' }, 
         bankDetails: { en: `<p><strong>Bank:</strong> ALINMAA BANK</p><p><strong>IBAN:</strong> SA0705000068203914512000</p>`, ar: `<p><strong>البنك:</strong> مصرف الإنماء</p><p><strong>الآيبان:</strong> SA0705000068203914512000</p>` },
         terms: { en: `<ul><li>50% advance payment upon confirmation.</li><li>50% upon completion and delivery.</li><li>Delivery within 20 to 30 business days.</li><li>Includes a 3-year warranty on manufacturing defects.</li></ul>`, ar: `<ul><li>50% دفعة مقدمة عند تأكيد الطلب.</li><li>50% عند الإنجاز والتسليم.</li><li>التسليم خلال 20 إلى 30 يوم عمل.</li><li>ضمان لمدة 3 سنوات على عيوب التصنيع.</li></ul>` }
    },
     'rattan_palace': { 
         acronym: 'RP', logo: 'logo.png',
         name: { en: 'Rattan Palace', ar: 'قصر الخيزران' }, 
         cr: { en: 'CR: 7050562888', ar: 'س.ت: 7050562888' }, 
         vat: { en: 'Vat No.: 313099850500003', ar: 'الرقم الضريبي: 313099850500003' }, 
         address: { en: 'Alkhaleej, RIYADH 13223, Saudi Arabia', ar: 'الخليج, الرياض 13223, المملكة العربية السعودية' }, 
         bankDetails: { en: `<p><strong>Bank:</strong> Riyad Bank</p><p><strong>IBAN:</strong> SA3020000002126072249940</p>`, ar: `<p><strong>البنك:</strong> بنك الرياض</p><p><strong>الآيبان:</strong> SA3020000002126072249940</p>` },
         terms: { en: `<ul><li>50% advance payment upon confirmation.</li><li>50% upon completion and delivery.</li><li>Delivery within 20 to 30 business days.</li><li>Includes a 3-year warranty on manufacturing defects.</li></ul>`, ar: `<ul><li>50% دفعة مقدمة عند تأكيد الطلب.</li><li>50% عند الإنجاز والتسليم.</li><li>التسليم خلال 20 إلى 30 يوم عمل.</li><li>ضمان لمدة 3 سنوات على عيوب التصنيع.</li></ul>` }
    }
};
const translations = {
    en: { dashboardTitle: "My Quotations", newQuoteBtn: "+ New Quotation", selectProfileTitle: "Select a Company Profile", backToDashboardBtn: "← Back to Dashboard", appTitle: "Quotation Editor", loadSource: "Load", saveSource: "Save", previewPdf: "Preview PDF", downloadPdf: "Download PDF", customer: "Customer", quoteNum: "Quote #:", date: "Date:", validUntil: "Valid Until:", projectDescription: "Project Description", photo: "Photo", description: "Item", quantity: "Quantity", unitPrice: "Unit Price", total: "Total", action: "Action", addRow: "+ Add Row", subtotal: "Subtotal", vat: "VAT (15%)", grandTotal: "TOTAL", terms: "Terms & Conditions", bankDetails: "Bank Details", signature: "Signature", pdfPreviewTitle: "PDF Preview", cancel: "Cancel", fileLoadError: "Error: Could not load file.", quotationTitle: "QUOTATION", closingPhrase: "Thank you for your business. We look forward to working with you." },
    ar: { dashboardTitle: "عروضي", newQuoteBtn: "+ عرض سعر جديد", selectProfileTitle: "اختر ملف الشركة", backToDashboardBtn: "→ العودة للرئيسية", appTitle: "محرر عروض الأسعار", loadSource: "تحميل", saveSource: "حفظ", previewPdf: "معاينة PDF", downloadPdf: "تحميل PDF", customer: "العميل", quoteNum: "رقم العرض:", date: "التاريخ:", validUntil: "صالح حتى:", projectDescription: "وصف المشروع", photo: "صورة", description: "البند", quantity: "الكمية", unitPrice: "سعر الوحدة", total: "المجموع", action: "إجراء", addRow: "+ أضف سطراً", subtotal: "المجموع الفرعي", vat: "الضريبة (15%)", grandTotal: "الإجمالي", terms: "الشروط والأحكام", bankDetails: "التفاصيل البنكية", signature: "التوقيع", pdfPreviewTitle: "معاينة PDF", cancel: "إلغاء", fileLoadError: "خطأ: لا يمكن تحميل الملف.", quotationTitle: "عرض سعر", closingPhrase: "شكراً لثقتكم. نتطلع للعمل معكم." }
};

const editorHTML = `
    <h1 class="text-4xl font-bold text-center mb-10 tracking-wider" data-lang="quotationTitle">QUOTATION</h1>
    <div class="text-center mb-10">
        <img id="company-logo" src="" alt="Company Logo" class="w-64 h-auto mx-auto mb-2">
        <div class="company-info">
            <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 editable" contenteditable="true" data-field="companyName" spellcheck="false"></h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 editable" contenteditable="true" data-field="companyCR" spellcheck="false"></p>
            <p class="text-sm text-slate-500 dark:text-slate-400 editable" contenteditable="true" data-field="companyVat" spellcheck="false"></p>
            <p class="text-sm text-slate-500 dark:text-slate-400 editable" contenteditable="true" data-field="companyAddress" spellcheck="false"></p>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div class="p-4 rounded-lg text-left bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 relative">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-slate-700 dark:text-slate-200" data-lang="customer">Customer</h3>
                <button class="load-customer-btn text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-bold no-print">Load Client</button>
            </div>
            <p class="editable text-sm" contenteditable="true" data-field="customerName" data-en="Customer Name" data-ar="اسم العميل" spellcheck="false"></p>
            <p class="editable text-sm" contenteditable="true" data-field="customerAddress" data-en="Customer Address" data-ar="عنوان العميل" spellcheck="false"></p>
            <p class="editable text-sm" contenteditable="true" data-field="customerCountry" data-en="Saudi Arabia" data-ar="المملكة العربية السعودية" spellcheck="false"></p>
        </div>
        <div class="p-4 rounded-lg text-right bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
            <div class="text-sm inline-block text-left">
                <p><span class="font-bold" data-lang="quoteNum">Quote #:</span> <span class="editable" contenteditable="true" data-field="quoteNum" spellcheck="false"></span></p>
                <p><span class="font-bold" data-lang="date">Date:</span> <span id="quoteDate"></span></p>
                <p><span class="font-bold" data-lang="validUntil">Valid Until:</span> <span id="validDate"></span></p>
            </div>
        </div>
    </div>
    <div class="mb-8">
        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700" data-lang="projectDescription">Project Description</h3>
        <div class="editable text-sm p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700" contenteditable="true" data-field="projectDescription" data-en="Enter project description..." data-ar="أدخل وصف المشروع..." spellcheck="false"></div>
    </div>
    <table class="w-full text-sm" id="items-table">
        <thead class="text-slate-700 dark:text-slate-300">
            <tr class="border-b-2 border-slate-300 dark:border-slate-600">
                <th class="p-2 w-24 text-left font-semibold" data-lang="photo">Photo</th>
                <th class="p-2 text-left font-semibold" data-lang="description">Item</th>
                <th class="p-2 w-24 text-center font-semibold" data-lang="quantity">Quantity</th>
                <th class="p-2 w-32 text-right font-semibold" data-lang="unitPrice">Unit Price</th>
                <th class="p-2 w-32 text-right font-semibold" data-lang="total">Total</th>
                <th class="p-2 w-16 text-center no-print font-semibold" data-lang="action">Action</th>
            </tr>
        </thead>
        <tbody id="table-body"></tbody>
    </table>
    <button id="add-row" class="mt-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg no-print"><span data-lang="addRow">+ Add Row</span></button>
    <div class="flex justify-end mt-8">
        <div class="w-full max-w-sm text-slate-800 dark:text-slate-200">
            <div class="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700"><span class="font-semibold" data-lang="subtotal">Subtotal</span><span id="subtotal">0.00</span></div>
            <div class="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700"><span class="font-semibold" data-lang="vat">VAT (15%)</span><span id="vat">0.00</span></div>
            <div class="flex justify-between py-3 text-xl font-bold bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 rounded-lg mt-2"><span data-lang="grandTotal">TOTAL</span><span id="grand-total">0.00</span></div>
        </div>
    </div>
    <div class="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        <div><h3 class="font-bold text-base text-slate-800 dark:text-slate-100 mb-3 text-center" data-lang="terms">Terms & Conditions</h3><div class="editable text-justify p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg" contenteditable="true" data-field="terms" spellcheck="false"></div></div>
        <div><h3 class="font-bold text-base text-slate-800 dark:text-slate-100 mb-3 text-center" data-lang="bankDetails">Bank Details</h3><div class="editable text-justify p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg" contenteditable="true" data-field="bankDetails" spellcheck="false"></div></div>
    </div>
    <div class="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700 text-center">
        <div class="w-64 h-16 border-b-2 border-slate-300 dark:border-slate-600 inline-block"></div>
        <p class="font-semibold mt-2" data-lang="signature">Signature</p>
    </div>
    <div class="text-center mt-6">
        <p class="font-semibold text-slate-700 dark:text-slate-300 editable" data-field="closingPhrase" data-en="Thank you for your business. We look forward to working with you." data-ar="شكراً لثقتكم. نتطلع للعمل معكم." spellcheck="false"></p>
    </div>
`;

const controlsHTML = `
    <div class="control-panel-card bg-white dark:bg-slate-800">
        <h2 class="font-bold text-lg text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Company Profile</h2>
        <select id="company-selector" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="wooden_pieces">Wooden Pieces EST.</option>
            <option value="rattan_palace">Rattan Palace</option>
        </select>
    </div>
    <div class="control-panel-card bg-white dark:bg-slate-800">
        <div class="flex border-b border-slate-200 dark:border-slate-700">
            <button class="tab-btn active" data-tab="actions">Actions</button>
            <button class="tab-btn" data-tab="products">Products</button>
            <button class="tab-btn" data-tab="clients">Clients</button>
        </div>
        <div id="tab-actions" class="tab-content active pt-4">
            <div class="grid grid-cols-2 gap-3">
                <button id="save-quote-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg"></button>
                <button id="preview-pdf-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg"><span data-lang="previewPdf">Preview PDF</span></button>
            </div>
        </div>
        <div id="tab-products" class="tab-content hidden pt-4">
            <div id="product-list" class="max-h-60 overflow-y-auto space-y-2"></div>
            <div class="mt-4 space-y-2">
                <input type="text" id="new-product-desc-en" placeholder="Product Name (EN)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <input type="text" id="new-product-desc-ar" placeholder="اسم المنتج (AR)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <input type="number" id="new-product-price" placeholder="Unit Price" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <button id="add-product-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg">Add Product</button>
            </div>
        </div>
        <div id="tab-clients" class="tab-content hidden pt-4">
            <div id="client-list" class="max-h-60 overflow-y-auto space-y-2"></div>
            <div class="mt-4 space-y-2">
                 <input type="text" id="new-client-name-en" placeholder="Client Name (EN)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                 <input type="text" id="new-client-name-ar" placeholder="اسم العميل (AR)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                 <textarea id="new-client-address-en" placeholder="Address (EN)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600" rows="2"></textarea>
                 <textarea id="new-client-address-ar" placeholder="العنوان (AR)" class="w-full p-2 border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600" rows="2"></textarea>
                <button id="add-client-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg">Add Client</button>
            </div>
        </div>
    </div>
`;

// ===============================================
// DASHBOARD & NAVIGATION
// ===============================================

function saveAllQuotes() { localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes)); }
function loadAllQuotes() { savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || []; }

function renderDashboard() {
    const container = document.getElementById('quote-list-container');
    if (savedQuotes.length === 0) {
        container.innerHTML = `<div class="empty-state"><p class="font-semibold text-slate-600 dark:text-slate-300">No quotations found.</p><p class="text-sm text-slate-500 dark:text-slate-400">Click "+ New Quotation" to get started.</p></div>`;
        return;
    }
    container.innerHTML = `<div class="quote-list-item quote-list-header text-sm"><span class="text-slate-600 dark:text-slate-300">CLIENT / QUOTE #</span><span class="text-slate-600 dark:text-slate-300">DATE</span><span class="text-slate-600 dark:text-slate-300">TOTAL</span><span class="text-slate-600 dark:text-slate-300">ACTIONS</span></div><div id="quote-list"></div>`;
    const list = document.getElementById('quote-list');
    list.innerHTML = '';
    savedQuotes.sort((a, b) => new Date(b.meta.savedAt) - new Date(a.meta.savedAt));
    savedQuotes.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'quote-list-item text-sm';
        const clientName = quote.fields.customerName[currentLang] || quote.fields.customerName['en'] || 'N/A';
        const quoteNum = quote.fields.quoteNum?.en || 'N/A';
        const date = new Date(quote.meta.savedAt).toLocaleDateString('en-CA');
        const total = parseFloat(quote.totals.grandTotal).toFixed(2);
        item.innerHTML = `<div><p class="font-bold text-slate-800 dark:text-slate-100">${clientName}</p><p class="text-xs text-slate-500 dark:text-slate-400">${quoteNum}</p></div><span class="text-slate-600 dark:text-slate-300">${date}</span><span class="font-semibold text-slate-800 dark:text-slate-100">${total} SAR</span><div class="quote-actions"><button class="load-btn" onclick="loadQuoteForEditing('${quote.meta.id}')">Edit</button><button class="delete-quote-btn" onclick="deleteQuote('${quote.meta.id}')">Delete</button></div>`;
        list.appendChild(item);
    });
}

function showDashboard() {
    document.getElementById('dashboard-page').classList.remove('hidden');
    document.getElementById('editor-page').classList.add('hidden');
    renderDashboard();
    setLanguage(currentLang);
}

function showEditor() {
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('editor-page').classList.remove('hidden');
}

function openCompanyModal() { document.getElementById('company-selection-modal').classList.remove('hidden'); }
function closeCompanyModal() { document.getElementById('company-selection-modal').classList.add('hidden'); }

// ===============================================
// QUOTE MANAGEMENT
// ===============================================

function createNewQuote(companyProfile) {
    closeCompanyModal();
    currentlyEditingQuoteId = null;
    applyQuoteData(getEmptyQuoteData(companyProfile));
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
    const customerName = quoteData.fields.customerName?.en || quoteData.fields.customerName?.ar;
    if (!customerName || customerName.trim() === 'Customer Name' || customerName.trim() === '') {
        alert("Please enter a customer name before saving.");
        return;
    }
    const existingIndex = savedQuotes.findIndex(q => q.meta.id === currentlyEditingQuoteId);
    if (existingIndex > -1) {
        savedQuotes[existingIndex] = quoteData;
    } else {
        savedQuotes.push(quoteData);
    }
    saveAllQuotes();
    alert('Quotation saved!');
    showDashboard();
}

function deleteQuote(quoteId) {
    if (confirm('Are you sure you want to delete this quotation?')) {
        savedQuotes = savedQuotes.filter(q => q.meta.id !== quoteId);
        saveAllQuotes();
        renderDashboard();
    }
}

function captureQuoteData() {
    syncUIData();
    const data = {
        lang: currentLang, companyProfile: document.body.dataset.activeProfile,
        fields: {}, items: [],
        meta: { id: currentlyEditingQuoteId || `quote_${Date.now()}`, savedAt: new Date().toISOString() },
        totals: { subtotal: document.getElementById('subtotal').textContent, vat: document.getElementById('vat').textContent, grandTotal: document.getElementById('grand-total').textContent }
    };
    document.querySelectorAll('#editor-page .editable').forEach(el => {
        const field = el.dataset.field;
        if (field) data.fields[field] = { en: el.dataset.en || '', ar: el.dataset.ar || '' };
    });
    document.querySelectorAll('#table-body tr').forEach(row => {
        const desc = row.querySelector('.item-description');
        const img = row.querySelector('img');
        data.items.push({
            photo: img.dataset.photoBase64 || '',
            desc_en: desc.dataset.en || '', desc_ar: desc.dataset.ar || '',
            qty: row.querySelector('.quantity').value, price: row.querySelector('.unit-price').value
        });
    });
    return data;
}

function applyQuoteData(data) {
    document.body.dataset.activeProfile = data.companyProfile;
    document.getElementById('print-area').innerHTML = editorHTML;
    document.getElementById('controls-panel-container').innerHTML = controlsHTML;
    
    document.getElementById('company-selector').value = data.companyProfile;
    switchCompanyProfile(data.companyProfile);

    if (data.fields) {
        Object.keys(data.fields).forEach(field => {
            const el = document.querySelector(`#editor-page .editable[data-field="${field}"]`);
            if (el) {
                el.dataset.en = data.fields[field].en;
                el.dataset.ar = data.fields[field].ar;
            }
        });
    }
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    if (data.items && data.items.length > 0) {
        data.items.forEach(item => addNewRow(item));
    } else {
        addNewRow();
    }
    
    const today = new Date();
    document.getElementById('quoteDate').textContent = today.toLocaleDateString('en-CA');
    const validUntil = new Date();
    validUntil.setDate(today.getDate() + 7);
    document.getElementById('validDate').textContent = validUntil.toLocaleDateString('en-CA');
    document.getElementById('save-quote-btn').textContent = "Save & Close";

    setLanguage(data.lang || currentLang);
    updateTotals();
    attachEditorEventListeners();
}

function getEmptyQuoteData(profileKey) {
    const profile = companyProfiles[profileKey];
    const now = new Date();
    const quoteNumber = `Q-${profile.acronym}-${now.getDate()}${now.getMonth()+1}${String(now.getFullYear()).slice(-2)}`;
    return {
        companyProfile: profileKey, lang: currentLang,
        fields: {
            companyName: profile.name, companyCR: profile.cr, companyVat: profile.vat,
            companyAddress: profile.address, bankDetails: profile.bankDetails, terms: profile.terms,
            quoteNum: { en: quoteNumber, ar: quoteNumber },
            closingPhrase: { en: translations.en.closingPhrase, ar: translations.ar.closingPhrase }
        },
        items: []
    };
}

// ===============================================
// EDITOR FUNCTIONS
// ===============================================
function switchCompanyProfile(profileKey) {
    document.body.dataset.activeProfile = profileKey;
    const profile = companyProfiles[profileKey];
    if (!profile) return;

    document.getElementById('company-logo').src = profile.logo;
    
    const dataMap = {
        companyName: profile.name, companyCR: profile.cr, companyVat: profile.vat,
        companyAddress: profile.address, bankDetails: profile.bankDetails, terms: profile.terms
    };

    Object.keys(dataMap).forEach(field => {
        const el = document.querySelector(`#editor-page .editable[data-field="${field}"]`);
        if (el) {
            el.dataset.en = dataMap[field].en;
            el.dataset.ar = dataMap[field].ar;
        }
    });
    setLanguage(currentLang);
}

function syncUIData() {
    document.querySelectorAll('#editor-page .editable').forEach(el => {
        if(document.activeElement === el) {
            el.dataset[currentLang] = el.innerHTML;
        }
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });
    document.querySelectorAll('.editable').forEach(el => {
        el.innerHTML = el.dataset[lang] || '';
    });

    document.querySelectorAll('.language-btn').forEach(btn => {
        if(btn.dataset.langSwitch === lang) {
            btn.classList.add('active-lang');
        } else {
            btn.classList.remove('active-lang');
        }
    });
    renderDashboard(); // Re-render dashboard to show names in correct language
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
        <td class="p-2 align-top"><div class="photo-upload-container"><img src="${item.photo||'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" class="${item.photo?'':'hidden'}" data-photo-base64="${item.photo||''}"><div class="placeholder-icon ${item.photo?'':'hidden'}"><svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><input type="file" class="hidden" accept="image/*"></div></td>
        <td class="p-2 align-top relative"><div class="w-full p-2 editable item-description" contenteditable="true" data-en="${item.desc_en}" data-ar="${item.desc_ar}" spellcheck="false"></div><button class="load-product-btn absolute top-1 right-1 text-blue-500 no-print p-1 leading-none">...</button></td>
        <td class="p-2 align-top"><input type="number" value="${item.qty}" class="quantity w-full text-center p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"></td>
        <td class="p-2 align-top"><input type="number" value="${item.price}" step="0.01" class="unit-price w-full text-right p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"></td>
        <td class="p-2 align-top text-right total">0.00</td>
        <td class="p-2 align-top text-center no-print"><button class="remove-row text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button></td>
    `;
    tableBody.appendChild(row);
    const descEl = row.querySelector('.item-description');
    descEl.innerHTML = descEl.dataset[currentLang] || '';
    
    descEl.addEventListener('blur', syncUIData);
    row.querySelectorAll('input').forEach(input => input.addEventListener('input', updateTotals));
    row.querySelector('.remove-row').addEventListener('click', () => { row.remove(); updateTotals(); });

    const photoContainer = row.querySelector('.photo-upload-container');
    const fileInput = row.querySelector('input[type="file"]');
    photoContainer.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = photoContainer.querySelector('img');
            img.src = e.target.result;
            img.dataset.photoBase64 = e.target.result;
            img.classList.remove('hidden');
            photoContainer.querySelector('.placeholder-icon').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    });
    
    row.querySelector('.load-product-btn').addEventListener('click', () => {
        openModal('Select a Product', products, (p) => `<strong>${p[currentLang] || p.en}</strong> - Price: ${p.price}`, (product) => {
            const desc = row.querySelector('.item-description');
            desc.dataset.en = product.desc_en;
            desc.dataset.ar = product.desc_ar;
            desc.innerHTML = desc.dataset[currentLang];
            row.querySelector('.unit-price').value = product.price;
            updateTotals();
        });
    });
}

// ===============================================
// LIBRARIES (Products & Clients)
// ===============================================
function saveProducts() { localStorage.setItem('products', JSON.stringify(products)); }
function loadProducts() { products = JSON.parse(localStorage.getItem('products')) || []; }
function renderProducts() {
    const list = document.getElementById('product-list');
    if(!list) return;
    list.innerHTML = '';
    products.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'list-item text-sm';
        item.innerHTML = `<span>${p.desc_en || p.desc_ar} - <strong>${p.price}</strong></span><button class="delete-btn" data-index="${index}">&times;</button>`;
        list.appendChild(item);
    });
    list.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteProduct));
}
function addProduct() {
    const desc_en = document.getElementById('new-product-desc-en').value;
    const desc_ar = document.getElementById('new-product-desc-ar').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    if ((desc_en || desc_ar) && !isNaN(price)) {
        products.push({ desc_en, desc_ar, price });
        saveProducts();
        renderProducts();
        document.getElementById('new-product-desc-en').value = '';
        document.getElementById('new-product-desc-ar').value = '';
        document.getElementById('new-product-price').value = '';
    }
}
function deleteProduct(e) { products.splice(e.target.dataset.index, 1); saveProducts(); renderProducts(); }

function saveClients() { localStorage.setItem('clients', JSON.stringify(clients)); }
function loadClients() { clients = JSON.parse(localStorage.getItem('clients')) || []; }
function renderClients() {
    const list = document.getElementById('client-list');
    if(!list) return;
    list.innerHTML = '';
    clients.forEach((c, index) => {
        const item = document.createElement('div');
        item.className = 'list-item text-sm';
        item.innerHTML = `<span>${c.name_en || c.name_ar}</span><button class="delete-btn" data-index="${index}">&times;</button>`;
        list.appendChild(item);
    });
    list.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteClient));
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
        document.getElementById('new-client-name-en').value = '';
        document.getElementById('new-client-name-ar').value = '';
        document.getElementById('new-client-address-en').value = '';
        document.getElementById('new-client-address-ar').value = '';
    }
}
function deleteClient(e) { clients.splice(e.target.dataset.index, 1); saveClients(); renderClients(); }

// ===============================================
// MODALS
// ===============================================
const modal = document.getElementById('selection-modal'), modalTitle = document.getElementById('modal-title'), modalList = document.getElementById('modal-list'), modalSearch = document.getElementById('modal-search'), modalCloseBtn = document.getElementById('modal-close-btn');
let currentSelectionCallback = null;
function openModal(title, items, renderItem, onSelect) {
    modalTitle.textContent = title;
    currentSelectionCallback = onSelect;
    const render = (filter = '') => {
        modalList.innerHTML = '';
        items.forEach(item => {
            const itemText = renderItem(item).toLowerCase();
            if (itemText.includes(filter.toLowerCase())) {
                const el = document.createElement('div');
                el.className = 'modal-list-item';
                el.innerHTML = renderItem(item);
                el.onclick = () => { currentSelectionCallback(item); closeModal(); };
                modalList.appendChild(el);
            }
        });
    };
    render();
    modalSearch.value = '';
    modalSearch.onkeyup = () => render(modalSearch.value);
    modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }
modalCloseBtn.onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };
function closePreviewModal() { document.getElementById('pdf-preview-modal').classList.add('hidden'); }

async function generatePDF() {
    syncUIData();
    if (document.activeElement) document.activeElement.blur();
    const { jsPDF } = window.jspdf;
    const quoteElement = document.getElementById('print-area'); 
    const clone = quoteElement.cloneNode(true);
    
    clone.classList.remove('dark');
    clone.querySelectorAll('.placeholder-icon').forEach(icon => icon.parentElement.style.display = 'none');
    clone.style.width = '1024px';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);
    clone.querySelectorAll('input.quantity, input.unit-price').forEach(input => {
        const span = document.createElement('span');
        span.textContent = input.value;
        if(input.classList.contains('unit-price')) span.className = 'text-right w-full block';
        if(input.classList.contains('quantity')) span.className = 'text-center w-full block';
        input.parentNode.replaceChild(span, input);
    });
    clone.querySelectorAll('.no-print').forEach(el => el.remove());
    try {
        await new Promise(r => setTimeout(r, 200));
        const canvas = await html2canvas(clone, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png', 1.0);
        document.getElementById('pdf-preview-image').src = imgData;
        document.getElementById('pdf-preview-modal').classList.remove('hidden');
        document.getElementById('download-pdf-btn').onclick = () => {
            const customerName = document.querySelector('#editor-page .editable[data-field="customerName"]').textContent.trim().replace(/[^a-z0-9]/gi, '_');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = (contentWidth * canvas.height) / canvas.width;
            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
            pdf.save(`Quotation_${customerName||'details'}.pdf`);
            closePreviewModal();
        };
    } catch(e) {
        console.error("PDF generation failed:", e);
        alert("PDF generation failed.");
    } finally {
        document.body.removeChild(clone);
    }
}

// ===============================================
// APP INITIALIZATION
// ===============================================
function attachEditorEventListeners() {
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);
    document.getElementById('save-quote-btn').addEventListener('click', saveCurrentQuote);
    document.getElementById('preview-pdf-btn').addEventListener('click', generatePDF);
    document.getElementById('add-row').addEventListener('click', () => addNewRow());
    document.getElementById('add-product-btn').addEventListener('click', addProduct);
    document.getElementById('add-client-btn').addEventListener('click', addClient);
    document.querySelector('.load-customer-btn').addEventListener('click', () => {
         openModal('Select a Client', clients, (c) => `<strong>${c.name_en || c.name_ar}</strong>`, (client) => {
            const nameEl = document.querySelector('#editor-page .editable[data-field="customerName"]');
            const addressEl = document.querySelector('#editor-page .editable[data-field="customerAddress"]');
            nameEl.dataset.en = client.name_en; nameEl.dataset.ar = client.name_ar;
            addressEl.dataset.en = client.address_en; addressEl.dataset.ar = client.address_ar;
            setLanguage(currentLang);
        });
    });
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            button.classList.add('active');
            const tabId = `tab-${button.dataset.tab}`;
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
    document.querySelectorAll('#editor-page .editable').forEach(el => el.addEventListener('blur', syncUIData));
    
    document.getElementById('company-selector').addEventListener('change', (e) => {
        switchCompanyProfile(e.target.value);
    });

    renderProducts();
    renderClients();
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    loadAllQuotes();
    loadProducts();
    loadClients();
    
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.langSwitch));
    });

    document.getElementById('new-quote-btn').addEventListener('click', openCompanyModal);
    document.getElementById('close-company-modal-btn').addEventListener('click', closeCompanyModal);

    showDashboard();
});

