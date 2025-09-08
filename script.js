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
