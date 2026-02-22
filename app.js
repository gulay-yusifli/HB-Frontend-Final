// Pages
const authPage = document.getElementById("authPage");
const homePage = document.getElementById("homePage");
const resultsPage = document.getElementById("resultsPage");
const detailPage = document.getElementById("detailPage");
const profilePage = document.getElementById("profilePage");

// Auth panels
const loginPanel = document.getElementById("loginPanel");
const registerPanel = document.getElementById("registerPanel");

const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

const continueGuestLogin = document.getElementById("continueGuestLogin");
const continueGuestRegister = document.getElementById("continueGuestRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Home search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Home profile
const openProfileBtn = document.getElementById("openProfileBtn");

// Results
const backToHomeBtn = document.getElementById("backToHomeBtn");
const resultsGrid = document.getElementById("resultsGrid");
const resultsQuery = document.getElementById("resultsQuery");
const resultsCount = document.getElementById("resultsCount");
const sortBtn = document.getElementById("sortBtn");

// Detail
const backToResultsBtn = document.getElementById("backToResultsBtn");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailAddress = document.getElementById("detailAddress");
const detailDistance = document.getElementById("detailDistance");
const detailPhone = document.getElementById("detailPhone");
const coordsText = document.getElementById("coordsText");

// Detail buttons
const callBtn = document.getElementById("callBtn");
const directionsBtn = document.getElementById("directionsBtn");
const openMapsBtn = document.getElementById("openMapsBtn");

// Chat widget
const openChatBtn = document.getElementById("openChatBtn");
const chatWidget = document.getElementById("chatWidget");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

// Profile
const backToHomeFromProfileBtn = document.getElementById("backToHomeFromProfileBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const remindersList = document.getElementById("remindersList");

// -------------------- helpers --------------------
function showLogin() {
  loginPanel.classList.remove("is-hidden");
  registerPanel.classList.add("is-hidden");
}

function showRegister() {
  registerPanel.classList.remove("is-hidden");
  loginPanel.classList.add("is-hidden");
}

function showPage(pageId) {
  [authPage, homePage, resultsPage, detailPage, profilePage].forEach((p) => p?.classList.add("is-hidden"));
  document.getElementById(pageId)?.classList.remove("is-hidden");
}

function goHome() {
  showPage("homePage");
}

function goResults(queryText) {
  if (resultsQuery) resultsQuery.textContent = queryText || "—";
  if (resultsCount && resultsGrid) resultsCount.textContent = `${resultsGrid.children.length}`;
  showPage("resultsPage");
}

// -------------------- detail fill --------------------
function setDetailCoords(lat, lng) {
  if (!detailPage) return;
  detailPage.dataset.lat = String(lat);
  detailPage.dataset.lng = String(lng);
  if (coordsText) coordsText.textContent = `Koordinatlar: ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
}

function goDetailFromCard(card) {
  const name = card?.dataset?.name || card?.querySelector(".ph-card__title")?.textContent?.trim() || "—";
  const price = card?.dataset?.price;
  const address = card?.dataset?.address || "—";
  const distance = card?.dataset?.distance || "—";
  const phone = card?.dataset?.phone || "—";

  if (detailName) detailName.textContent = name;
  if (detailPrice) detailPrice.textContent = price ? `Qiymət: ${Number(price).toFixed(2)} ₼` : "Qiymət: —";
  if (detailAddress) detailAddress.textContent = address;
  if (detailDistance) detailDistance.textContent = distance;

  if (detailPhone) {
    detailPhone.textContent = phone;
    const digits = phone.replace(/[^\d+]/g, "");
    detailPhone.setAttribute("href", digits ? `tel:${digits}` : "#");
  }

  const lat = Number(card?.dataset?.lat);
  const lng = Number(card?.dataset?.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) setDetailCoords(lat, lng);

  closeChat();
  showPage("detailPage");
}

// -------------------- auth navigation --------------------
toRegister?.addEventListener("click", (e) => {
  e.preventDefault();
  showRegister();
});

toLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

continueGuestLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  goHome();
});

continueGuestRegister?.addEventListener("click", (e) => {
  e.preventDefault();
  goHome();
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  goHome();
});

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  goHome();
});

// -------------------- home chips + search --------------------
document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent?.trim() ?? "";
    if (searchInput) searchInput.value = text;
    searchInput?.focus();
  });
});

searchBtn?.addEventListener("click", () => {
  const q = searchInput?.value?.trim();
  if (!q) return;
  goResults(q);
});

searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn?.click();
  }
});

// -------------------- profile navigation --------------------
openProfileBtn?.addEventListener("click", () => {
  // demo data (backend inteqrasiya olanda /api/auth/me ilə doldurulacaq)
  if (profileName) profileName.textContent = "İstifadəçi";
  if (profileEmail) profileEmail.textContent = "user@example.com";
  showPage("profilePage");
});

backToHomeFromProfileBtn?.addEventListener("click", () => goHome());

logoutBtn?.addEventListener("click", () => {
  // gələcəkdə token localStorage-dən silinəcək
  showPage("authPage");
});

remindersList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.action === "delete-reminder") {
    const card = btn.closest(".reminder-card");
    card?.remove();
  }
});

// -------------------- back buttons --------------------
backToHomeBtn?.addEventListener("click", () => goHome());
backToResultsBtn?.addEventListener("click", () => showPage("resultsPage"));

// -------------------- results actions --------------------
resultsGrid?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const card = btn.closest(".ph-card");
  const action = btn.dataset.action;

  if (action === "details") {
    goDetailFromCard(card);
  }

  if (action === "reserve") {
    btn.disabled = true;

    if (card && !card.querySelector(".reserved-badge")) {
      const badge = document.createElement("div");
      badge.className = "reserved-badge";
      badge.textContent = "Bron edildi";
      card.appendChild(badge);
    }

    btn.innerHTML = `<i class="fa-regular fa-circle-check"></i> Bron edildi`;
  }
});

// -------------------- sort --------------------
let sortAsc = true;
sortBtn?.addEventListener("click", () => {
  if (!resultsGrid) return;

  const cards = Array.from(resultsGrid.querySelectorAll(".ph-card"));
  cards.sort((a, b) => {
    const pa = Number(a.dataset.price || Infinity);
    const pb = Number(b.dataset.price || Infinity);
    return sortAsc ? pa - pb : pb - pa;
  });

  cards.forEach((c) => resultsGrid.appendChild(c));

  sortAsc = !sortAsc;
  sortBtn.innerHTML = sortAsc
    ? `<i class="fa-solid fa-up-down"></i> Ucuzdan bahaya`
    : `<i class="fa-solid fa-up-down"></i> Bahadan ucuza`;
});

// -------------------- chat --------------------
function openChat() {
  chatWidget?.classList.remove("is-hidden");
  requestAnimationFrame(() => {
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    chatInput?.focus();
  });
}

function closeChat() {
  chatWidget?.classList.add("is-hidden");
}

openChatBtn?.addEventListener("click", openChat);
chatCloseBtn?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput?.value?.trim();
  if (!text || !chatBody) return;

  const userRow = document.createElement("div");
  userRow.className = "msg msg--user";
  userRow.innerHTML = `<div class="msg__bubble"></div>`;
  userRow.querySelector(".msg__bubble").textContent = text;
  chatBody.appendChild(userRow);

  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  const botRow = document.createElement("div");
  botRow.className = "msg msg--bot";
  botRow.innerHTML = `<div class="msg__bubble">Salam! Sizə necə kömək edə bilərəm?</div>`;

  setTimeout(() => {
    chatBody.appendChild(botRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 350);
});

// -------------------- maps + call --------------------
function getDetailCoords() {
  const lat = Number(detailPage?.dataset?.lat);
  const lng = Number(detailPage?.dataset?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function openGoogleMapsAt(lat, lng) {
  const url = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openGoogleDirectionsTo(lat, lng, origin) {
  const params = new URLSearchParams();
  params.set("api", "1");
  if (origin && Number.isFinite(origin.lat) && Number.isFinite(origin.lng)) {
    params.set("origin", `${origin.lat},${origin.lng}`);
  }
  params.set("destination", `${lat},${lng}`);
  params.set("travelmode", "driving");
  const url = `https://www.google.com/maps/dir/?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

openMapsBtn?.addEventListener("click", () => {
  const coords = getDetailCoords();
  if (!coords) return alert("Koordinatlar tapılmadı.");
  openGoogleMapsAt(coords.lat, coords.lng);
});

directionsBtn?.addEventListener("click", () => {
  const coords = getDetailCoords();
  if (!coords) return alert("Koordinatlar tapılmadı.");

  if (!navigator.geolocation) {
    openGoogleDirectionsTo(coords.lat, coords.lng);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      openGoogleDirectionsTo(coords.lat, coords.lng, origin);
    },
    () => {
      openGoogleDirectionsTo(coords.lat, coords.lng);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
});

callBtn?.addEventListener("click", () => {
  const phone = detailPhone?.textContent?.trim() || "";
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return alert("Telefon nömrəsi tapılmadı.");
  window.location.href = `tel:${digits}`;
});

// -------------------- Profile reminders (localStorage) --------------------
const addReminderBtn = document.getElementById("addReminderBtn");
const reminderModal = document.getElementById("reminderModal");
const reminderForm = document.getElementById("reminderForm");

const medName = document.getElementById("medName");
const medDose = document.getElementById("medDose");
const medTimes = document.getElementById("medTimes");
const medHours = document.getElementById("medHours");
const medTag = document.getElementById("medTag");

const LS_REMINDERS_KEY = "medsearch_reminders_v1";
const LS_BELLS_KEY = "medsearch_bells_v1";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeHours(str) {
  // "08:00, 20:00" -> ["08:00","20:00"]
  return String(str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatTimesText(timesCount, hoursArr) {
  const timesLabel = `Gündə ${timesCount} dəfə`;
  const hoursLabel = hoursArr.length ? ` - ${hoursArr.join(", ")}` : "";
  return `${timesLabel}${hoursLabel}`;
}

function createReminderCard(rem) {
  const card = document.createElement("article");
  card.className = "reminder-card";
  card.dataset.reminderId = rem.id;

  card.innerHTML = `
    <div class="reminder-card__left">
      <div class="reminder-card__icon"><i class="fa-solid fa-capsules"></i></div>
      <div class="reminder-card__main">
        <div class="reminder-card__title"></div>
        <div class="reminder-card__sub"></div>
        <div class="reminder-card__meta">
          <i class="fa-regular fa-clock"></i>
          <span class="reminder-card__meta-text"></span>
        </div>
        ${rem.tag ? `<div class="tag tag--purple"></div>` : ""}
      </div>
    </div>

    <div class="reminder-card__actions">
      <button class="icon-square is-bell-on" type="button" data-action="toggle-bell" title="Bildiriş">
        <i class="fa-regular fa-bell"></i>
      </button>
      <button class="icon-trash" type="button" data-action="delete-reminder" title="Sil">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `;

  card.querySelector(".reminder-card__title").textContent = rem.name;
  card.querySelector(".reminder-card__sub").textContent = rem.dose;
  card.querySelector(".reminder-card__meta-text").textContent = formatTimesText(rem.timesPerDay, rem.hours);

  if (rem.tag) {
    card.querySelector(".tag").textContent = rem.tag;
  }

  return card;
}

function getRemindersFromUI() {
  const cards = Array.from(remindersList.querySelectorAll(".reminder-card"));
  return cards.map((c) => ({
    id: c.dataset.reminderId,
  }));
}

function ensureInfoBoxFirst() {
  const info = remindersList.querySelector(".info-box");
  if (info) remindersList.prepend(info);
}

function loadReminders() {
  const saved = readJson(LS_REMINDERS_KEY, null);
  if (!saved) return;

  // remove current reminder cards (keep info-box)
  remindersList.querySelectorAll(".reminder-card").forEach((n) => n.remove());

  saved.forEach((rem) => {
    remindersList.appendChild(createReminderCard(rem));
  });

  ensureInfoBoxFirst();
  applyBellStates();
}

function saveReminders() {
  const cards = Array.from(remindersList.querySelectorAll(".reminder-card"));
  const rems = cards.map((c) => {
    const id = c.dataset.reminderId;
    const name = c.querySelector(".reminder-card__title")?.textContent?.trim() || "";
    const dose = c.querySelector(".reminder-card__sub")?.textContent?.trim() || "";
    const meta = c.querySelector(".reminder-card__meta-text")?.textContent?.trim() || "";

    // meta-dan geri parse etmirik; əlavə zamanı saxlayırıq.
    // Amma sadəlik üçün localStorage-da real dəyərləri ayrıca saxlayırıq (aşağıda add zamanı).
    const savedAll = readJson(LS_REMINDERS_KEY, []);
    const found = savedAll.find((r) => String(r.id) === String(id));
    return found || { id, name, dose, meta };
  });

  writeJson(LS_REMINDERS_KEY, rems);
}

// Bell state save/load
function readBellStates() {
  return readJson(LS_BELLS_KEY, {}); // { [reminderId]: true/false }
}

function writeBellStates(obj) {
  writeJson(LS_BELLS_KEY, obj);
}

function setBellUI(btn, isOn) {
  btn.classList.toggle("is-bell-on", isOn);
  btn.classList.toggle("is-bell-off", !isOn);
  btn.setAttribute("aria-pressed", String(isOn));
}

function applyBellStates() {
  const states = readBellStates();

  remindersList.querySelectorAll('[data-action="toggle-bell"]').forEach((btn) => {
    const card = btn.closest(".reminder-card");
    const id = card?.dataset?.reminderId;
    const isOn = states[id] !== undefined ? states[id] : true; // default ON
    setBellUI(btn, isOn);
  });

  // schedule bell buttons (daily schedule)
  document.querySelectorAll(".schedule-item__bell").forEach((btn, idx) => {
    const key = `schedule_${idx}`;
    const isOn = states[key] !== undefined ? states[key] : true;
    setBellUI(btn, isOn);
  });
}

// Modal open/close
function openModal() {
  reminderModal.classList.remove("is-hidden");
  reminderModal.setAttribute("aria-hidden", "false");
  medName?.focus();
}

function closeModal() {
  reminderModal.classList.add("is-hidden");
  reminderModal.setAttribute("aria-hidden", "true");
  reminderForm?.reset();
}

addReminderBtn?.addEventListener("click", openModal);

reminderModal?.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  if (el.dataset.action === "close-modal") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && reminderModal && !reminderModal.classList.contains("is-hidden")) {
    closeModal();
  }
});

reminderForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = medName.value.trim();
  const dose = medDose.value.trim();
  const timesPerDay = Number(medTimes.value);
  const hours = normalizeHours(medHours.value);
  const tag = medTag.value.trim();

  if (!name || !dose || !Number.isFinite(timesPerDay) || hours.length === 0) {
    alert("Zəhmət olmasa bütün xanaları düzgün doldurun.");
    return;
  }

  const rem = {
    id: String(Date.now()),
    name,
    dose,
    timesPerDay,
    hours,
    tag,
  };

  // add to UI
  remindersList.appendChild(createReminderCard(rem));
  ensureInfoBoxFirst();

  // save full reminder objects
  const saved = readJson(LS_REMINDERS_KEY, []);
  saved.push(rem);
  writeJson(LS_REMINDERS_KEY, saved);

  // default bell ON for new reminder
  const bellStates = readBellStates();
  bellStates[rem.id] = true;
  writeBellStates(bellStates);

  applyBellStates();
  closeModal();
});

// Click handlers: reminder delete + bell toggle
remindersList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const card = btn.closest(".reminder-card");
  const id = card?.dataset?.reminderId;

  if (action === "delete-reminder" && card && id) {
    card.remove();

    // remove from storage
    const saved = readJson(LS_REMINDERS_KEY, []);
    writeJson(
      LS_REMINDERS_KEY,
      saved.filter((r) => String(r.id) !== String(id))
    );

    const bellStates = readBellStates();
    delete bellStates[id];
    writeBellStates(bellStates);
  }

  if (action === "toggle-bell" && id) {
    const states = readBellStates();
    const current = states[id] !== undefined ? states[id] : true;
    states[id] = !current;
    writeBellStates(states);
    setBellUI(btn, states[id]);
  }
});

// Daily schedule bells toggle
document.querySelectorAll(".schedule-item__bell").forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const key = `schedule_${idx}`;
    const states = readBellStates();
    const current = states[key] !== undefined ? states[key] : true;
    states[key] = !current;
    writeBellStates(states);
    setBellUI(btn, states[key]);
  });
});

// Load saved reminders/bells when profile opens
openProfileBtn?.addEventListener("click", () => {
  loadReminders();
  applyBellStates();
});