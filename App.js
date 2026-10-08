// Axtrix-cdx V0.1 Beta
// App.js - Interfaz principal

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const app = $("app");
  const sidebar = $("sidebar");
  const menuBtn = $("menuBtn");
  const closeMenuBtn = $("closeMenuBtn");
  const newChatBtn = $("newChatBtn");
  const sendBtn = $("sendBtn");
  const userInput = $("userInput");
  const messages = $("messages");

  let sending = false;

  // =========================
  // MENÚ
  // =========================

  function openMenu() {
    if (sidebar) {
      sidebar.classList.add("open");
    }
  }

  function closeMenu() {
    if (sidebar) {
      sidebar.classList.remove("open");
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeMenu);
  }

  // =========================
  // MENSAJES
  // =========================

  function addMessage(text, type = "bot") {
    if (!messages) return;

    const message = document.createElement("div");
    message.className = `message ${type}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    bubble.textContent = text;

    message.appendChild(bubble);
    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  function addLoading() {
    return addMessage("Axtrix-cdx está pensando...", "bot");
  }

  // =========================
  // NUEVO CHAT
  // =========================

  function newChat() {
    if (messages) {
      messages.innerHTML = "";
    }

    if (userInput) {
      userInput.value = "";
      userInput.focus();
    }

    addMessage(
      "Hola, soy Axtrix-cdx. ¿Qué necesitas crear?",
      "bot"
    );

    closeMenu();
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", newChat);
  }

  // =========================
  // ENVIAR MENSAJE
  // =========================

  async function sendMessage() {
    if (sending || !userInput) return;

    const text = userInput.value.trim();

    if (!text) return;

    sending = true;

    userInput.value = "";
    userInput.style.height = "auto";

    addMessage(text, "user");

    const loading = addLoading();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("El servidor no devolvió una respuesta válida.");
      }

      if (!response.ok) {
        throw new Error(
          data?.error || `Error del servidor: ${response.status}`
        );
      }

      loading.remove();

      const reply =
        data?.reply ??
        data?.response ??
        data?.message ??
        data?.text;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("Axtrix-cdx no recibió texto del servidor.");
      }

      addMessage(reply, "bot");

    } catch (error) {
      console.error("Error de Axtrix-cdx:", error);

      loading.remove();

      addMessage(
        "⚠️ No pude conectar con el servidor de Axtrix-cdx todavía.",
        "bot"
      );
    } finally {
      sending = false;

      if (userInput) {
        userInput.focus();
      }
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // =========================
  // ENTER PARA ENVIAR
  // =========================

  if (userInput) {
    userInput.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        sendMessage();
      }
    });

    // Ajustar altura del cuadro de texto
    userInput.addEventListener("input", () => {
      userInput.style.height = "auto";
      userInput.style.height =
        Math.min(userInput.scrollHeight, 150) + "px";
    });
  }

  // =========================
  // BOTONES DE HERRAMIENTAS
  // =========================

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!userInput) return;

      const prompt = button.getAttribute("data-prompt");

      if (prompt) {
        userInput.value = prompt;
        userInput.focus();
      }

      closeMenu();
    });
  });

  // =========================
  // INICIO
  // =========================

  function start() {
    if (!messages) {
      console.warn("No se encontró #messages en Index.html");
      return;
    }

    addMessage(
      "Hola, soy Axtrix-cdx. Un asistente de inteligencia artificial creado para ayudarte a crear.",
      "bot"
    );
  }

  start();

})();
