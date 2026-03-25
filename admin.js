// =====================
//  AUTH GUARD
// =====================

// ===========================
//  TELEGRAM CONFIG
//  Xabarni o'chirish uchun kerak
// ===========================
const TG_TOKEN = "7439506932:AAFvrYTvLEnlRd1_QTKtruU2NHedVamdKWk";
const TG_CHAT_ID = "-1003768294685";
const firebaseServices = window.firebaseServices || {};
const bookingsRef = firebaseServices.bookingsRef || null;

// =====================
//  DARK MODE
// =====================
const adminDarkToggle = document.getElementById("adminDarkToggle");
if (adminDarkToggle) {
  const saved = localStorage.getItem("adminTheme");
  if (saved === "dark") {
    document.body.classList.add("admin-dark");
    adminDarkToggle.checked = true;
  }
  adminDarkToggle.addEventListener("change", () => {
    document.body.classList.toggle("admin-dark", adminDarkToggle.checked);
    localStorage.setItem(
      "adminTheme",
      adminDarkToggle.checked ? "dark" : "light",
    );
    renderChart();
  });
}

// =====================
//  STATE
// =====================
let bookings = [];
let editId = null;
let chartInstance = null;

// =====================
//  DOM
// =====================
const tbody = document.getElementById("tbody");
const emptyDiv = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filterStatus");
const filterDate = document.getElementById("filterDate");
const modal = document.getElementById("modal");

// =====================
//  INIT
// =====================
function init() {
  bindEvents();
  subscribeBookings();
}

// =====================
//  FIREBASE SUBSCRIBE
// =====================
function subscribeBookings() {
  if (!firebaseServices.ready || !bookingsRef) {
    emptyDiv.style.display = "block";
    emptyDiv.textContent =
      "Firebase ulanmagan. Avval firebase-config.js faylini to'ldiring.";
    return;
  }

  bookingsRef.on("value", (snapshot) => {
    const raw = snapshot.val() || {};
    bookings = Object.entries(raw).map(([firebaseKey, value]) => ({
      firebaseKey,
      ...value,
    }));
    updateStats();
    render();
    renderChart();
  });
}

// =====================
//  STATS
// =====================
function updateStats() {
  document.getElementById("s-total").textContent = bookings.length;
  document.getElementById("s-new").textContent = bookings.filter(
    (b) => b.status === "new",
  ).length;
  document.getElementById("s-confirmed").textContent = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  document.getElementById("s-guests").textContent = bookings.reduce(
    (sum, booking) => sum + (parseInt(booking.guests, 10) || 0),
    0,
  );
}

// =====================
//  CHART
// =====================
function renderChart() {
  const canvas = document.getElementById("bookingChart");
  if (!canvas || typeof Chart === "undefined") return;

  const months = [
    "Yan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Iyn",
    "Iyl",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
  ];
  const counts = new Array(12).fill(0);
  const year = new Date().getFullYear();

  bookings.forEach((booking) => {
    if (!booking.received) return;
    const date = new Date(booking.received);
    if (date.getFullYear() === year) counts[date.getMonth()] += 1;
  });

  const isDark = document.body.classList.contains("admin-dark");
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#9ca3af" : "#6b7280";

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Bronlar soni",
          data: counts,
          backgroundColor: "rgba(0,184,148,0.7)",
          borderColor: "#00b894",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} ta bron`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 12 } },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, stepSize: 1, font: { size: 12 } },
          grid: { color: gridColor },
        },
      },
    },
  });
}

// =====================
//  RENDER TABLE
// =====================
function render() {
  const q = searchInput.value.toLowerCase().trim();
  const st = filterSelect.value;
  const fd = filterDate ? filterDate.value : "";

  const filtered = bookings
    .filter((booking) => {
      const name = (booking.name || "").toLowerCase();
      const phone = booking.phone || "";
      const matchQ = !q || name.includes(q) || phone.includes(q);
      const matchSt = !st || booking.status === st;
      const matchFd = !fd || booking.date === fd;
      return matchQ && matchSt && matchFd;
    })
    .sort((a, b) => {
      const dateA = Number(a.createdAt) || new Date(a.received || 0).getTime();
      const dateB = Number(b.createdAt) || new Date(b.received || 0).getTime();
      return dateB - dateA;
    });

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.style.display = "block";
    return;
  }
  emptyDiv.style.display = "none";

  tbody.innerHTML = filtered
    .map((booking, index) => {
      return `
      <tr>
        <td style="color:var(--text-muted)">${index + 1}</td>
        <td style="font-weight:600">${esc(booking.name || "")}</td>
        <td><a class="phone-link" href="tel:${(booking.phone || "").replace(/\s/g, "")}">${esc(booking.phone || "")}</a></td>
        <td>${esc(booking.date || "")}</td>
        <td style="text-align:center">${booking.guests || 0}</td>
        <td style="color:var(--text-muted);font-size:12px">${esc(booking.comment || "-")}</td>
        <td>
          <select class="status-select" onchange="changeStatus('${booking.firebaseKey}', this.value)">
            <option value="new" ${booking.status === "new" ? "selected" : ""}>Yangi</option>
            <option value="confirmed" ${booking.status === "confirmed" ? "selected" : ""}>Tasdiqlangan</option>
            <option value="cancelled" ${booking.status === "cancelled" ? "selected" : ""}>Bekor</option>
          </select>
        </td>
        <td style="color:var(--text-muted);font-size:12px">${esc(booking.received || "")}</td>
        <td style="display:flex;gap:5px">
          <button class="ap-btn small" onclick="openEdit('${booking.firebaseKey}')" title="Tahrirlash">✏️</button>
          <button class="ap-btn small danger" onclick="deleteRow('${booking.firebaseKey}')" title="O'chirish">🗑️</button>
        </td>
      </tr>`;
    })
    .join("");

  document.querySelectorAll(".status-select").forEach((select) => {
    select.style.cssText =
      "padding:4px 8px;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;outline:none;";
  });
}

// =====================
//  STATUS INLINE CHANGE
// =====================
async function changeStatus(firebaseKey, status) {
  if (!bookingsRef || !firebaseKey) return;
  await bookingsRef.child(firebaseKey).update({ status });
}

// =====================
//  EVENTS
// =====================
function bindEvents() {
  searchInput.addEventListener("input", render);
  filterSelect.addEventListener("change", render);
  if (filterDate) filterDate.addEventListener("change", render);

  document.getElementById("addBtn").addEventListener("click", openAdd);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("cancelModal").addEventListener("click", closeModal);
  document.getElementById("saveModal").addEventListener("click", saveModal);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Admin paneldan chiqmoqchimisiz?")) {
        sessionStorage.removeItem("adminAuth");
        window.location.href = "./index.html";
      }
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

// =====================
//  MODAL
// =====================
function openAdd() {
  editId = null;
  document.getElementById("modal-title").textContent = "Bron qo'shish";
  clearFields();
  modal.classList.add("open");
}

function openEdit(firebaseKey) {
  const booking = bookings.find((item) => item.firebaseKey === firebaseKey);
  if (!booking) return;

  editId = firebaseKey;
  document.getElementById("modal-title").textContent = "Bronni tahrirlash";
  document.getElementById("m-name").value = booking.name || "";
  document.getElementById("m-phone").value = booking.phone || "";
  document.getElementById("m-date").value = booking.date || "";
  document.getElementById("m-guests").value = booking.guests || "";
  document.getElementById("m-comment").value = booking.comment || "";
  document.getElementById("m-status").value = booking.status || "new";
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  editId = null;
}

function saveModal() {
  const name = document.getElementById("m-name").value.trim();
  const phone = document.getElementById("m-phone").value.trim();
  const date = document.getElementById("m-date").value;
  const guests = document.getElementById("m-guests").value;
  const comment = document.getElementById("m-comment").value.trim();
  const status = document.getElementById("m-status").value;

  if (!name || !phone || !date || !guests) {
    alert("Iltimos, majburiy maydonlarni to'ldiring!");
    return;
  }

  if (!bookingsRef) return;

  const payload = {
    name,
    phone,
    date,
    guests: Number(guests),
    comment,
    status,
  };

  if (editId !== null) {
    bookingsRef.child(editId).update(payload);
  } else {
    bookingsRef.push({
      ...payload,
      received: new Date().toISOString().slice(0, 10),
      createdAt: firebaseServices.serverTimestamp,
      source: "admin",
      tgMsgId: null,
    });
  }

  closeModal();
}

async function deleteRow(firebaseKey) {
  if (!confirm("Bu bronni o'chirishni xohlaysizmi?")) return;

  const booking = bookings.find((item) => item.firebaseKey === firebaseKey);

  if (bookingsRef && firebaseKey) {
    await bookingsRef.child(firebaseKey).remove();
  }

  if (booking?.tgMsgId) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TG_TOKEN}/deleteMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            message_id: booking.tgMsgId,
          }),
        },
      );
      const data = await res.json();
      if (!data.ok) {
        console.warn("Telegram xabar o'chirilmadi:", data.description);
      }
    } catch (err) {
      console.warn("Telegram ulanish xatosi:", err.message);
    }
  }
}

function clearAll() {
  if (
    !confirm(
      "Barcha bronlarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.",
    )
  )
    return;
  if (bookingsRef) bookingsRef.remove();
}

// =====================
//  EXPORT CSV
// =====================
function exportCSV() {
  const header = [
    "#",
    "Ism",
    "Telefon",
    "Sana",
    "Mehmonlar",
    "Izoh",
    "Status",
    "Qabul qilingan",
  ];
  const rows = bookings.map((booking, index) => [
    index + 1,
    booking.name,
    booking.phone,
    booking.date,
    booking.guests,
    booking.comment || "",
    booking.status,
    booking.received,
  ]);
  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `elite_dacha_bronlar_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// =====================
//  HELPERS
// =====================
function clearFields() {
  ["m-name", "m-phone", "m-date", "m-guests", "m-comment"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("m-status").value = "new";
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// =====================
//  START
// =====================
init();
