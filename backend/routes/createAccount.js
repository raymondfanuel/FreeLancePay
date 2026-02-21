const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');

// POST /create-account/employer
router.post(
  '/employer',
  asyncHandler(async (req, res) => {
    const keys = await stellar.createKeypairAndFund();
    res.json({ success: true, role: 'employer', ...keys });
  })
);

// POST /create-account/freelancer
router.post(
  '/freelancer',
  asyncHandler(async (req, res) => {
    const keys = await stellar.createKeypairAndFund();
    res.json({ success: true, role: 'freelancer', ...keys });
  })
);

module.exports = router;
