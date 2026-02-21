const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');

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
    const tx = await stellar.sendUSDCPayment({
      senderSecret,
      receiverPublic,
      amount,
      memoText: memo,
    });
    res.json({ success: true, transaction: tx });
  })
);

module.exports = router;