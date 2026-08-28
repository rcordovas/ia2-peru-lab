'use strict';

const crypto = require('crypto');
const store = require('./store');
const logger = require('./logger');

function requestContext(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  res.setHeader('X-Lab-Environment', 'authorized-training');
  const started = Date.now();
  res.on('finish', () => {
    logger.info('http_request', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - started
    });
  });
  next();
}

function requireAuth(req, res, next) {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const session = token ? store.getSession(token) : null;

  if (!session || session.expiresAt <= Date.now()) {
    return res.status(401).json({ error: 'unauthorized', requestId: req.requestId });
  }

  req.session = session;
  req.sessionToken = token;
  return next();
}

module.exports = { requestContext, requireAuth };
