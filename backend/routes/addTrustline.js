const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');

// POST /add-trustline
// body: { secretKey }
router.post('/', async (req, res) => {
  const { secretKey } = req.body;
  if (!secretKey) {
    return res.status(400).json({ success: false, error: 'missing secretKey' });
  }
  try {
    const result = await stellar.addUSDCTrustline(secretKey);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
