const WHATSAPP_NUMBER = "6285775703845";
const DISCORD_INVITE = "https://discord.gg/xsttwG5kZv";
const PRICE_PER_ROBUX = 153;
const MIN_ROBUX = 10;
const MAX_ROBUX = 2000;
const ROBUX_STEP = 10;

const rupiah = n => new Intl.NumberFormat("id-ID").format(n);
let selectedRobux = 500;
let pendingOrder = null;

const slider = document.querySelector("#robuxSlider");
const input = document.querySelector("#robuxInput");
const robuxDisplay = document.querySelector("#robuxDisplay");
const priceDisplay = document.querySelector("#priceDisplay");
const quickPicks = [...document.querySelectorAll("[data-robux]")];

function clampRobux(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return selectedRobux;
  const clamped = Math.min(MAX_ROBUX, Math.max(MIN_ROBUX, parsed));
  return Math.round(clamped / ROBUX_STEP) * ROBUX_STEP;
}

function updateCalculator(value) {
  selectedRobux = clampRobux(value);
  const price = selectedRobux * PRICE_PER_ROBUX;
  if (slider) slider.value = selectedRobux;
  if (input) input.value = selectedRobux;
  if (robuxDisplay) robuxDisplay.innerHTML = `${rupiah(selectedRobux)} <small>R$</small>`;
  if (priceDisplay) priceDisplay.textContent = `Rp${rupiah(price)}`;
  quickPicks.forEach(button => {
    const active = Number(button.dataset.robux) === selectedRobux;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (slider) {
    const progress = ((selectedRobux - MIN_ROBUX) / (MAX_ROBUX - MIN_ROBUX)) * 100;
    slider.style.setProperty("--slider-progress", `${progress}%`);
  }
}

function openOrderChoice(robux, price) {
  pendingOrder = { robux, price };
  const modal = document.querySelector("#orderChoiceModal");
  const amount = document.querySelector("#modalAmount");
  const priceEl = document.querySelector("#modalPrice");
  if (amount) amount.textContent = `${rupiah(robux)} R$`;
  if (priceEl) priceEl.textContent = `Rp${rupiah(price)}`;
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => document.querySelector("#orderChoiceModal .order-option")?.focus(), 80);
}

function closeOrderChoice() {
  const modal = document.querySelector("#orderChoiceModal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  pendingOrder = null;
}

function goToWhatsApp() {
  if (!pendingOrder) return;
  const { robux, price } = pendingOrder;
  const message = `Halo Betterflyuu! 👋\n\nSaya mau pesan ${rupiah(robux)} Robux.\nHarga: Rp${rupiah(price)}\n\nUsername Roblox saya: `;
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function goToDiscord() {
  window.location.href = DISCORD_INVITE;
}

slider?.addEventListener("input", event => updateCalculator(event.target.value));
input?.addEventListener("change", event => updateCalculator(event.target.value));
input?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    updateCalculator(event.target.value);
    input.blur();
  }
});
document.querySelector("#decreaseRobux")?.addEventListener("click", () => updateCalculator(selectedRobux - ROBUX_STEP));
document.querySelector("#increaseRobux")?.addEventListener("click", () => updateCalculator(selectedRobux + ROBUX_STEP));
quickPicks.forEach(button => button.addEventListener("click", () => updateCalculator(button.dataset.robux)));
document.querySelector("#startRobuxOrder")?.addEventListener("click", () => {
  updateCalculator(input?.value ?? selectedRobux);
  openOrderChoice(selectedRobux, selectedRobux * PRICE_PER_ROBUX);
});

document.querySelector("#whatsappOrder")?.addEventListener("click", goToWhatsApp);
document.querySelector("#discordOrder")?.addEventListener("click", goToDiscord);
document.querySelector("#closeOrderChoice")?.addEventListener("click", closeOrderChoice);
document.querySelector("#orderChoiceBackdrop")?.addEventListener("click", closeOrderChoice);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.querySelector("#orderChoiceModal")?.classList.contains("open")) closeOrderChoice();
});

document.querySelectorAll("[data-whatsapp-general]").forEach(element => {
  element.addEventListener("click", event => {
    event.preventDefault();
    const message = "Halo Betterflyuu! 👋\n\nSaya mau tanya tentang top up Robux.";
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });
});

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});
mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  mobileMenu?.setAttribute("aria-hidden", "true");
}));

updateCalculator(selectedRobux);
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
