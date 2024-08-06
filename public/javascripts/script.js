const socket = io();
let timer;

const setbtn = document.querySelector(".setbtn");
const nameinput = document.querySelector(".nameinput");

const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const messageBox = document.querySelector(".messagebox");
const overlay = document.querySelector(".overlay");

input.addEventListener("input", function (e) {
  socket.emit("typing");
});

socket.on("typing", function (name) {
  document.querySelector(".typing").textContent = `${name.name} is typing...`;
  clearTimeout(timer);
  timer = setTimeout(function () {
    document.querySelector(".typing").textContent = "";
  }, 1200);
});

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

socket.on("numberofusers", function (number) {
  document.querySelector(".onlineusers").textContent = number;
});

nameinput.addEventListener("input", function (e) {
  let newvalue;

  if (nameinput.value.trim().length > 0) {
    newvalue = nameinput.value.replace(" ", "_");
  } else {
    newvalue = "";
  }
  nameinput.value = newvalue;
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      const cursorPos = this.selectionStart;
      this.value =
        this.value.slice(0, cursorPos) + "\n" + this.value.slice(cursorPos);
      this.selectionStart = this.selectionEnd = cursorPos;
    } else {
      event.preventDefault();
      socket.emit("message", input.value);
      input.value = "";
    }
  }
});

setbtn.addEventListener("click", function (e) {
  if (nameinput.value.trim().length > 0) {
    socket.emit("nameset", nameinput.value.trim());
  }
});
