const express = require('express');const express = require('express');
























module.exports = router;});  }    res.status(500).json({ success: false, error: err.message });  } catch (err) {    res.json({ success: true, transaction: tx });    });      memoText: memo,      amount,      receiverPublic,      senderSecret,    const tx = await stellar.sendUSDCPayment({  try {  }    return res.status(400).json({ success: false, error: 'missing required fields' });  if (!senderSecret || !receiverPublic || !amount) {  const { senderSecret, receiverPublic, amount, memo } = req.body;router.post('/', async (req, res) => {// body: { senderSecret, receiverPublic, amount, memo }// POST /send-paymentconst stellar = require('../stellarService');const router = express.Router();const router = express.Router();
const stellar = require('../stellarService');

// POST /send-payment
// body: { senderSecret, receiverPublic, amount, memo }
router.post('/', async (req, res) => {
  const { senderSecret, receiverPublic, amount, memo } = req.body;
  if (!senderSecret || !receiverPublic || !amount) {
    return res.status(400).json({ success: false, error: 'missing required fields' });
  }
  try {
    const result = await stellar.sendUSDCPayment({
      senderSecret,
      receiverPublic,
      amount,
      memoText: memo,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;