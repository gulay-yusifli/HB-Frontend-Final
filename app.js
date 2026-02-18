const authPage = document.getElementById("authPage");
const homePage = document.getElementById("homePage");

const loginPanel = document.getElementById("loginPanel");
const registerPanel = document.getElementById("registerPanel");

const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

const continueGuestLogin = document.getElementById("continueGuestLogin");
const continueGuestRegister = document.getElementById("continueGuestRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function showLogin() {
  loginPanel.classList.remove("is-hidden");
  registerPanel.classList.add("is-hidden");
}

function showRegister() {
  registerPanel.classList.remove("is-hidden");
  loginPanel.classList.add("is-hidden");
}

function goHome() {
  authPage.classList.add("is-hidden");
  homePage.classList.remove("is-hidden");
}

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
  // demo: success -> home
  goHome();
});

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  // demo: success -> home
  goHome();
});

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
  alert(`Axtarış: ${q}`);
});