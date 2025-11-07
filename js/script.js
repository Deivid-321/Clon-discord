// ==== INICIO ====

// Preguntar solo nombre de usuario
let currentUser = prompt("Elige tu nombre de usuario:", "Usuario") || "Usuario";
let currentAvatar = "🧑"; // Avatar fijo por defecto

// ==== DATOS PREDEFINIDOS ====
const defaultData = {
  "# general": [
    { avatar: "🧙‍♂️", user: "Mago", text: "¡Bienvenido al servidor! 🎉" },
    { avatar: "🐱", user: "Gato", text: "Hola a todos 😺" },
    { avatar: "🧑‍🚀", user: "Astronauta", text: "¿Listos para despegar? 🚀" }
  ],
  "# memes": [
    { avatar: "🧟", user: "Zombie", text: "🤣🤣🤣" },
    { avatar: "🐶", user: "Doge", text: "Such meme. Very wow. 🐕" }
  ],
  "# música": [
    { avatar: "🎧", user: "DJ", text: "¡Pongan sus canciones favoritas aquí! 🎵" },
    { avatar: "🎸", user: "Rocker", text: "🎸 Bohemian Rhapsody es una obra maestra" }
  ]
};

// ==== CARGAR O INICIALIZAR DATOS ====
let channelData = JSON.parse(localStorage.getItem("discordData")) || structuredClone(defaultData);

// ==== REFERENCIAS AL DOM ====
const channels = document.querySelectorAll('.channel');
const header = document.querySelector('.chat-header');
const messagesContainer = document.querySelector('.chat-messages');
const input = document.querySelector('.chat-input input');
const userBarAvatar = document.querySelector('.user-bar .avatar');
const userBarName = document.querySelector('.user-bar .username');

// ==== MOSTRAR AVATAR Y NOMBRE EN USER BAR ====
userBarAvatar.textContent = currentAvatar;
userBarName.textContent = currentUser;

// ==== BOTÓN DE LIMPIEZA ====
const resetButton = document.createElement('button');
resetButton.textContent = "🗑️ Limpiar chats";
resetButton.style.cssText = `
  background:#5865f2;
  color:white;
  border:none;
  padding:8px 12px;
  border-radius:4px;
  margin:10px;
  cursor:pointer;
  font-weight:bold;
`;
document.querySelector('.channels').appendChild(resetButton);

resetButton.addEventListener('click', () => {
  if (confirm("¿Seguro que quieres borrar todos los mensajes y reiniciar los canales?")) {
    localStorage.removeItem("discordData");
    channelData = structuredClone(defaultData);
    loadMessages(currentChannel);
  }
});

// ==== VARIABLES DE ESTADO ====
let currentChannel = "# general";

// ==== FUNCIONES ====
function saveToLocalStorage() {
  localStorage.setItem("discordData", JSON.stringify(channelData));
}

// Renderiza todos los mensajes de un canal
function loadMessages(channelName) {
  messagesContainer.innerHTML = '';
  const messages = channelData[channelName] || [];
  messages.forEach(msg => renderMessage(msg));
}

// Renderiza un mensaje individual
function renderMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = msg.avatar || "🧑";

  const content = document.createElement('div');
  content.classList.add('msg-content');

  const userEl = document.createElement('div');
  userEl.classList.add('msg-user');
  userEl.textContent = msg.user;

  const textEl = document.createElement('div');
  textEl.classList.add('msg-text');
  textEl.textContent = msg.text;

  content.appendChild(userEl);
  content.appendChild(textEl);
  div.appendChild(avatar);
  div.appendChild(content);

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==== NORMALIZADOR (quita tildes para comparar) ====
function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ==== FUNCIÓN AUXILIAR ====
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==== BOT Y PERSONAJES ====
function handleAutoResponses(text) {
  const raw = text || "";
  const norm = normalize(raw);

  let botMsg = null;

  // Detectar personaje al inicio (ej: "mago hola" o "@gato hola")
  const targetMatch = norm.match(/^(?:@)?(mago|gato|cocinero|chef|astronauta)\b/);
  let target = null;
  let contentAfterTarget = norm;

  if (targetMatch) {
    target = targetMatch[1];
    contentAfterTarget = norm.replace(targetMatch[0], "").trim();
  }

  // Palabras clave
  const saludarKW   = ["hola", "buenas", "buen dia", "buenas tardes", "buenas noches"];
  const comoEstasKW = ["como estas", "que tal", "como va", "que mas"];
  const chisteKW    = ["chiste", "broma"];
  const adiosKW     = ["adios", "chau", "chao", "hasta luego", "nos vemos"];
  const graciasKW   = ["gracias", "mil gracias", "muchas gracias"];
  const cocinaKW    = ["receta", "cocina", "comida", "hambre"];

  const includesAny = (kwList, src = norm) => kwList.some(kw => src.includes(kw));

  // === Personajes ===
  if (target) {
    if (target === "mago") {
      if (includesAny(chisteKW, contentAfterTarget)) {
        botMsg = { avatar: "🧙‍♂️", user: "Mago", text: "¿Por qué el mago no usa internet? ¡Porque prefiere los hechizos en vivo! 🪄😄" };
      } else if (includesAny(adiosKW, contentAfterTarget)) {
        botMsg = { avatar: "🧙‍♂️", user: "Mago", text: "Hasta luego, mortal. Que los vientos mágicos te acompañen. ✨" };
      } else if (includesAny(saludarKW, contentAfterTarget) || contentAfterTarget === "") {
        const frases = [
          "✨ ¡Abracadabra! ¿Qué deseas saber, aprendiz? 🪄",
          "Hmm... mi bola de cristal está nublada, pero veo código funcionando. 🔮",
          "¡Por las barbas de Merlín! ¿Quién osa invocar al mago? 🧙‍♂️",
          "He lanzado un hechizo para eliminar los bugs... cruzo los dedos 🧙‍♂️💻"
        ];
        botMsg = { avatar: "🧙‍♂️", user: "Mago", text: random(frases) };
      } else {
        botMsg = { avatar: "🧙‍♂️", user: "Mago", text: "El mago medita... ¡Interesante petición! 🔮" };
      }
    }

    else if (target === "gato") {
      if (includesAny(adiosKW, contentAfterTarget)) {
        botMsg = { avatar: "🐱", user: "Gato", text: "Miau... adiós humano. 🐾" };
      } else if (includesAny(saludarKW, contentAfterTarget) || contentAfterTarget === "") {
        const frases = [
          "Miau 😺, ¿me trajiste comida o solo conversación?",
          "Prrr... hora de la siesta. ¿Quieres acompañarme? 💤",
          "🐾 Si me ignoras, fingiré que no existes... y seguiré durmiendo ☀️"
        ];
        botMsg = { avatar: "🐱", user: "Gato", text: random(frases) };
      } else {
        botMsg = { avatar: "🐱", user: "Gato", text: "Miau... (traducción: ¿tienes atún?)" };
      }
    }

    else if (target === "cocinero" || target === "chef") {
      if (includesAny(adiosKW, contentAfterTarget)) {
        botMsg = { avatar: "👨‍🍳", user: "Cocinero", text: "¡Buen provecho! Vuelve cuando quieras por más recetas. 👋" };
      } else if (includesAny(cocinaKW, contentAfterTarget) || contentAfterTarget === "") {
        const frases = [
          "¡A cocinar se ha dicho! 👨‍🍳🔥",
          "El secreto de una buena receta es amor... y sal al gusto 😋",
          "¿Quieres mi receta secreta de lasagna? 🍝"
        ];
        botMsg = { avatar: "👨‍🍳", user: "Cocinero", text: random(frases) };
      } else {
        botMsg = { avatar: "👨‍🍳", user: "Cocinero", text: "Hmm... suena delicioso. ¿Quieres una receta rápida?" };
      }
    }

    else if (target === "astronauta") {
      const frases = [
        "Houston, recibo tu mensaje 👨‍🚀",
        "Flotando entre las estrellas... ¡todo bien aquí! 🌌",
        `Desde Marte se ve genial tu energía, ${currentUser}. 🚀`
      ];
      if (includesAny(adiosKW, contentAfterTarget)) {
        botMsg = { avatar: "👨‍🚀", user: "Astronauta", text: "Hasta la próxima misión, compañero. 👋" };
      } else {
        botMsg = { avatar: "👨‍🚀", user: "Astronauta", text: random(frases) };
      }
    }

    // Mostrar respuesta del personaje
    if (botMsg) {
      if (!channelData[currentChannel]) channelData[currentChannel] = [];
      channelData[currentChannel].push(botMsg);
      saveToLocalStorage();
      setTimeout(() => renderMessage(botMsg), 600);
      return;
    }
  }

  // === BOT GENERAL ===
  if (includesAny(saludarKW)) {
    const respuestas = [
      `¡Hola ${currentUser}! 👋`,
      `¡Qué gusto verte, ${currentUser}! 😄`,
      `¡Hey ${currentUser}! ¿Cómo va todo?`
    ];
    botMsg = { avatar: "🤖", user: "Bot", text: random(respuestas) };
  }

  else if (includesAny(comoEstasKW)) {
    botMsg = { avatar: "🤖", user: "Bot", text: "Estoy excelente, gracias por preguntar 🤖✨" };
  }

  else if (includesAny(chisteKW)) {
    const chistes = [
      "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 🐝",
      "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas 📘",
      "¿Qué le dice una impresora a otra? ¿Esa hoja es tuya o es una impresión mía? 🖨️",
      "¿Qué le dice un semáforo a otro? No me mires, me estoy cambiando 😳"
    ];
    botMsg = { avatar: "🤖", user: "Bot", text: random(chistes) };
  }

  else if (includesAny(adiosKW)) {
    botMsg = { avatar: "🤖", user: "Bot", text: `¡Hasta luego ${currentUser}! 👋` };
  }

  else if (includesAny(graciasKW)) {
    botMsg = { avatar: "🤖", user: "Bot", text: "¡De nada! 😊" };
  }

  else {
    // Respuestas específicas por canal
    if (currentChannel === "# memes") {
      const memeResps = [
        "🤣🤣🤣 buen meme",
        "Ese merece un 10/10 en creatividad 😆",
        "JAJA no puedo con este meme 😂"
      ];
      botMsg = { avatar: "🐶", user: "Doge", text: random(memeResps) };
    } else if (currentChannel === "# música") {
      const musicResps = [
        "🎶 Buen ritmo!",
        "¡Esa canción me encanta! 🎧",
        "Yo también la tengo en mi playlist 😎"
      ];
      botMsg = { avatar: "🎸", user: "Rocker", text: random(musicResps) };
    } else if (Math.random() < 0.3) {
      const respuestas = [
        "Interesante 🤔",
        "No estoy seguro de entender, ¿puedes repetirlo?",
        "Cuéntame más sobre eso 😄",
        "Wow, suena genial 🚀",
        "Jajaja 😄"
      ];
      botMsg = { avatar: "🤖", user: "Bot", text: random(respuestas) };
    }
  }

  // Mostrar mensaje final
  if (botMsg) {
    if (!channelData[currentChannel]) channelData[currentChannel] = [];
    channelData[currentChannel].push(botMsg);
    saveToLocalStorage();
    setTimeout(() => renderMessage(botMsg), 600);
  }
}

// ==== EVENTOS ====

// Cambiar canal
channels.forEach(ch => {
  ch.addEventListener('click', () => {
    document.querySelector('.channel.active')?.classList.remove('active');
    ch.classList.add('active');
    currentChannel = ch.textContent;
    header.textContent = currentChannel;
    loadMessages(currentChannel);
  });
});

// Enviar mensaje con Enter
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const newMsg = {
      avatar: currentAvatar,
      user: currentUser,
      text: input.value.trim()
    };

    if (!channelData[currentChannel]) channelData[currentChannel] = [];
    channelData[currentChannel].push(newMsg);
    saveToLocalStorage();
    renderMessage(newMsg);

    handleAutoResponses(newMsg.text);
    input.value = '';
  }
});

// ==== INICIALIZAR ====
loadMessages(currentChannel);




