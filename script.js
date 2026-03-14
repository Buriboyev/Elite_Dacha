// ===========================
//  THEME TOGGLE
// ===========================
const toggle = document.querySelector(".switch input");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// ===========================
//  SCROLL TOP — FOOTER MATNI
// ===========================
const scrollTop = document.getElementById("scrollTop");
if (scrollTop) {
  scrollTop.style.cursor = "pointer";
  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===========================
//  SCROLL TOP BUTTON (fixed)
// ===========================
const scrollBtn = document.getElementById("scrollTopBtn");
if (scrollBtn) {
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.scrollY > 200);
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===========================
//  MAXFIY ADMIN TRIGGER
//  Footer pastki o'ng burchak (60x60px yashirin zona)
//  3 soniya ichida 5 marta bosing → admin.html ga o'tadi
// ===========================
const adminTrigger = document.getElementById("adminSecretTrigger");

if (adminTrigger) {
  let tapCount = 0;
  let tapTimer = null;

  adminTrigger.addEventListener("click", () => {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= 5) {
      tapCount = 0;
      // Parolsiz to'g'ridan admin.html ga o'tadi
      sessionStorage.setItem("adminAuth", "granted");
      window.location.href = "admin.html";
      return;
    }

    // 3 soniya ichida bosilmasa, hisobni nolga qaytaradi
    tapTimer = setTimeout(() => { tapCount = 0; }, 3000);
  });
}
