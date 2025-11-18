/* ELEMENTOS */
const chatContainer = document.getElementById("chatbot-container");
const chatToggle = document.getElementById("chat-toggle");
const chatBody = document.getElementById("chat-body");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");

/* ✅ RESTAURAR ESTADO GUARDADO */
const savedChatOpen = localStorage.getItem("chatOpen");
const savedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");

/* ✅ Restaurar ventana abierta/cerrada */
if (savedChatOpen === "true") {
    chatContainer.style.display = "flex";
}

/* ✅ Restaurar mensajes anteriores */
savedMessages.forEach(msg => {
    addMessage(msg.sender, msg.text, false);
});

/* ABRIR / CERRAR CHAT */
chatToggle.addEventListener("click", () => {
    const isOpen = chatContainer.style.display === "flex";
    chatContainer.style.display = isOpen ? "none" : "flex";
    localStorage.setItem("chatOpen", !isOpen);
});

/* AGREGAR MENSAJE */
function addMessage(sender, text, save = true) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;

    /* ✅ Guardar en historial */
    if (save) {
        savedMessages.push({ sender, text });
        localStorage.setItem("chatMessages", JSON.stringify(savedMessages));
    }
}

/* RESPUESTAS DEL BOT */
function botReply(message) {
    message = message.toLowerCase();
    let reply = "No entiendo tu mensaje 😅. ¿Podrías reformularlo?";

    if (message.includes("hola") || message.includes("buenas"))
        reply = "¡Hola! 👋 ¿En qué puedo ayudarte hoy?";

    setTimeout(() => addMessage("bot", reply), 600);
}

/* ENVIAR MENSAJE */
sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    userInput.value = "";
    botReply(text);
});

userInput.addEventListener("keypress", e => { 
    if (e.key === "Enter") sendBtn.click();
});

/* MENSAJE DE BIENVENIDA SOLO SI NO EXISTE HISTORIAL */
if (savedMessages.length === 0) {
    setTimeout(() => addMessage("bot", "¡Hola! 👋 Soy PaleesBot, tu asistente virtual 🛍️"), 500);
    setTimeout(() => addMessage("bot", "¿Buscas algo en especial hoy? ✨"), 1200);
}
