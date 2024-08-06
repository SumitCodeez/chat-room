const socket = io();
let timer;

const setbtn = document.querySelector(".setbtn");
const nameinput = document.querySelector(".nameinput");

const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const messageBox = document.querySelector(".messagebox");
const overlay = document.querySelector(".overlay");

document.querySelector(".send").addEventListener("click", function () {
  socket.emit("message", input.value);
  input.value = "";
});

let container = ``;
socket.on("message", function (message) {
  let myMessage = message.id === socket.id;
  container = `<div class="flex ${myMessage ? "justify-end" : "justify-start"}">
          <div class="${
            myMessage ? "bg-blue-600" : "bg-zinc-800"
          } text-white p-3 ${
    myMessage ? "rounded-l-lg rounded-br-lg" : "rounded-r-lg rounded-tl-lg"
  } ">
              <p class="text-sm">${message.name}: ${message.message}</p>
          </div>
      </div>`;

  messages.innerHTML += container;
  messageBox.scrollTop = messageBox.scrollHeight;
});

socket.on("namesetdone", function () {
  document.querySelector(".username").textContent = nameinput.value.trim();
  overlay.style.display = "none";
});

setbtn.addEventListener("click", function (e) {
  if (nameinput.value.trim().length > 0) {
    socket.emit("nameset", nameinput.value.trim());
  }
});
