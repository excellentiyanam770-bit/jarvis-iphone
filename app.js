const form = document.querySelector("#chatForm");
const input = document.querySelector("#userInput");
const messages = document.querySelector("#messages");
const statusText = document.querySelector("#statusText");

function addMessage(who, text) {
  const article = document.createElement("article");
  article.className = `message ${who}`;
  const label = document.createElement("b");
  label.textContent = who === "jarvis" ? "JARVIS" : "YOU";
  const body = document.createElement("p");
  body.textContent = text;
  article.append(label, body);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
}

function prototypeReply(text) {
  const command = text.toLowerCase();
  if (command.includes("time")) {
    return `The time on this device is ${new Date().toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}.`;
  }
  if (command.includes("date") || command.includes("today")) {
    return `Today is ${new Date().toLocaleDateString([], {weekday:"long", year:"numeric", month:"long", day:"numeric"})}.`;
  }
  if (command.includes("hello") || command.includes("hi jarvis")) {
    return "Hello. It is good to hear from you. What would you like me to do?";
  }
  if (command.includes("who are you")) {
    return "I am JARVIS, your personal assistant prototype. My full AI brain will be connected in the next development stage.";
  }
  if (command.includes("help")) {
    return "You can ask me the time, today's date, or say hello. This first build is a visual and voice-output prototype; live AI and phone actions come next.";
  }
  return "I have received your instruction. My live AI connection is not installed yet, so I cannot intelligently process that request in this prototype. Try asking for the time, date, or help.";
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.94;
  utterance.pitch = 0.92;
  window.speechSynthesis.speak(utterance);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage("user", text);
  input.value = "";
  statusText.textContent = "Processing instruction…";
  const reply = prototypeReply(text);
  window.setTimeout(() => {
    addMessage("jarvis", reply);
    statusText.textContent = "Systems ready. Awaiting your instruction.";
    speak(reply);
  }, 450);
});

document.querySelector("#clearBtn").addEventListener("click", () => {
  messages.replaceChildren();
  statusText.textContent = "Communication log cleared.";
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
