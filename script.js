// THEME SWITCH
const images = document.querySelectorAll(".gallery img");
const toggle = document.getElementById("themeToggle");

// SAQLANGAN THEME NI YUKLASH
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// BUTTON BOSILGANDA
if (toggle) {
  toggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };
}

// BOOKING FORM
