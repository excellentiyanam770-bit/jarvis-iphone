
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
    return `The time is ${new Date().toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}.`;
  }

  if (command.includes("date") || command.includes("today")) {
    return `Today is ${new Date().toLocaleDateString([], {weekday:"long", year:"numeric", month:"long", day:"numeric"})}.`;
  }

  if (command.includes("hello") || command.includes("hi jarvis")) {
    return "Hello. I am online and ready to assist you.";
  }

  if (command.includes("who are you")) {
    return "I am JARVIS, your personal assistant. I am ready to help you.";
  }

  if (command.includes("help")) {
    return "You can ask me for the time, today's date, or introduce yourself. My full artificial intelligence connection is still being developed.";
  }

  return "I received your instruction. My full artificial intelligence connection is not installed yet.";
}

// Wait for available voices
function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();

  return voices.find(voice =>
    voice.lang.toLowerCase() === "en-gb"
  ) || voices.find(voice =>
    voice.lang.toLowerCase().startsWith("en")
  ) || null;
}

// JARVIS speaking system
function speak(text) {
  if (!("speechSynthesis" in window)) {
    statusText.textContent = "Speech is not supported on this device.";
    return;
  }

  const synth = window.speechSynthesis;

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "en-GB";
  utterance.rate = 0.88;
  utterance.pitch = 0.95;
  utterance.volume = 1;

  const voice = getEnglishVoice();

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    statusText.textContent = "JARVIS is speaking...";
  };

  utterance.onend = () => {
    statusText.textContent = "Systems ready. Awaiting your instruction.";
  };

  utterance.onerror = event => {
    statusText.textContent = "Voice error: " + event.error;
  };

  synth.speak(utterance);
}

function processMessage(text) {
  if (!text.trim()) return;

  addMessage("user", text);
  input.value = "";

  statusText.textContent = "Processing instruction...";

  const reply = prototypeReply(text);

  setTimeout(() => {
    addMessage("jarvis", reply);
    speak(reply);
  }, 500);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  processMessage(input.value);
});

// Load voices when the browser provides them
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

function setupMicrophone() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    statusText.textContent = "Voice recognition is not supported here.";
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
    processMessage(transcript);
  };

  recognition.onerror = event => {
    statusText.textContent = "Microphone error: " + event.error;
    micBtn.textContent = "🎙️";
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.textContent = "🎙️";
  };
}

micBtn.addEventListener("click", () => {
  if (!recognition) setupMicrophone();

  if (!recognition) return;

  if (isListening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (error) {
      statusText.textContent = "Please wait and try again.";
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
