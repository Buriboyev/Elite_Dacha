// ===========================
//  TELEFON FORMATI
// ===========================
const phoneInput = document.getElementById("phone");

function getSwalTheme() {
  return document.body.classList.contains("dark") ? "swal-dark" : "swal-light";
}

phoneInput.addEventListener("input", function () {
  let numbers = phoneInput.value.replace(/\D/g, "");
  if (!numbers.startsWith("998")) numbers = "998" + numbers;
  numbers = numbers.substring(0, 12);
  let formatted = "+998 ";
  if (numbers.length > 3)  formatted += numbers.substring(3, 5);
  if (numbers.length >= 6) formatted += " " + numbers.substring(5, 8);
  if (numbers.length >= 9) formatted += " " + numbers.substring(8, 10);
  if (numbers.length >= 11) formatted += " " + numbers.substring(10, 12);
  phoneInput.value = formatted;
});

// ===========================
//  TELEGRAM TOKEN
//  (bu yerda ko'rinadi — yashirish uchun
//   Cloudflare Worker sozlang, lekin
//   hozircha to'g'ridan ishlaydi)
// ===========================
const TOKEN   = "7439506932:AAFvrYTvLEnlRd1_QTKtruU2NHedVamdKWk";
const CHAT_ID = "-1003768294685";

const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name   = document.getElementById("name").value.trim();
  const phone  = document.getElementById("phone").value.trim();
  const date   = document.getElementById("date").value;
  const guests = document.getElementById("guests").value;

  if (!date) {
    Swal.fire({ icon: "warning", title: "Sanani tanlang!" });
    return;
  }

  const text = `
🟢 Yangi bron!

👤 Ism: ${name}
📞 Telefon: ${phone}
📅 Sana: ${date}
👥 Odamlar soni: ${guests}
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    if (!response.ok) throw new Error("Telegram xatolik");

    // Admin panelga saqlash
    saveToAdmin({ name, phone, date, guests });

    Swal.fire({
      icon: "success",
      title: "Bron muvaffaqiyatli yuborildi!",
      text: "Tez orada siz bilan bog'lanamiz",
      confirmButtonText: "Bosh sahifaga o'tish",
      confirmButtonColor: "#16a34a",
      customClass: { popup: getSwalTheme() },
    }).then((result) => {
      if (result.isConfirmed) window.location.href = "index.html";
    });

    form.reset();

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Xatolik yuz berdi!",
      text: "Iltimos qayta urinib ko'ring",
      confirmButtonText: "Yopish",
      confirmButtonColor: "#dc2626",
      customClass: { popup: getSwalTheme() },
    });
  }
});

// ===========================
//  ADMIN PANELGA SAQLASH
// ===========================
function saveToAdmin({ name, phone, date, guests }) {
  const KEY   = "elite_dacha_bookings";
  const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
  const newEntry = {
    id:       saved.length ? Math.max(...saved.map(b => b.id)) + 1 : 1,
    name, phone, date, guests,
    status:   "new",
    received: new Date().toISOString().slice(0, 10),
  };
  saved.push(newEntry);
  localStorage.setItem(KEY, JSON.stringify(saved));
}

// ===========================
//  DATE PICKER
// ===========================
flatpickr("#date", {
  dateFormat: "Y-m-d",
  minDate: "today",
});
