// ===========================
//  KIRISH TEKSHIRUVI
//  sessionStorage da "granted" bo'lmasa
//  index.html ga qaytaradi
// ===========================
(function guardPage() {
  if (sessionStorage.getItem("adminAuth") !== "granted") {
    window.location.href = "index.html";
  }
})();

// ===========================
//  STORAGE KEY
// ===========================
const STORAGE_KEY = "elite_dacha_bookings";

// ===========================
//  STATE
// ===========================
let bookings = [];
let editId   = null;

// ===========================
//  DOM
// ===========================
const tbody        = document.getElementById("tbody");
const emptyDiv     = document.getElementById("empty");
const searchInput  = document.getElementById("search");
const filterSelect = document.getElementById("filterStatus");
const modal        = document.getElementById("modal");

// ===========================
//  INIT
// ===========================
function init() {
  loadFromStorage();
  if (bookings.length === 0) seedDemoData();
  updateStats();
  render();
  bindEvents();
}

// ===========================
//  STORAGE
// ===========================
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    bookings  = raw ? JSON.parse(raw) : [];
  } catch (e) { bookings = []; }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// ===========================
//  DEMO DATA
// ===========================


// ===========================
//  STATS
// ===========================
function updateStats() {
  document.getElementById("s-total").textContent  = bookings.length;
  document.getElementById("s-new").textContent    = bookings.filter(b => b.status === "new").length;
  document.getElementById("s-guests").textContent = bookings.reduce((s,b) => s + (parseInt(b.guests)||0), 0);
}

// ===========================
//  RENDER TABLE
// ===========================
function render() {
  const q  = searchInput.value.toLowerCase().trim();
  const st = filterSelect.value;

  const filtered = bookings
    .filter(b => {
      const matchQ  = !q  || b.name.toLowerCase().includes(q) || b.phone.includes(q);
      const matchSt = !st || b.status === st;
      return matchQ && matchSt;
    })
    .sort((a,b) => new Date(b.received) - new Date(a.received));

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.style.display = "block";
    return;
  }
  emptyDiv.style.display = "none";

  tbody.innerHTML = filtered.map((b,i) => {
    const lbl = b.status==="new" ? "Yangi" : b.status==="confirmed" ? "Tasdiqlangan" : "Bekor qilingan";
    return `
      <tr>
        <td style="color:#9ca3af">${i+1}</td>
        <td style="font-weight:600">${esc(b.name)}</td>
        <td><a class="phone-link" href="tel:${b.phone.replace(/\s/g,"")}">${esc(b.phone)}</a></td>
        <td>${b.date}</td>
        <td>${b.guests}</td>
        <td><span class="badge ${b.status}">${lbl}</span></td>
        <td style="color:#9ca3af">${b.received}</td>
        <td style="display:flex;gap:6px">
          <button class="ap-btn small" onclick="openEdit(${b.id})">✏️</button>
          <button class="ap-btn small danger" onclick="deleteRow(${b.id})">🗑</button>
        </td>
      </tr>`;
  }).join("");
}

// ===========================
//  EVENTS
// ===========================
function bindEvents() {
  searchInput.addEventListener("input", render);
  filterSelect.addEventListener("change", render);
  document.getElementById("addBtn").addEventListener("click", openAdd);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("cancelModal").addEventListener("click", closeModal);
  document.getElementById("saveModal").addEventListener("click", saveModal);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("adminAuth");
    window.location.href = "index.html";
  });
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}

// ===========================
//  MODAL
// ===========================
function openAdd() {
  editId = null;
  document.getElementById("modal-title").textContent = "Bron qo'shish";
  clearFields();
  modal.classList.add("open");
}

function openEdit(id) {
  const b = bookings.find(x => x.id === id);
  if (!b) return;
  editId = id;
  document.getElementById("modal-title").textContent = "Bronni tahrirlash";
  document.getElementById("m-name").value   = b.name;
  document.getElementById("m-phone").value  = b.phone;
  document.getElementById("m-date").value   = b.date;
  document.getElementById("m-guests").value = b.guests;
  document.getElementById("m-status").value = b.status;
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  editId = null;
}

function saveModal() {
  const name   = document.getElementById("m-name").value.trim();
  const phone  = document.getElementById("m-phone").value.trim();
  const date   = document.getElementById("m-date").value;
  const guests = document.getElementById("m-guests").value;
  const status = document.getElementById("m-status").value;

  if (!name || !phone || !date || !guests) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  const today = new Date().toISOString().slice(0,10);

  if (editId !== null) {
    const idx = bookings.findIndex(b => b.id === editId);
    if (idx >= 0) bookings[idx] = { ...bookings[idx], name, phone, date, guests, status };
  } else {
    const newId = bookings.length ? Math.max(...bookings.map(b=>b.id))+1 : 1;
    bookings.push({ id:newId, name, phone, date, guests, status, received:today });
  }

  saveToStorage(); updateStats(); render(); closeModal();
}

function deleteRow(id) {
  if (!confirm("Bu bronni o'chirishni xohlaysizmi?")) return;
  bookings = bookings.filter(b => b.id !== id);
  saveToStorage(); updateStats(); render();
}

function clearAll() {
  if (!confirm("Barcha bronlarni o'chirishni xohlaysizmi?")) return;
  bookings = [];
  saveToStorage(); updateStats(); render();
}

// ===========================
//  EXPORT CSV
// ===========================
function exportCSV() {
  const header = ["Ism","Telefon","Sana","Mehmonlar","Status","Qabul qilingan"];
  const rows   = bookings.map(b => [b.name,b.phone,b.date,b.guests,b.status,b.received]);
  const csv    = [header,...rows].map(r=>r.join(",")).join("\n");
  const blob   = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a");
  a.href=url; a.download="elite_dacha_bronlar.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ===========================
//  HELPERS
// ===========================
function clearFields() {
  ["m-name","m-phone","m-date","m-guests"].forEach(id => document.getElementById(id).value="");
  document.getElementById("m-status").value = "new";
}

function esc(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ===========================
//  START
// ===========================
init();