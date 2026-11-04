
const form = document.querySelector("#chatForm");
const input = document.querySelector("#userInput");
const messages = document.querySelector("#messages");
const statusText = document.querySelector("#statusText");
const micBtn = document.querySelector("#micBtn");

let recognition;
let isListening = false;

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
    return "I am JARVIS, your personal assistant. My full AI brain is still being developed.";
  }

  if (command.includes("help")) {
    return "You can ask me the time, today's date, or say hello. Voice recognition is now available where your browser supports it.";
  }

  return "I have received your instruction. My live AI connection is not installed yet. I am still learning.";
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

function processMessage(text) {
  if (!text.trim()) return;

  addMessage("user", text);
  input.value = "";

  statusText.textContent = "Processing instruction…";

  const reply = prototypeReply(text);

  window.setTimeout(() => {
    addMessage("jarvis", reply);
    statusText.textContent = "Systems ready. Awaiting your instruction.";
    speak(reply);
  }, 450);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  processMessage(input.value);
});

function setupMicrophone() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    statusText.textContent = "Voice recognition is not supported in this browser.";
    addMessage("jarvis", "Sorry, voice recognition is not supported here. Please try Safari or another supported browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-GB";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    micBtn.textContent = "🔴";
    statusText.textContent = "Listening... Speak now.";
  };

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    processMessage(transcript);
  };

  recognition.onerror = event => {
    statusText.textContent = "Microphone error: " + event.error;
    micBtn.textContent = "🎙️";
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.textContent = "🎙️";

    if (statusText.textContent === "Listening... Speak now.") {
      statusText.textContent = "Systems ready. Awaiting your instruction.";
    }
  };
}

micBtn.addEventListener("click", () => {
  if (!recognition) {
    setupMicrophone();
  }

  if (!recognition) return;

  if (isListening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (error) {
      statusText.textContent = "Please wait and try the microphone again.";
    }
  }
});

document.querySelector("#clearBtn").addEventListener("click", () => {
  messages.replaceChildren();
  statusText.textContent = "Communication log cleared.";
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
