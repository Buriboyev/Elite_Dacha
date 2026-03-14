// ===========================
//  PAROL SOZLAMASI
//  Joriy parol: elite2026admin
//  O'zgartirish: konsolda btoa("yangi_parol")
//  natijani SECRET_HASH ga yozing
// ===========================
const SECRET_HASH = 'cXdlcnR5MTUxNQ==';

// ===========================
//  LOGIN TEKSHIRISH
// ===========================
function checkLogin() {
  const input = document.getElementById("loginInput").value;
  const err   = document.getElementById("loginError");

  if (btoa(input) === SECRET_HASH) {
    // URL token bilan admin.html ga o't — GitHub Pages da ham ishlaydi
    const token = btoa("elite2026admin" + new Date().toDateString());
    window.location.href = "admin.html?auth=" + token;
  } else {
    err.style.display = "block";
    document.getElementById("loginInput").value = "";
    document.getElementById("loginInput").focus();
    setTimeout(() => { err.style.display = "none"; }, 2000);
  }
}

// ===========================
//  SAHIFA OCHILGANDA:
//  Allaqachon login bo'lgan bo'lsa
//  to'g'ridan admin.html ga o't
// ===========================
(function guardPage() {
  if (sessionStorage.getItem("adminAuth") === "granted") {
    const token = btoa("elite2026admin" + new Date().toDateString());
    window.location.href = "admin.html?auth=" + token;
  }
})();
