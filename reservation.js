const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {
  let numbers = phoneInput.value.replace(/\D/g, "");

  if (!numbers.startsWith("998")) {
    numbers = "998" + numbers;
  }

  numbers = numbers.substring(0, 12);

  let formatted = "+998 ";

  if (numbers.length > 3) {
    formatted += numbers.substring(3, 5);
  }

  if (numbers.length >= 6) {
    formatted += " " + numbers.substring(5, 8);
  }

  if (numbers.length >= 9) {
    formatted += " " + numbers.substring(8, 10);
  }

  if (numbers.length >= 11) {
    formatted += " " + numbers.substring(10, 12);
  }

  phoneInput.value = formatted;
});

const TOKEN = "7439506932:AAFvrYTvLEnlRd1_QTKtruU2NHedVamdKWk"
const CHAT_ID = "-1003768294685"

const form = document.getElementById("bookingForm")

form.addEventListener("submit",(e)=>{

e.preventDefault()

let name = form[0].value
let phone = form[1].value
let date = form[2].value
let message = form[3].value

let text = `
🟢 Yangi bron!

👤 Ism: ${name}
📞 Telefon: ${phone}
📅 Sana: ${date}
💬 Xabar: ${message}
`

fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

chat_id:CHAT_ID,
text:text

})

})

.then(()=>{

alert("Bron yuborildi!")

form.reset()

})

.catch(()=>{

alert("Xatolik yuz berdi")

})

})
flatpickr("#date", {
dateFormat: "Y-m-d",
minDate: "today"
})