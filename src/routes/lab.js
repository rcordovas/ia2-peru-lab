'use strict';

const express = require('express');
const config = require('../config');
const { requireAuth } = require('../middleware');
const store = require('../store');

const router = express.Router();

router.post('/reset', requireAuth, (req, res) => {
  if (!config.labMode) {
    return res.status(404).json({ error: 'not_found' });
  }
  if (req.get('X-Lab-Reset') !== 'IA2-RESET') {
    return res.status(403).json({ error: 'lab_reset_header_required' });
  }
  store.resetLab();
  return res.json({ status: 'reset', note: 'Vuelva a iniciar sesion; las sesiones fueron eliminadas.' });
});

module.exports = router;
