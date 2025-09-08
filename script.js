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

// Appliquer l'icône correcte au chargement initial
applyTheme();
// ===============================================
// FIN : GESTION DU MODE SOMBRE (DARK MODE)
// ===============================================


// ===============================================
// FONCTIONS DU TABLEAU DE BORD (DASHBOARD)
// ===============================================
function renderDashboard() {
    // ... (votre fonction existante, mais avec le HTML corrigé ci-dessous)
    const container = document.getElementById('quote-list-container');
    if (savedQuotes.length === 0) {
        // CORRIGÉ : Ajout des classes de texte pour le mode sombre
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
        // ... (votre logique existante) ...
        // CORRIGÉ : Ajout des classes de texte pour le mode sombre
        item.innerHTML = `
            <div>
                <p class="font-bold text-slate-800 dark:text-slate-100">${clientName}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">${quoteNum}</p>
            </div>
            <span class="text-slate-600 dark:text-slate-300">${date}</span>
            <span class="font-semibold text-slate-800 dark:text-slate-100">${total} SAR</span>
            <div class="quote-actions">
                <button class="load-btn" onclick="loadQuoteForEditing('${quote.meta.id}')">Edit</button>
                <button class="delete-quote-btn" onclick="deleteQuote('${quote.meta.id}')">Delete</button>
            </div>`;
        list.appendChild(item);
    });
}

// ... (le reste de votre code JavaScript existant reste identique) ...
