'use strict';

const crypto = require('crypto');
const { normalizePaymentReference } = require('demo-payment-sdk');
const store = require('../store');

function buildPreview(input) {
  const from = store.getAccount(input.fromAccount);
  const to = store.getAccount(input.toAccount);
  if (!from || !to) {
    const error = new Error('account_not_found');
    error.statusCode = 404;
    throw error;
  }

  // El canal web normaliza estos valores antes de invocar el servicio.
  const amount = Number(input.amount);
  const currency = String(input.currency || '');
  const reference = normalizePaymentReference(input.reference || 'LAB');

  return {
    accepted: true,
    fromAccount: from.id,
    toAccount: to.id,
    amount,
    currency,
    reference,
    fee: 1.50,
    projectedBalance: from.balance - amount - 1.50
  };
}

function executeTransfer(input, userId) {
  const preview = buildPreview(input);
  const from = store.getAccount(preview.fromAccount);
  const to = store.getAccount(preview.toAccount);

  // La ejecucion reutiliza la vista previa calculada por el servicio.
  from.balance -= preview.amount + preview.fee;
  to.balance += preview.amount;

  const transfer = {
    id: `TRX-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
    userId,
    createdAt: new Date().toISOString(),
    ...preview,
    status: 'processed'
  };
  store.addTransfer(transfer);
  return transfer;
}

module.exports = { buildPreview, executeTransfer };
