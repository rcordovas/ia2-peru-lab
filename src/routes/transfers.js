'use strict';

const express = require('express');
const { requireAuth } = require('../middleware');
const store = require('../store');
const logger = require('../logger');
const paymentService = require('../services/paymentService');

const router = express.Router();

router.get('/accounts', requireAuth, (req, res) => {
  return res.json({ accounts: store.listAccounts() });
});

router.get('/transfers', requireAuth, (req, res) => {
  return res.json({ transfers: store.listTransfers() });
});

router.post('/transfers/preview', requireAuth, (req, res) => {
  try {
    const preview = paymentService.buildPreview(req.body || {});
    logger.info('transfer_preview', {
      requestId: req.requestId,
      userId: req.session.userId,
      fromAccount: preview.fromAccount,
      toAccount: preview.toAccount,
      amount: preview.amount,
      currency: preview.currency
    });
    return res.json(preview);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message, requestId: req.requestId });
  }
});

router.post('/transfers/execute', requireAuth, (req, res) => {
  try {
    const transfer = paymentService.executeTransfer(req.body || {}, req.session.userId);
    logger.info('transfer_processed', {
      requestId: req.requestId,
      transferId: transfer.id,
      userId: req.session.userId,
      amount: transfer.amount,
      currency: transfer.currency
    });
    return res.status(201).json(transfer);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message, requestId: req.requestId });
  }
});

module.exports = router;
