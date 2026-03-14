// ===========================
//  PAROL SOZLAMASI
//  Joriy parol: elite2026admin
//  O'zgartirish: konsolda btoa("yangi_parol")
//  natijani SECRET_HASH ga yozing
// ===========================
const SECRET_HASH = "ZWxpdGUyMDI2YWRtaW4=";

// ===========================
//  LOGIN TEKSHIRISH
// ===========================
function checkLogin() {
  const input = document.getElementById("loginInput").value;
  const err = document.getElementById("loginError");

  if (btoa(input) === SECRET_HASH) {
    // Ruxsat berildi → admin.html ga o't
    sessionStorage.setItem("adminAuth", "granted");
    window.location.href = "admin.html"; // ← bu yagona to'g'ri yo'l
  } else {
    err.style.display = "block";
    document.getElementById("loginInput").value = "";
    document.getElementById("loginInput").focus();
    setTimeout(() => {
      err.style.display = "none";
    }, 2000);
  }
}

// ===========================
//  SAHIFA OCHILGANDA:
//  Allaqachon login bo'lgan bo'lsa
//  to'g'ridan admin.html ga o't
// ===========================
(function guardPage() {
  if (sessionStorage.getItem("adminAuth") === "granted") {
    window.location.href = "admin.html";
  }
  // Aks holda login formasi ko'rinadi (HTML da display:flex)
})();
