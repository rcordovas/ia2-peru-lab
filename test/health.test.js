'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/server');

test('health endpoint returns lab metadata', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();

  const body = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${address.port}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'ia2-peru-lab');
  await new Promise((resolve) => server.close(resolve));
});
