import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import AppIcon from "../components/AppIcon.jsx";
import PageShell from "../components/PageShell.jsx";
import { useManagedMeta } from "../hooks/useManagedMeta";
import {
  clearBookings,
  createBooking,
  createServerTimestamp,
  deleteBooking,
  firebaseServices,
  subscribeToBookings,
  updateBooking,
} from "../lib/firebase";
import {
  downloadCsv,
  formatSom,
  formatThousandSom,
  getTodayIsoDate,
} from "../lib/formatters";
import "../styles/admin.css";

const STATUS_LABELS = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  cancelled: "Bekor",
};

const STATUS_SELECT_STYLE = {
  padding: "4px 8px",
  borderRadius: "20px",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: "11px",
  fontWeight: 600,
  cursor: "pointer",
  outline: "none",
};

function getMonthlyCounts(bookings) {
  const counts = new Array(12).fill(0);
  const year = new Date().getFullYear();

  bookings.forEach((booking) => {
    if (!booking.received) {
      return;
    }

    const date = new Date(booking.received);

    if (date.getFullYear() === year) {
      counts[date.getMonth()] += 1;
    }
  });

  return counts;
}

function getPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function getNonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function getBookingRevenue(booking) {
  return getPositiveNumber(booking.guests) * getPositiveNumber(booking.pricePerGuest) * 1000;
}

function getFirebaseErrorMessage(error, fallback) {
  const message = error instanceof Error ? error.message : String(error || "");

  if (message.toLowerCase().includes("permission")) {
    return "Firebase ruxsat bermadi. Realtime Database Rules ichida bookings uchun read/write ruxsatini tekshiring.";
  }

  return message || fallback;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalForm, setModalForm] = useState({
    name: "",
    phone: "",
    date: "",
    guests: "",
    pricePerGuest: "",
    schoolChildren: "",
    kindergartenChildren: "",
    comment: "",
    status: "new",
  });

  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useManagedMeta({
    title: "Elite Dacha Admin",
    description: "Elite Dacha bronlar boshqaruv paneli.",
    path: "/admin",
  });

  useEffect(() => {
    setIsDark(localStorage.getItem("adminTheme") === "dark");

    return () => {
      document.body.classList.remove("admin-dark");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("admin-dark", isDark);
    localStorage.setItem("adminTheme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (!firebaseServices.ready) {
      setErrorMessage("Firebase ulanmagan. Avval konfiguratsiyani tekshiring.");
      setBookings([]);
      return undefined;
    }

    setErrorMessage("");
    return subscribeToBookings(
      (nextBookings) => {
        setBookings(nextBookings);
        setErrorMessage("");
      },
      (error) => {
        setErrorMessage(
          getFirebaseErrorMessage(error, "Bronlarni Firebase'dan o'qib bo'lmadi."),
        );
      },
    );
  }, []);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return bookings
      .filter((booking) => {
        const name = String(booking.name || "").toLowerCase();
        const phone = String(booking.phone || "");
        const matchesQuery =
          !normalizedQuery || name.includes(normalizedQuery) || phone.includes(normalizedQuery);
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        const matchesDate = !dateFilter || booking.date === dateFilter;
        return matchesQuery && matchesStatus && matchesDate;
      })
      .sort((left, right) => {
        const leftDate = Number(left.createdAt) || new Date(left.received || 0).getTime() || 0;
        const rightDate =
          Number(right.createdAt) || new Date(right.received || 0).getTime() || 0;
        return rightDate - leftDate;
      });
  }, [bookings, dateFilter, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      fresh: bookings.filter((booking) => booking.status === "new").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      guests: bookings.reduce(
        (sum, booking) => sum + (Number.parseInt(booking.guests, 10) || 0),
        0,
      ),
      revenue: bookings.reduce((sum, booking) => {
        if (booking.status === "cancelled") {
          return sum;
        }

        return sum + getBookingRevenue(booking);
      }, 0),
      schoolChildren: bookings.reduce(
        (sum, booking) => sum + getNonNegativeNumber(booking.schoolChildren),
        0,
      ),
      kindergartenChildren: bookings.reduce(
        (sum, booking) => sum + getNonNegativeNumber(booking.kindergartenChildren),
        0,
      ),
    }),
    [bookings],
  );

  const modalRevenue = useMemo(
    () => getPositiveNumber(modalForm.guests) * getPositiveNumber(modalForm.pricePerGuest) * 1000,
    [modalForm.guests, modalForm.pricePerGuest],
  );

  useEffect(() => {
    if (!chartCanvasRef.current) {
      return undefined;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#9ca3af" : "#6b7280";

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: "bar",
      data: {
        labels: ["Yan", "Feb", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
        datasets: [
          {
            label: "Bronlar soni",
            data: getMonthlyCounts(bookings),
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
              label: (context) => ` ${context.parsed.y} ta bron`,
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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [bookings, isDark]);

  const resetModalForm = () => {
    setModalForm({
      name: "",
      phone: "",
      date: "",
      guests: "",
      pricePerGuest: "",
      schoolChildren: "",
      kindergartenChildren: "",
      comment: "",
      status: "new",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    resetModalForm();
  };

  const openAddModal = () => {
    setEditId(null);
    resetModalForm();
    setIsModalOpen(true);
  };

  const openEditModal = (booking) => {
    setEditId(booking.firebaseKey);
    setModalForm({
      name: booking.name || "",
      phone: booking.phone || "",
      date: booking.date || "",
      guests: String(booking.guests || ""),
      pricePerGuest: String(booking.pricePerGuest || ""),
      schoolChildren: String(booking.schoolChildren || ""),
      kindergartenChildren: String(booking.kindergartenChildren || ""),
      comment: booking.comment || "",
      status: booking.status || "new",
    });
    setIsModalOpen(true);
  };

  const handleModalChange = (event) => {
    const { name, value } = event.target;
    setModalForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveModal = async () => {
    if (!modalForm.name || !modalForm.phone || !modalForm.date || !modalForm.guests) {
      window.alert("Iltimos, majburiy maydonlarni to'ldiring!");
      return;
    }

    const guests = getPositiveNumber(modalForm.guests);
    const pricePerGuest = getNonNegativeNumber(modalForm.pricePerGuest);
    const schoolChildren = getNonNegativeNumber(modalForm.schoolChildren);
    const kindergartenChildren = getNonNegativeNumber(modalForm.kindergartenChildren);

    if (guests <= 0) {
      window.alert("Mehmonlar soni kamida 1 bo'lishi kerak.");
      return;
    }

    if (schoolChildren + kindergartenChildren > guests) {
      window.alert("Bolalar soni jami mehmonlar sonidan ko'p bo'lmasligi kerak.");
      return;
    }

    const payload = {
      name: modalForm.name.trim(),
      phone: modalForm.phone.trim(),
      date: modalForm.date,
      guests,
      pricePerGuest,
      totalAmount: guests * pricePerGuest * 1000,
      schoolChildren,
      kindergartenChildren,
      comment: modalForm.comment.trim(),
      status: modalForm.status,
    };

    try {
      if (editId) {
        await updateBooking(editId, payload);
      } else {
        await createBooking({
          ...payload,
          received: getTodayIsoDate(),
          createdAt: createServerTimestamp(),
          source: "admin",
          tgMsgId: null,
        });
      }

      closeModal();
    } catch (error) {
      window.alert(getFirebaseErrorMessage(error, "Bronni saqlab bo'lmadi."));
    }
  };

  const handleStatusChange = async (firebaseKey, status) => {
    try {
      await updateBooking(firebaseKey, { status });
    } catch (error) {
      window.alert(getFirebaseErrorMessage(error, "Statusni yangilab bo'lmadi."));
    }
  };

  const handleDelete = async (booking) => {
    if (!window.confirm("Bu bronni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      await deleteBooking(booking.firebaseKey);

      if (!import.meta.env.DEV && booking.tgMsgId) {
        await fetch("/api/delete-telegram-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId: booking.tgMsgId }),
        }).catch(() => undefined);
      }
    } catch (error) {
      window.alert(getFirebaseErrorMessage(error, "Bronni o'chirib bo'lmadi."));
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Barcha bronlarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.",
      )
    ) {
      return;
    }

    try {
      await clearBookings();
    } catch (error) {
      window.alert(getFirebaseErrorMessage(error, "Bronlarni o'chirib bo'lmadi."));
    }
  };

  const handleExportCsv = () => {
    downloadCsv(`elite_dacha_bronlar_${getTodayIsoDate()}.csv`, [
      [
        "#",
        "Ism",
        "Telefon",
        "Sana",
        "Mehmonlar",
        "Odam boshiga narx (ming so'm)",
        "Jami daromad (so'm)",
        "Maktab bolalari",
        "Bog'cha bolalari",
        "Izoh",
        "Status",
        "Qabul qilingan",
      ],
      ...bookings.map((booking, index) => [
        index + 1,
        booking.name,
        booking.phone,
        booking.date,
        booking.guests,
        booking.pricePerGuest || 0,
        getBookingRevenue(booking),
        booking.schoolChildren || 0,
        booking.kindergartenChildren || 0,
        booking.comment || "",
        booking.status,
        booking.received,
      ]),
    ]);
  };

  return (
    <PageShell className="admin-page-shell">
      <div className="ap">
        <div className="ap-topbar">
          <span className="ap-title">
            <AppIcon name="home" /> Elite Dacha - Admin Panel
          </span>
          <div className="ap-topbar-actions">
            <button className="ap-btn primary" id="addBtn" onClick={openAddModal} type="button">
              <AppIcon name="plus" /> Bron qo'shish
            </button>
            <label className="ap-switch" id="adminTheme" title="Qorong'i rejim">
              <input
                checked={isDark}
                id="adminDarkToggle"
                onChange={() => setIsDark((current) => !current)}
                type="checkbox"
              />
              <span className="ap-slider" />
            </label>
            <button
              className="ap-btn danger"
              id="logoutBtn"
              onClick={() => {
                sessionStorage.removeItem("adminAuth");
                navigate("/");
              }}
              title="Chiqish"
              type="button"
            >
              <AppIcon name="signOut" /> Chiqish
            </button>
          </div>
        </div>

        <div className="ap-note">
          <AppIcon name="info" />
          Bronlar Firebase Realtime Database orqali real vaqt rejimida sinxronlanadi.
          Yangi bronlar avtomatik ro'yxatga tushadi va admin panel darhol yangilanadi.
        </div>

        <div className="ap-stats">
          <div className="ap-stat">
            <div className="ap-stat-n" id="s-total">
              {stats.total}
            </div>
            <div className="ap-stat-l">Jami bronlar</div>
          </div>
          <div className="ap-stat">
            <div className="ap-stat-n blue" id="s-new">
              {stats.fresh}
            </div>
            <div className="ap-stat-l">Yangi / kutilayotgan</div>
          </div>
          <div className="ap-stat">
            <div className="ap-stat-n green" id="s-confirmed">
              {stats.confirmed}
            </div>
            <div className="ap-stat-l">Tasdiqlangan</div>
          </div>
          <div className="ap-stat">
            <div className="ap-stat-n" id="s-guests">
              {stats.guests}
            </div>
            <div className="ap-stat-l">Jami mehmonlar</div>
          </div>
          <div className="ap-stat">
            <div className="ap-stat-n money" id="s-revenue">
              {formatSom(stats.revenue)}
            </div>
            <div className="ap-stat-l">Jami daromad</div>
          </div>
          <div className="ap-stat">
            <div className="ap-stat-n" id="s-children">
              {stats.schoolChildren} / {stats.kindergartenChildren}
            </div>
            <div className="ap-stat-l">Maktab / bog'cha bolalari</div>
          </div>
        </div>

        <div className="ap-chart-wrap">
          <div className="ap-chart-title">
            <AppIcon name="chartBar" /> Oylik bronlar statistikasi
          </div>
          <canvas height="100" id="bookingChart" ref={chartCanvasRef} />
        </div>

        <div className="ap-filters">
          <input
            className="ap-search"
            id="search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Ism yoki telefon bo'yicha qidirish..."
            value={searchQuery}
          />
          <select
            className="ap-select"
            id="filterStatus"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">Barcha statuslar</option>
            <option value="new">Yangi</option>
            <option value="confirmed">Tasdiqlangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
          <input
            className="ap-select"
            id="filterDate"
            onChange={(event) => setDateFilter(event.target.value)}
            title="Sana bo'yicha filter"
            type="date"
            value={dateFilter}
          />
          <button className="ap-btn" id="exportBtn" onClick={handleExportCsv} type="button">
            <AppIcon name="download" /> CSV
          </button>
          <button className="ap-btn danger" id="clearBtn" onClick={handleClearAll} type="button">
            <AppIcon name="trash" /> Hammasini o'chirish
          </button>
        </div>

        <div className="ap-table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Sana</th>
                <th>Mehmonlar</th>
                <th>Narx / kishi</th>
                <th>Daromad</th>
                <th>Bolalar</th>
                <th>Izoh</th>
                <th>Status</th>
                <th>Qabul qilingan</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody id="tbody">
              {filteredBookings.map((booking, index) => (
                <tr key={booking.firebaseKey}>
                  <td style={{ color: "var(--text-muted)" }}>{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{booking.name || ""}</td>
                  <td>
                    <a
                      className="phone-link"
                      href={`tel:${String(booking.phone || "").replace(/\s/g, "")}`}
                    >
                      {booking.phone || ""}
                    </a>
                  </td>
                  <td>{booking.date || ""}</td>
                  <td style={{ textAlign: "center" }}>{booking.guests || 0}</td>
                  <td>{formatThousandSom(booking.pricePerGuest)}</td>
                  <td>{formatSom(getBookingRevenue(booking))}</td>
                  <td>
                    Maktab: {booking.schoolChildren || 0}, Bog'cha:{" "}
                    {booking.kindergartenChildren || 0}
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    {booking.comment || "-"}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      onChange={(event) =>
                        handleStatusChange(booking.firebaseKey, event.target.value)
                      }
                      style={STATUS_SELECT_STYLE}
                      value={booking.status || "new"}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    {booking.received || ""}
                  </td>
                  <td style={{ display: "flex", gap: "5px" }}>
                    <button
                      className="ap-btn small"
                      onClick={() => openEditModal(booking)}
                      title="Tahrirlash"
                      type="button"
                    >
                      <AppIcon name="penSquare" />
                    </button>
                    <button
                      className="ap-btn small danger"
                      onClick={() => handleDelete(booking)}
                      title="O'chirish"
                      type="button"
                    >
                      <AppIcon name="trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="ap-empty"
            id="empty"
            style={{ display: filteredBookings.length === 0 ? "block" : "none" }}
          >
            {errorMessage || "Bronlar topilmadi."}
          </div>
        </div>
      </div>

      <div
        className={`ap-modal-bg${isModalOpen ? " open" : ""}`}
        id="modal"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <div className="ap-modal">
          <h3 id="modal-title">{editId ? "Bronni tahrirlash" : "Bron qo'shish"}</h3>

          <div className="ap-field">
            <label>Ism</label>
            <input
              id="m-name"
              name="name"
              onChange={handleModalChange}
              placeholder="To'liq ism"
              value={modalForm.name}
            />
          </div>
          <div className="ap-field">
            <label>Telefon</label>
            <input
              id="m-phone"
              name="phone"
              onChange={handleModalChange}
              placeholder="+998 __ ___ __ __"
              value={modalForm.phone}
            />
          </div>
          <div className="ap-field">
            <label>Sana</label>
            <input id="m-date" name="date" onChange={handleModalChange} type="date" value={modalForm.date} />
          </div>
          <div className="ap-field">
            <label>Mehmonlar soni</label>
            <input
              id="m-guests"
              max="75"
              min="1"
              name="guests"
              onChange={handleModalChange}
              placeholder="1-75"
              type="number"
              value={modalForm.guests}
            />
          </div>
          <div className="ap-field">
            <label>Odam boshiga narx (ming so'm)</label>
            <input
              id="m-price-per-guest"
              min="0"
              name="pricePerGuest"
              onChange={handleModalChange}
              placeholder="Masalan: 150"
              type="number"
              value={modalForm.pricePerGuest}
            />
          </div>
          <div className="ap-field-row">
            <div className="ap-field">
              <label>Maktab bolalari</label>
              <input
                id="m-school-children"
                min="0"
                name="schoolChildren"
                onChange={handleModalChange}
                placeholder="0"
                type="number"
                value={modalForm.schoolChildren}
              />
            </div>
            <div className="ap-field">
              <label>Bog'cha bolalari</label>
              <input
                id="m-kindergarten-children"
                min="0"
                name="kindergartenChildren"
                onChange={handleModalChange}
                placeholder="0"
                type="number"
                value={modalForm.kindergartenChildren}
              />
            </div>
          </div>
          <div className="ap-calculated-total">
            Hisoblangan daromad: <strong>{formatSom(modalRevenue)}</strong>
          </div>
          <div className="ap-field">
            <label>Izoh</label>
            <input
              id="m-comment"
              name="comment"
              onChange={handleModalChange}
              placeholder="Ixtiyoriy izoh"
              value={modalForm.comment}
            />
          </div>
          <div className="ap-field">
            <label>Status</label>
            <select id="m-status" name="status" onChange={handleModalChange} value={modalForm.status}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="ap-modal-footer">
            <button className="ap-btn" id="cancelModal" onClick={closeModal} type="button">
              Bekor qilish
            </button>
            <button className="ap-btn primary" id="saveModal" onClick={handleSaveModal} type="button">
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
