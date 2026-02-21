const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');
const { saveTransaction } = require('../utils/database');
const logger = require('../utils/logger');
const StellarSdk = require('stellar-sdk');

// POST /send-payment
// body: { senderSecret, receiverPublic, amount, memo }
router.post(
  '/',
  [
    body('senderSecret').isString().notEmpty().withMessage('senderSecret required'),
    body('receiverPublic').isString().notEmpty().withMessage('receiverPublic required'),
    body('amount').isNumeric({ gt: 0 }).withMessage('amount must be a positive number'),
    body('memo').optional().isString().trim().escape(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { senderSecret, receiverPublic, amount, memo } = req.body;
    let tx;
    try {
      tx = await stellar.sendUSDCPayment({
        senderSecret,
        receiverPublic,
        amount,
        memoText: memo,
      });
    } catch (sendErr) {
      // Normalize Stellar/go-horizon error payloads
      logger.error('stellar send failed', { error: sendErr.message });
      let parsed;
      try {
        parsed = typeof sendErr.message === 'string' && sendErr.message.startsWith('{') ? JSON.parse(sendErr.message) : null;
      } catch (e) {
        parsed = null;
      }

      // Inspect parsed or raw message for common codes
      let userMessage = sendErr.message || 'Payment failed';
      if (parsed) {
        // Example parsed: { transaction: 'tx_failed', operations: ['op_no_trust'] }
        if (Array.isArray(parsed.operations) && parsed.operations.includes('op_no_trust')) {
          userMessage = 'Recipient does not trust USDC (op_no_trust). Recipient must add a USDC trustline before receiving USDC.';
        } else if (parsed.transaction === 'tx_failed') {
          userMessage = `Transaction failed: ${JSON.stringify(parsed)}`;
        } else {
          userMessage = JSON.stringify(parsed);
        }
      } else if (String(sendErr.message).includes('op_no_trust')) {
        userMessage = 'Recipient does not trust USDC (op_no_trust). Recipient must add a USDC trustline before receiving USDC.';
      }

      return res.status(400).json({ success: false, error: userMessage, details: parsed || sendErr.message });
    }

    // save transaction to database
    try {
      const senderKey = StellarSdk.Keypair.fromSecret(senderSecret);
      await saveTransaction(
        tx.hash,
        senderKey.publicKey(),
        receiverPublic,
        amount.toString(),
        memo || null,
        tx.ledger
      );
      logger.info('transaction recorded', { hash: tx.hash });
    } catch (dbErr) {
      logger.warn('failed to save transaction to db', { error: dbErr.message });
    }

    res.json({ success: true, transaction: tx });
  })
);

module.exports = router;
