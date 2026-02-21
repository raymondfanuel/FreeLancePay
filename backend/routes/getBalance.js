const express = require('express');
const { param, validationResult } = require('express-validator');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');

// GET /balance/:publicKey
router.get(
  '/:publicKey',
  [param('publicKey').isString().notEmpty().withMessage('publicKey required')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { publicKey } = req.params;
    const balances = await stellar.getBalances(publicKey);
    res.json({ success: true, balances });
  })
);

module.exports = router;