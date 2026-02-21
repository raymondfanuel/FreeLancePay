const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');

// GET /balance/:publicKey
router.get('/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  try {
    const balances = await stellar.getBalances(publicKey);
    res.json({ success: true, balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;