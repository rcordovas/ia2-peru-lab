'use strict';

const state = { token: '', accounts: [] };
const $ = (id) => document.getElementById(id);

function setStatus(id, value) {
  $(id).textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function loadAccounts() {
  const data = await api('/api/accounts');
  state.accounts = data.accounts;
  $('accounts').innerHTML = state.accounts.map((account) =>
    `<div class="account"><strong>${account.id}</strong><span>${account.currency} ${account.balance.toFixed(2)}</span></div>`
  ).join('');

  const options = state.accounts.map((account) =>
    `<option value="${account.id}">${account.id} - ${account.currency}</option>`
  ).join('');
  $('fromAccount').innerHTML = options;
  $('toAccount').innerHTML = options;
  if (state.accounts.length > 1) $('toAccount').selectedIndex = 1;
}

function collectTransfer() {
  const amount = Number($('amount').value);
  const currency = $('currency').value;

  // Validaciones de experiencia de usuario del canal web.
  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    throw new Error('El frontend solo permite montos entre 1 y 5000.');
  }
  if (!['PEN', 'USD'].includes(currency)) {
    throw new Error('Moneda no permitida por el frontend.');
  }

  return {
    fromAccount: $('fromAccount').value,
    toAccount: $('toAccount').value,
    amount,
    currency,
    reference: $('reference').value
  };
}

$('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: $('email').value, password: $('password').value })
    });
    state.token = data.token;
    setStatus('loginStatus', { status: 'autenticado', expiresAt: data.expiresAt });
    $('transferCard').classList.remove('hidden');
    await loadAccounts();
  } catch (error) {
    setStatus('loginStatus', error.message);
  }
});

$('refreshAccounts').addEventListener('click', () => loadAccounts().catch((error) => setStatus('transferStatus', error.message)));

$('previewButton').addEventListener('click', async () => {
  try {
    const payload = collectTransfer();
    const data = await api('/api/transfers/preview', { method: 'POST', body: JSON.stringify(payload) });
    setStatus('transferStatus', data);
  } catch (error) {
    setStatus('transferStatus', error.message);
  }
});

$('transferForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = collectTransfer();
    const data = await api('/api/transfers/execute', { method: 'POST', body: JSON.stringify(payload) });
    setStatus('transferStatus', data);
    await loadAccounts();
  } catch (error) {
    setStatus('transferStatus', error.message);
  }
});
