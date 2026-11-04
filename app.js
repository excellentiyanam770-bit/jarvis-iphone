const form = document.querySelector("#chatForm");
const input = document.querySelector("#userInput");
const messages = document.querySelector("#messages");
const statusText = document.querySelector("#statusText");
const micBtn = document.querySelector("#micBtn");

const JARVIS_URL =
  "https://jarvis-ai-brain.excellentiyanam770.workers.dev";

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

function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();

  return voices.find(v => v.lang.toLowerCase() === "en-gb")
    || voices.find(v => v.lang.toLowerCase().startsWith("en"))
    || null;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  utterance.pitch = 0.95;
  utterance.volume = 1;

  const voice = getEnglishVoice();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    statusText.textContent = "JARVIS is speaking...";
  };

  utterance.onend = () => {
    statusText.textContent = "Systems ready. Awaiting your instruction.";
  };

  synth.speak(utterance);
}

async function processMessage(text) {
  if (!text.trim()) return;

  addMessage("user", text);
  input.value = "";

  statusText.textContent = "JARVIS is thinking...";

  try {
    const response = await fetch(JARVIS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI connection failed.");
    }

    const reply = data.reply || "I couldn't generate a response.";

    addMessage("jarvis", reply);
    speak(reply);

  } catch (error) {
    const message = "I'm having trouble connecting to my AI brain. " +
      error.message;

    addMessage("jarvis", message);
    statusText.textContent = "Connection error. Please try again.";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  processMessage(input.value);
});

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

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
