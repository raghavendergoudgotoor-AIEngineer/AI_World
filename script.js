const messages = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const resetButton = document.querySelector("#resetButton");
const quickPrompts = document.querySelector("#quickPrompts");

let isReplying = false;
let replyTimer;

const replies = [
  {
    test: /\b(hi|hello|hey|hiya|howdy)\b/i,
    reply: "Hey there! I'm RAG chatbot. What's on your mind?"
  },
  {
    test: /\b(what can you|help me with|what do you do|capabilities)\b/i,
    reply: "I can help you brainstorm, make a quick plan, explain an idea, write a short message, or simply keep you company. Try asking me to plan your day!"
  },
  {
    test: /\b(plan|schedule|day|todo|to-do)\b/i,
    reply: "Let's make it manageable. Pick your three most important tasks, put the hardest one first, and leave a little breathing room between them. What do you need to get done?"
  },
  {
    test: /\b(fun|joke|laugh)\b/i,
    reply: "Tiny fun fact: sea otters hold hands while sleeping so they don't drift apart. Pretty strong teamwork for nap time."
  },
  {
    test: /\b(sad|upset|bad day|stressed|overwhelmed|anxious)\b/i,
    reply: "That sounds like a lot to carry. Let's shrink the moment: take one slow breath, then tell me the smallest thing that would make the next ten minutes easier."
  },
  {
    test: /\b(thanks|thank you|thx)\b/i,
    reply: "Anytime. I'm happy I could help!"
  },
  {
    test: /\b(bye|goodbye|see you)\b/i,
    reply: "See you soon! I'll be right here when you need me."
  }
];

const fallbackReplies = [
  "I hear you. Tell me a little more, and I'll help you think it through.",
  "That's interesting. What part would you like to explore first?",
  "Let's work on that together. What would a good outcome look like for you?",
  "Got it. If you give me one more detail, I can make my answer more useful."
];

function currentTime() {
  return new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function createMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;

  if (sender === "bot") {
    const avatar = document.createElement("span");
    avatar.className = "mini-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "✦";
    row.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const time = document.createElement("p");
  time.className = "message-time";
  time.textContent = currentTime();

  content.append(bubble, time);
  row.appendChild(content);
  messages.appendChild(row);
  scrollToLatest();
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot typing";
  row.id = "typingIndicator";
  row.innerHTML = `
    <span class="mini-avatar" aria-hidden="true">✦</span>
    <div class="message-content">
      <div class="bubble" aria-label="RAG chatbot is typing"><span></span><span></span><span></span></div>
    </div>`;
  messages.appendChild(row);
  scrollToLatest();
}

function getReply(text) {
  const matched = replies.find((item) => item.test.test(text));
  if (matched) return matched.reply;
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

function scrollToLatest() {
  messages.scrollTop = messages.scrollHeight;
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  sendButton.disabled = !input.value.trim() || isReplying;
}

function sendMessage(text) {
  const cleanText = text.trim();
  if (!cleanText || isReplying) return;

  createMessage(cleanText, "user");
  input.value = "";
  resizeInput();
  quickPrompts.hidden = true;
  isReplying = true;
  sendButton.disabled = true;
  showTyping();

  const delay = 650 + Math.min(cleanText.length * 8, 700);
  replyTimer = window.setTimeout(() => {
    document.querySelector("#typingIndicator")?.remove();
    createMessage(getReply(cleanText), "bot");
    isReplying = false;
    resizeInput();
    input.focus();
  }, delay);
}

function startConversation() {
  window.clearTimeout(replyTimer);
  [...messages.querySelectorAll(".message-row")].forEach((message) => message.remove());
  quickPrompts.hidden = false;
  isReplying = false;
  input.value = "";
  resizeInput();
  window.setTimeout(() => {
    createMessage("Hi! I'm RAG chatbot, your tiny chat companion. How can I help today?", "bot");
  }, 250);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

quickPrompts.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-prompt]");
  if (button) sendMessage(button.dataset.prompt);
});

resetButton.addEventListener("click", startConversation);

startConversation();
