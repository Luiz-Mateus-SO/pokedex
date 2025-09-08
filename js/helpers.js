// helpers.js
export function sanitizeInput(value) {
  return value.trim().toLowerCase();
}

export function convertValueToPercent(value, max = 255) {
  const percent = Math.min((value / max) * 100, 100);
  return Math.round(percent) + '%';
}

export function createPokemonElements(tag, className) {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  return el;
}
