// ===========================
//  TELEFON FORMATI
// ===========================
const phoneInput = document.getElementById("phone");

function getSwalTheme() {
  return document.body.classList.contains("dark") ? "swal-dark" : "swal-light";
}

phoneInput.addEventListener("input", function () {
  let numbers = phoneInput.value.replace(/\D/g, "");

  if (!numbers.startsWith("998")) {
    numbers = "998" + numbers;
  }

  numbers = numbers.substring(0, 12);

  let formatted = "+998 ";

  if (numbers.length > 3) formatted += numbers.substring(3, 5);
  if (numbers.length >= 6) formatted += " " + numbers.substring(5, 8);
  if (numbers.length >= 9) formatted += " " + numbers.substring(8, 10);
  if (numbers.length >= 11) formatted += " " + numbers.substring(10, 12);

  phoneInput.value = formatted;
});

// ===========================
//  TELEGRAM YUBORISH
//  Token bu yerda ko'rinmaydi —
//  Cloudflare Worker (proxy) orqali yuboriladi.
//
//  SOZLASH:
//  1. https://workers.cloudflare.com/ ga kiring (bepul)
//  2. "Create Worker" tugmasini bosing
//  3. Quyidagi kodni worker ichiga joylashtiring:
//
//  ----------------------------------------
//  export default {
//    async fetch(request) {
//      if (request.method !== "POST") {
//        return new Response("Method not allowed", { status: 405 });
//      }
//      const body = await request.json();
//      const TOKEN = "7439506932:AAFvrYTvLEnlRd1_QTKtruU2NHedVamdKWk";
//      const CHAT_ID = "-1003768294685";
//      const response = await fetch(
//        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
//        {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({ chat_id: CHAT_ID, text: body.text }),
//        }
//      );
//      const data = await response.json();
//      return new Response(JSON.stringify(data), {
//        headers: {
//          "Content-Type": "application/json",
//          "Access-Control-Allow-Origin": "*",
//        },
//      });
//    },
//  };
//  ----------------------------------------
//
//  4. Worker URL ni oling (masalan: https://elite-dacha.YOUR_NAME.workers.dev)
//  5. Quyidagi PROXY_URL ni shu URL bilan almashtiring:
// ===========================
const PROXY_URL = "https://elite-dacha.YOUR_NAME.workers.dev";
//
// Agar hali Worker sozlamagan bo'lsangiz,
// vaqtinchalik to'g'ridan-to'g'ri yuborish uchun
// PROXY_URL ni "" (bo'sh) qoldiring —
// bu holda eski usul ishlatiladi (token ko'rinadi).
//
// Eslatma: token ko'rinmasligi uchun albatta Worker sozlang!
// ===========================

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
    // Proxy orqali yuborish (token yashirilgan)
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Yuborishda xatolik");

    // Admin panelga saqlash (localStorage)
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
    id:       saved.length ? Math.max(...saved.map((b) => b.id)) + 1 : 1,
    name,
    phone,
    date,
    guests,
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
