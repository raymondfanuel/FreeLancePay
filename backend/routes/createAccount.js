const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');

// POST /create-account/employer
router.post('/employer', async (req, res) => {
  try {
    const keys = await stellar.createKeypairAndFund();
    res.json({ success: true, role: 'employer', ...keys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /create-account/freelancer
router.post('/freelancer', async (req, res) => {
  try {
    const keys = await stellar.createKeypairAndFund();
    res.json({ success: true, role: 'freelancer', ...keys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
