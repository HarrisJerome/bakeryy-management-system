/**
 * Bakery - Admin panel: CRUD, sales report, settings
 */

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const menuForm = document.getElementById('menuForm');
const menuTableBody = document.getElementById('menuTableBody');
const editId = document.getElementById('editId');
const itemName = document.getElementById('itemName');
const itemPrice = document.getElementById('itemPrice');
const itemImage = document.getElementById('itemImage');
const itemCategory = document.getElementById('itemCategory');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const reportMonth = document.getElementById('reportMonth');
const reportYear = document.getElementById('reportYear');
const btnLoadReport = document.getElementById('btnLoadReport');
const reportSummary = document.getElementById('reportSummary');
const reportTableBody = document.getElementById('reportTableBody');
const reportEmpty = document.getElementById('reportEmpty');
const btnCopyReport = document.getElementById('btnCopyReport');
const btnPrintReport = document.getElementById('btnPrintReport');
const upiId = document.getElementById('upiId');
const qrImageUrl = document.getElementById('qrImageUrl');
const btnSaveSettings = document.getElementById('btnSaveSettings');
const deleteModal = document.getElementById('deleteModal');
const deleteItemName = document.getElementById('deleteItemName');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const btnCancelDelete = document.getElementById('btnCancelDelete');

const btnResetMenu = document.getElementById('btnResetMenu');
let deleteTargetId = null;

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
    if (tab === 'report') {
      populateReportSelects();
    } else if (tab === 'settings') {
      loadSettings();
    }
  });
});

// Populate month/year selects
function populateReportSelects() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  reportMonth.innerHTML = months.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
  reportYear.innerHTML = '';
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y--) {
    reportYear.innerHTML += `<option value="${y}">${y}</option>`;
  }
}

// ========== CRUD ==========
function renderMenuTable() {
  const menu = getMenu();
  menuTableBody.innerHTML = menu.map(item => `
    <tr>
      <td><img src="${item.image || 'https://via.placeholder.com/50?text=No+Img'}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td>${item.category || '-'}</td>
      <td>
        <button type="button" class="btn-edit" data-id="${item.id}">Edit</button>
        <button type="button" class="btn-delete" data-id="${item.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  menuTableBody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => editItem(btn.dataset.id));
  });
  menuTableBody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => showDeleteModal(btn.dataset.id));
  });
}

function editItem(id) {
  const menu = getMenu();
  const item = menu.find(m => m.id === id);
  if (!item) return;
  editId.value = id;
  itemName.value = item.name;
  itemPrice.value = item.price;
  itemImage.value = item.image || '';
  itemCategory.value = item.category || '';
  btnSave.textContent = 'Update Item';
}

function resetForm() {
  editId.value = '';
  itemName.value = '';
  itemPrice.value = '';
  itemImage.value = '';
  itemCategory.value = '';
  btnSave.textContent = 'Add Item';
}

menuForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const menu = getMenu();
  const id = editId.value;
  const data = {
    name: itemName.value.trim(),
    price: parseInt(itemPrice.value, 10),
    image: itemImage.value.trim() || undefined,
    category: itemCategory.value.trim() || undefined
  };

  if (id) {
    const idx = menu.findIndex(m => m.id === id);
    if (idx >= 0) {
      menu[idx] = { ...menu[idx], ...data };
    }
  } else {
    menu.push({
      id: generateId(),
      ...data
    });
  }
  setMenu(menu);
  renderMenuTable();
  resetForm();
});

btnCancel.addEventListener('click', resetForm);

function showDeleteModal(id) {
  const menu = getMenu();
  const item = menu.find(m => m.id === id);
  if (!item) return;
  deleteTargetId = id;
  deleteItemName.textContent = `Delete "${item.name}"?`;
  deleteModal.classList.add('active');
}

function hideDeleteModal() {
  deleteTargetId = null;
  deleteModal.classList.remove('active');
}

btnConfirmDelete.addEventListener('click', () => {
  if (!deleteTargetId) return;
  const menu = getMenu().filter(m => m.id !== deleteTargetId);
  setMenu(menu);
  renderMenuTable();
  hideDeleteModal();
});

btnCancelDelete.addEventListener('click', hideDeleteModal);
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) hideDeleteModal();
});

btnResetMenu.addEventListener('click', () => {
  if (confirm('Reset menu to default items? This will replace all current menu items.')) {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    getMenu(); // Re-seeds with DEFAULT_MENU
    renderMenuTable();
    alert('Menu reset to default items');
  }
});

// ========== Sales Report ==========
function loadReport() {
  const month = parseInt(reportMonth.value, 10);
  const year = parseInt(reportYear.value, 10);
  const orders = getOrders();
  const filtered = orders.filter(o => {
    const d = new Date(o.timestamp || o.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  reportEmpty.classList.add('hidden');
  reportSummary.classList.remove('visible');

  if (filtered.length === 0) {
    reportEmpty.textContent = 'No sales data for this month';
    reportEmpty.classList.remove('hidden');
    reportTableBody.innerHTML = '';
    return;
  }

  const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
  reportSummary.innerHTML = `
    <p><strong>Total Orders:</strong> ${filtered.length}</p>
    <p><strong>Total Revenue:</strong> ₹${totalRevenue}</p>
  `;
  reportSummary.classList.add('visible');

  reportTableBody.innerHTML = filtered.map(o => `
    <tr>
      <td>${new Date(o.timestamp || o.date).toLocaleDateString()}</td>
      <td>${o.id.slice(-6)}</td>
      <td>${(o.items || []).map(i => `${i.name} x${i.quantity}`).join(', ') || '-'}</td>
      <td>₹${o.total}</td>
    </tr>
  `).join('');
}

btnLoadReport.addEventListener('click', loadReport);

btnCopyReport.addEventListener('click', () => {
  const rows = reportTableBody.querySelectorAll('tr');
  if (rows.length === 0) return;
  const text = Array.from(rows).map(row =>
    Array.from(row.cells).map(c => c.textContent).join('\t')
  ).join('\n');
  const summary = reportSummary.textContent || '';
  navigator.clipboard.writeText(summary + '\n\n' + text).then(() => {
    alert('Report copied to clipboard');
  }).catch(() => alert('Copy failed'));
});

btnPrintReport.addEventListener('click', () => {
  if (reportTableBody.querySelectorAll('tr').length === 0) {
    alert('Load a report first');
    return;
  }
  window.print();
});

// ========== Settings ==========
function loadSettings() {
  const s = getSettings();
  upiId.value = s.upiId || '';
  qrImageUrl.value = s.qrImageUrl || '';
}

btnSaveSettings.addEventListener('click', () => {
  setSettings({
    upiId: upiId.value.trim(),
    qrImageUrl: qrImageUrl.value.trim()
  });
  alert('Settings saved');
});

// Init
renderMenuTable();
populateReportSelects();
