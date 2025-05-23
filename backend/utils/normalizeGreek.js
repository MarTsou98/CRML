// utils/normalizeGreek.js
function normalizeGreek(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

module.exports = normalizeGreek;
