'use strict';

const minimist = require('minimist');

function normalizePaymentReference(reference) {
  // El SDK conserva una dependencia transitiva antigua para el ejercicio SCA.
  // No se incluye ninguna PoC de explotacion en este repositorio.
  const parsed = minimist([`--reference=${reference}`]);
  return String(parsed.reference || '').trim().toUpperCase();
}

module.exports = { normalizePaymentReference };
