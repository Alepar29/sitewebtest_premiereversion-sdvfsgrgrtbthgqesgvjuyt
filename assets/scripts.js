const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ===== Champ téléphone : FR & +33, formatage + limites =====
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('phone');
  if (!input) return;

  // Téléphone sans indicatif (max 10 chiffres)
  function formatFR(n) {
    const digits = n.replace(/\D/g, '').slice(0, 10);
    const parts = [];
    for (let i = 0; i < digits.length; i += 2) parts.push(digits.slice(i, i + 2));
    return parts.join(' ').trim();
  }

  // Téléphone avec indicatif  (max 9 chiffres après +33, le 0 est supprimé)
  function formatFRIntlPlus33(v) {
    let num = v.slice(3).replace(/\D/g, ''); // après "+33"
    if (num.startsWith('0')) num = num.slice(1); // FR : on enlève le 0 initial
    num = num.slice(0, 9); // 1 + 8 chiffres (ex: 6 12 34 56 78)

    let out = '+33';
    if (num.length > 0) {
      out += ' ' + num[0]; // premier chiffre (ex: 6)
      const rest = num.slice(1);
      const pairs = [];
      for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2));
      if (pairs.length) out += ' ' + pairs.join(' ');
    }
    return out;
  }

  // Fallback générique pour autres +XX (groupes de 2 après l’indicatif)
  function formatIntlGeneric(v) {
    const clean = v.replace(/[^\d+]/g, '').replace(/(?!^\+)\+/g, '');
    const m = clean.match(/^\+(\d{0,3})(\d*)$/) || [];
    const cc = m[1] || '';
    let num = (m[2] || '').slice(0, 12);
    num = num.replace(/(\d{2})(?=\d)/g, '$1 ');
    return '+' + cc + (num ? ' ' + num : '');
  }

  input.addEventListener('input', (e) => {
    let raw = e.target.value;
    // garder uniquement chiffres et un seul + en tête
    raw = raw.replace(/[^0-9+]/g, '').replace(/(?!^)\+/g, '');

    if (raw.startsWith('+')) {
      // cas FR attendu
      if (raw.startsWith('+33')) {
        e.target.value = formatFRIntlPlus33(raw);
      } else {
        // autre indicatif : format générique
        e.target.value = formatIntlGeneric(raw);
      }
    } else {
      // numéro national FR
      e.target.value = formatFR(raw);
    }
  });
});

// Validation stricte de l'e-mail (vrai domaine + extension correcte)
document.addEventListener('DOMContentLoaded', () => {
  const email = document.getElementById('email');
  if (!email) return;

  // Exige : au moins un point après le @, et extension >= 2 caractères, != "co" seul
  const re = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,10}(\.[A-Za-z]{2,10})?$/;

  function validateEmail() {
    const value = email.value.trim();

    if (value === '') {
      email.setCustomValidity('');
      return;
    }

    // Vérifie le motif général
    if (re.test(value)) {
      // Rejette les ".co" simples (mais garde .co.uk)
      const lower = value.toLowerCase();
      if (lower.endsWith('.co') && !lower.endsWith('.co.uk')) {
        email.setCustomValidity("Extension '.co' incomplète. Utilisez .com, .fr, .org, etc.");
      } else {
        email.setCustomValidity('');
      }
    } else {
      email.setCustomValidity('Adresse e-mail incomplète (ex. nom@domaine.fr).');
    }
  }

  ['input', 'blur', 'change'].forEach(evt =>
    email.addEventListener(evt, validateEmail)
  );
  validateEmail();
});
