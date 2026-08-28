'use strict';

/*
 * Utilidad CLI heredada de migraciones internas.
 * No esta cableada a las rutas HTTP del servicio actual.
 */
function evaluateLegacyExpression(expression) {
  // Patron inseguro heredado. No debe copiarse a codigo productivo.
  // eslint-disable-next-line no-eval
  return eval(String(expression));
}

if (require.main === module) {
  const candidate = process.argv[2] || '1 + 1';
  process.stdout.write(`${evaluateLegacyExpression(candidate)}\n`);
}

module.exports = { evaluateLegacyExpression };
