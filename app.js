// Pages
const authPage = document.getElementById("authPage");
const homePage = document.getElementById("homePage");
const resultsPage = document.getElementById("resultsPage");
const detailPage = document.getElementById("detailPage");

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
  [authPage, homePage, resultsPage, detailPage].forEach((p) => p?.classList.add("is-hidden"));
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
    // tel linkini də dinamik edək
    const digits = phone.replace(/[^\d+]/g, "");
    detailPhone.setAttribute("href", digits ? `tel:${digits}` : "#");
  }

  // coords from card (if exists)
  const lat = Number(card?.dataset?.lat);
  const lng = Number(card?.dataset?.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    setDetailCoords(lat, lng);
  }

  closeChat(); // detail açılarkən chat gizli qalsın
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
    // düyməni deaktiv et
    btn.disabled = true;

    // kartda "Bron edildi" badge əlavə et (əgər yoxdursa)
    if (card && !card.querySelector(".reserved-badge")) {
      const badge = document.createElement("div");
      badge.className = "reserved-badge";
      badge.textContent = "Bron edildi";
      card.appendChild(badge);
    }

    // düymənin yazısını dəyiş
    btn.innerHTML = `<i class="fa-regular fa-circle-check"></i> Bron edildi`;
  }
});

// -------------------- sort --------------------
let sortAsc = true; // ucuzdan bahaya
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