'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const allowedFixture = path.join(root, 'lab-fixtures', 'seeded-secret.txt');
const patterns = [
  { name: 'GitHub token-like value', regex: /ghp_[A-Za-z0-9]{30,}/g },
  { name: 'AWS access-key-like value', regex: /AKIA[A-Z0-9]{16}/g },
  { name: 'Private key header', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
];
const ignoredDirs = new Set(['.git', 'node_modules', 'reports']);
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) scan(full);
  }
}

function scan(file) {
  const data = fs.readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    for (const match of data.matchAll(pattern.regex)) {
      findings.push({ file, rule: pattern.name, sample: `${match[0].slice(0, 8)}...` });
    }
  }
}

walk(root);
const unexpected = findings.filter((item) => path.resolve(item.file) !== allowedFixture);
console.log(JSON.stringify({ total: findings.length, expectedFixtureFindings: findings.length - unexpected.length, unexpected }, null, 2));
if (unexpected.length) process.exit(2);
