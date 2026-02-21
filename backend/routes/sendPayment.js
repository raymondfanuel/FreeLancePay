const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');

// POST /send-payment
// body: { senderSecret, receiverPublic, amount, memo }
router.post('/', async (req, res) => {
  const { senderSecret, receiverPublic, amount, memo } = req.body;
  if (!senderSecret || !receiverPublic || !amount) {
    return res.status(400).json({ success: false, error: 'missing required field' });
  }
  try {
    const tx = await stellar.sendUSDCPayment({
      senderSecret,
      receiverPublic,
      amount,
      memoText: memo,
    });
    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;