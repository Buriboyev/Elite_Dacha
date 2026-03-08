const toggle = document.querySelector(".switch input");
let rotation = 0;
// SAQLANGAN THEME
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggle.textContent = "☀️";
} else {
  toggle.textContent = "🌙";
}

toggle.addEventListener("click", () => {

  // 360 gradus qo'shib boradi

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme","dark");
    toggle.textContent = "";
  } else {
    localStorage.setItem("theme","light");
    toggle.textContent = "🌙";
  }

});
const scrollTop = document.getElementById("scrollTop");

if(scrollTop){
  scrollTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
const scrollBtn = document.getElementById("scrollTopBtn");

// scroll bo'lganda tugma chiqadi
window.addEventListener("scroll", () => {

if(window.scrollY > 200){
scrollBtn.classList.add("show");
}else{
scrollBtn.classList.remove("show");
}

});

// tugma bosilganda tepaga chiqadi
scrollBtn.addEventListener("click", () => {

window.scrollTo({
top: 0,
behavior: "smooth"
});

});
