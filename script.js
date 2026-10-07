const WHATSAPP_NUMBER = "6285775703845";
const DISCORD_INVITE = "https://discord.gg/xsttwG5kZv";

const products = [
  [10, 1530], [20, 3060], [30, 4590], [40, 6120], [50, 7650],
  [60, 9180], [70, 10710], [80, 12240], [90, 13770], [100, 15300],
  [200, 30600], [300, 45900], [400, 61200], [500, 76500], [600, 91800],
  [700, 107100], [800, 122400], [900, 137700], [1000, 153000],
  [1500, 229500], [2000, 306000]
];

const rupiah = n => new Intl.NumberFormat("id-ID").format(n);
const grid = document.querySelector("#productGrid");

let pendingOrder = null;

function openOrderChoice(robux, price) {
  pendingOrder = { robux, price };
  const modal = document.querySelector("#orderChoiceModal");
  const amount = document.querySelector("#modalAmount");
  const priceEl = document.querySelector("#modalPrice");

  if (amount) amount.textContent = `${robux} R$`;
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
  const text = `Halo Betterflyuu! 👋\n\nSaya mau pesan ${robux} Robux.\nHarga: Rp${rupiah(price)}\n\nUsername Roblox saya: `;
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function goToDiscord() {
  window.location.href = DISCORD_INVITE;
}

products.forEach(([robux, price]) => {
  const card = document.createElement("button");
  card.className = "product";
  card.type = "button";
  card.setAttribute("aria-label", `Pesan ${robux} Robux seharga Rp${rupiah(price)}`);
  card.innerHTML = `
    <div class="top">
      <span class="robux-icon">R</span>
      <span class="arrow">→</span>
    </div>
    <div>
      <strong>${robux} R$</strong>
      <small class="price">Rp${rupiah(price)}</small>
    </div>
  `;
  card.addEventListener("click", () => {
    document.querySelectorAll(".product.selected").forEach(el => el.classList.remove("selected"));
    card.classList.add("selected");
    openOrderChoice(robux, price);
  });
  grid.appendChild(card);
});

document.querySelector("#whatsappOrder")?.addEventListener("click", goToWhatsApp);
document.querySelector("#discordOrder")?.addEventListener("click", goToDiscord);
document.querySelector("#closeOrderChoice")?.addEventListener("click", closeOrderChoice);
document.querySelector("#orderChoiceBackdrop")?.addEventListener("click", closeOrderChoice);

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && document.querySelector("#orderChoiceModal")?.classList.contains("open")) {
    closeOrderChoice();
  }
});

document.querySelectorAll("[data-whatsapp-general]").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    const text = "Halo Betterflyuu! 👋\n\nSaya mau tanya tentang top up Robux.";
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  });
});

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
menuButton?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
  mobileMenu.setAttribute("aria-hidden", !open);
});
mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

document.querySelector("#year").textContent = new Date().getFullYear();
