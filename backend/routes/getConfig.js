const express = require('express');
const router = express.Router();
const config = require('../config');

// Return non-sensitive public config for frontend guidance
router.get('/', (req, res) => {
  res.json({
    usdcIssuer: config.usdcIssuer || null,
    network: config.network || 'TESTNET',
  });
});

module.exports = router;
