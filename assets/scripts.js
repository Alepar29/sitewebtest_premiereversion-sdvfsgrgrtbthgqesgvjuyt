// ============================
//  Chargement des partials
// ============================
async function loadPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.statusText);
    host.innerHTML = await res.text();
  } catch (err) {
    console.error(`Erreur lors du chargement de ${url} :`, err);
  }
}

// ============================
//  Menu burger (mobile)
// ============================
function initMenuToggle() {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");

  if (!btn || !menu) return;

  // Ouverture / fermeture
  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Fermeture quand on clique sur un lien du menu
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Fermeture sur touche Echap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

// ============================
//  Lien actif dans la nav
// ============================
function initActiveMenuLink() {
  const current = document.documentElement.getAttribute("data-page");
  if (!current) return;

  document
    .querySelectorAll(`nav.menu a[data-page="${current}"]`)
    .forEach((a) => a.classList.add("active"));
}

// ============================
//  Année dynamique dans le footer
// ============================
function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// ============================
//  Formatage du téléphone (FR)
// ============================
function formatFrenchPhone(value) {
  if (!value) return "";

  let v = value.replace(/\s+/g, "");
  // On garde + pour pouvoir détecter +33
  const hasPlus = v.startsWith("+");
  v = v.replace(/[^\d+]/g, "");

  // +33X XX XX XX XX
  if (v.startsWith("+33")) {
    let digits = v.replace("+33", "").replace(/\D/g, "");
    digits = digits.slice(0, 9); // 9 chiffres après +33

    let out = "+33";
    if (digits.length > 0) out += " " + digits.slice(0, 1);
    if (digits.length > 1) out += " " + digits.slice(1, 3);
    if (digits.length > 3) out += " " + digits.slice(3, 5);
    if (digits.length > 5) out += " " + digits.slice(5, 7);
    if (digits.length > 7) out += " " + digits.slice(7, 9);
    return out.trim();
  }

  // 0X XX XX XX XX
  if (v.startsWith("0")) {
    let digits = v.replace(/\D/g, "");
    digits = digits.slice(0, 10); // 10 chiffres

    let out = "";
    if (digits.length > 0) out += digits.slice(0, 2);
    if (digits.length > 2) out += " " + digits.slice(2, 4);
    if (digits.length > 4) out += " " + digits.slice(4, 6);
    if (digits.length > 6) out += " " + digits.slice(6, 8);
    if (digits.length > 8) out += " " + digits.slice(8, 10);
    return out.trim();
  }

  // Fallback international simple : on enlève tout sauf chiffres
  let digits = v.replace(/\D/g, "");
  if (hasPlus) digits = "+" + digits;
  return digits.slice(0, 16);
}

function initPhoneField() {
  const tel = document.getElementById("telephone");
  if (!tel) return;

  const handler = () => {
    tel.value = formatFrenchPhone(tel.value);
  };

  tel.addEventListener("input", handler);
  tel.addEventListener("blur", handler);
}

// ============================
//  Initialisation globale
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // Charge header + footer (si présents)
  await Promise.all([
    loadPartial("#header-placeholder", "assets/header.html"),
    loadPartial("#footer-placeholder", "assets/footer.html"),
  ]);

  // Tout ce qui dépend du header/footer doit venir APRÈS
  initMenuToggle();
  initActiveMenuLink();
  initYear();
  initPhoneField();
});
