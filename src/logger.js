'use strict';

function emit(level, event, fields = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: 'ia2-peru-api',
    ...fields
  };
  process.stdout.write(`${JSON.stringify(record)}\n`);
}

module.exports = {
  info(event, fields) { emit('info', event, fields); },
  warn(event, fields) { emit('warn', event, fields); },
  error(event, fields) { emit('error', event, fields); }
};
