'use strict';

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'production',
  labMode: String(process.env.LAB_MODE || 'true').toLowerCase() === 'true',
  logSessionTokens: String(process.env.LOG_SESSION_TOKENS || 'true').toLowerCase() === 'true',
  sessionTtlMs: Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000)
};
