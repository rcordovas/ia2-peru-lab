'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const logger = require('./logger');
const { requestContext } = require('./middleware');
const authRoutes = require('./routes/auth');
const transferRoutes = require('./routes/transfers');
const labRoutes = require('./routes/lab');

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:']
    }
  }
}));
app.use(express.json({ limit: '64kb' }));
app.use(requestContext);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ia2-peru-lab',
    environment: config.nodeEnv,
    labMode: config.labMode
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', transferRoutes);
app.use('/api/lab', labRoutes);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res) => {
  res.status(404).json({ error: 'not_found', requestId: req.requestId });
});

if (require.main === module) {
  app.listen(config.port, '0.0.0.0', () => {
    logger.info('service_started', {
      port: config.port,
      nodeEnv: config.nodeEnv,
      labMode: config.labMode,
      warning: 'AUTHORIZED TRAINING ENVIRONMENT - SYNTHETIC DATA ONLY'
    });
  });
}

module.exports = app;
