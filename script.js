// Attend que le DOM soit prêt pour exécuter le code.
document.addEventListener('DOMContentLoaded', () => {

  //==================================================
  // 1. DATA (Traductions)
  //==================================================
  const translations = {
    en: {
      app: { title: "Quotation Manager" },
      quote: { title: "Quotation", number_label: "Quote N°", date_label: "Date" },
      client: { name_label: "Client Name" },
      table: { item: "Item / Description", qty: "Qty", unit_price: "Unit Price", total: "Total", actions: "Actions" },
      totals: { subtotal: "Subtotal:", discount: "Discount:", vat: "VAT (15%):", grand_total: "Grand Total:" },
      actions: { add_item: "+ Add Item", save: "Save Changes", download_pdf: "Download PDF", delete_item: "Del" },
      toasts: { saved: "Quote saved successfully!", item_added: "New item added.", item_removed: "Item removed." }
    },
    ar: {
      app: { title: "مدير عروض الأسعار" },
      quote: { title: "عرض سعر", number_label: "رقم العرض", date_label: "التاريخ" },
      client: { name_label: "اسم العميل" },
      table: { item: "البيان / الوصف", qty: "الكمية", unit_price: "سعر الوحدة", total: "المجموع", actions: "إجراءات" },
      totals: { subtotal: "المجموع الفرعي:", discount: "الخصم:", vat: "ض.ق.م (15%):", grand_total: "المجموع الكلي:" },
      actions: { add_item: "+ إضافة بند", save: "حفظ التغييرات", download_pdf: "تحميل PDF", delete_item: "حذف" },
      toasts: { saved: "تم حفظ العرض بنجاح!", item_added: "تمت إضافة بند جديد.", item_removed: "تم حذف البند." }
    }
  };

  //==================================================
  // 2. STATE MANAGEMENT
  //==================================================
  const state = {
    lang: localStorage.getItem('language') || 'en',
    items: [
      { id: 1, desc: 'Product A', qty: 2, unitPrice: 50.00 },
      { id: 2, desc: 'Service B', qty: 10, unitPrice: 25.00 }
    ],
    discount: 0,
    vatRate: 0.15,
  };

  let nextItemId = 3;

  //==================================================
  // 3. CORE LOGIC (i18n, Calculations, Toasts)
  //==================================================

  // Fonction de traduction
  const t = (key) => key.split('.').reduce((acc, part) => acc && acc[part], translations[state.lang]) || key;

  // Fonction pour changer la langue
  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t(key);
      } else {
        el.textContent = t(key);
      }
    });
    // Rafraîchir l'UI après changement de langue
    renderTable(); 
  }

  // Fonction pour les calculs
  function computeTotals(items, discount, vatRate) {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const discountAmount = parseFloat(discount) || 0;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const vat = subtotalAfterDiscount * vatRate;
    const grandTotal = subtotalAfterDiscount + vat;
    return { subtotal, vat, grandTotal };
  }

  // Fonction pour afficher une notification (toast)
  function showToast(messageKey, type = 'info') {
    const host = document.getElementById('toast-host');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = t(messageKey);
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('fade-out');
      el.addEventListener('transitionend', () => el.remove());
    }, 2500);
  }

  //==================================================
  // 4. UI RENDERING & MANIPULATION
  //==================================================

  // Met à jour l'affichage des totaux
  function renderTotals() {
    const { subtotal, vat, grandTotal } = computeTotals(state.items, state.discount, state.vatRate);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('vat').textContent = vat.toFixed(2);
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
  }
  
  // Met à jour le tableau des produits
  function renderTable() {
    const tbody = document.getElementById('quote-items-body');
    tbody.innerHTML = ''; // Vide le tableau avant de le reconstruire
    state.items.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.itemId = item.id;
      const total = (item.qty * item.unitPrice).toFixed(2);

      row.innerHTML = `
        <td><input type="text" class="item-desc" value="${item.desc}"></td>
        <td><input type="number" class="item-qty" value="${item.qty}" min="1"></td>
        <td><input type="number" class="item-price" value="${item.unitPrice.toFixed(2)}" min="0"></td>
        <td>${total}</td>
        <td class="no-print"><button class="delete-btn">${t('actions.delete_item')}</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Met à jour toute l'interface
  function updateUI() {
    renderTable();
    renderTotals();
  }
  
  //==================================================
  // 5. EVENT LISTENERS
  //==================================================
  
  // Changement de langue
  document.getElementById('language-switcher').addEventListener('change', (e) => setLanguage(e.target.value));

  // Mode sombre
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
  });

  // Ajout d'un nouvel article
  document.getElementById('add-item-btn').addEventListener('click', () => {
    state.items.push({ id: nextItemId++, desc: '', qty: 1, unitPrice: 0 });
    updateUI();
    showToast('toasts.item_added', 'info');
  });

  // Modification dans le tableau (description, quantité, prix)
  document.getElementById('quote-items-body').addEventListener('input', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const itemId = parseInt(row.dataset.itemId);
    const item = state.items.find(i => i.id === itemId);

    if (e.target.classList.contains('item-desc')) item.desc = e.target.value;
    if (e.target.classList.contains('item-qty')) item.qty = parseFloat(e.target.value) || 0;
    if (e.target.classList.contains('item-price')) item.unitPrice = parseFloat(e.target.value) || 0;
    
    updateUI();
  });
  
  // Suppression d'un article
  document.getElementById('quote-items-body').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const row = e.target.closest('tr');
      const itemId = parseInt(row.dataset.itemId);
      state.items = state.items.filter(i => i.id !== itemId);
      updateUI();
      showToast('toasts.item_removed', 'error');
    }
  });

  // Modification de la remise
  document.getElementById('discount').addEventListener('input', (e) => {
    state.discount = parseFloat(e.target.value) || 0;
    renderTotals();
  });

  // Sauvegarde (simulation)
  document.getElementById('save-btn').addEventListener('click', () => {
    console.log("Saving state:", state);
    showToast('toasts.saved', 'success');
  });

  //==================================================
  // 6. INITIALIZATION
  //==================================================
  
  function init() {
    // Appliquer la langue initiale
    const savedLang = localStorage.getItem('language') || 'en';
    document.getElementById('language-switcher').value = savedLang;
    setLanguage(savedLang);

    // Mettre la date d'aujourd'hui par défaut
    document.getElementById('quote-date').valueAsDate = new Date();

    // Affichage initial de l'UI
    updateUI();
  }

  init(); // Démarrage de l'application !

});
