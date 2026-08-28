'use strict';

const INITIAL_ACCOUNTS = [
  { id: 'ACC-1001', owner: 'Cliente Demo', currency: 'PEN', balance: 10000.00 },
  { id: 'ACC-1002', owner: 'Proveedor Demo', currency: 'PEN', balance: 2500.00 },
  { id: 'ACC-2001', owner: 'Cliente Demo USD', currency: 'USD', balance: 1200.00 }
];

const users = new Map([
  ['demo@ia2-peru.local', {
    id: 'USR-001',
    email: 'demo@ia2-peru.local',
    password: 'Lab-IA2-2026!',
    displayName: 'Operador de Laboratorio'
  }]
]);

const sessions = new Map();
let accounts = structuredClone(INITIAL_ACCOUNTS);
const transfers = [];

function getUserByEmail(email) {
  return users.get(String(email || '').toLowerCase());
}

function createSession(token, userId, expiresAt) {
  sessions.set(token, { userId, expiresAt });
}

function getSession(token) {
  return sessions.get(token);
}

function listAccounts() {
  return structuredClone(accounts);
}

function getAccount(id) {
  return accounts.find((item) => item.id === id);
}

function addTransfer(transfer) {
  transfers.push(structuredClone(transfer));
}

function listTransfers() {
  return structuredClone(transfers);
}

function resetLab() {
  accounts = structuredClone(INITIAL_ACCOUNTS);
  transfers.length = 0;
  sessions.clear();
}

module.exports = {
  getUserByEmail,
  createSession,
  getSession,
  listAccounts,
  getAccount,
  addTransfer,
  listTransfers,
  resetLab
};
