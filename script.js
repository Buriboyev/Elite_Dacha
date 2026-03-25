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
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children in same parent
        const siblings = [...entry.target.parentElement.querySelectorAll(".reveal:not(.visible)")];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, Math.min(delay, 300));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
})();

// =====================
//  STATS COUNTER
// =====================
(function initStats() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-target");
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current) + (target >= 100 ? "+" : "");
          if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ===========================
//  BURGER MENU
//  Tepadan pastga tushuvchi
//  iOS 26 glass nav
// ===========================
(function initBurger() {
  const burgerBtn  = document.getElementById("burgerBtn");
  const mainNav    = document.getElementById("mainNav");
  const navOverlay = document.getElementById("navOverlay");

  if (!burgerBtn || !mainNav) return;

  function openNav() {
    mainNav.classList.add("open");
    burgerBtn.classList.add("active");
    if (navOverlay) navOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    mainNav.classList.remove("open");
    burgerBtn.classList.remove("active");
    if (navOverlay) navOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    mainNav.classList.contains("open") ? closeNav() : openNav();
  });

  // Overlay bosishda yopiladi
  if (navOverlay) navOverlay.addEventListener("click", closeNav);

  // Nav ichidagi linkga bosishda yopiladi
  mainNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", closeNav)
  );

  // Esc tugmasi
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeNav();
  });

  // Katta ekranda yopiladi
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeNav();
  }, { passive: true });
})();

// ===========================
//  PARTICLES (hero canvas)
// ===========================
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, dots = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const N = Math.min(50, Math.floor(window.innerWidth / 24));
  for (let i = 0; i < N; i++) {
    dots.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      o: Math.random() * 0.45 + 0.18
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${0.11*(1-d/115)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${d.o})`;
      ctx.fill();
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();