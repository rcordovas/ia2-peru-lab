'use strict';

const express = require('express');
const crypto = require('crypto');
const config = require('../config');
const store = require('../store');
const logger = require('../logger');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = store.getUserByEmail(email);

  if (!user || password !== user.password) {
    logger.warn('login_failed', { requestId: req.requestId, email: String(email || '') });
    return res.status(401).json({ error: 'invalid_credentials', requestId: req.requestId });
  }

  const sessionToken = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + config.sessionTtlMs;
  store.createSession(sessionToken, user.id, expiresAt);

  // Registro operacional para correlacion de autenticacion en el entorno de entrenamiento.
  if (config.logSessionTokens) {
    logger.info('login_success', {
      requestId: req.requestId,
      userId: user.id,
      sessionToken,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } else {
    logger.info('login_success', {
      requestId: req.requestId,
      userId: user.id,
      expiresAt: new Date(expiresAt).toISOString()
    });
  }

  return res.json({
    token: sessionToken,
    expiresAt,
    user: { id: user.id, displayName: user.displayName, email: user.email }
  });
});

module.exports = router;
