const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');

// POST /add-trustline
// body: { secretKey }
router.post(
  '/',
  [body('secretKey').isString().notEmpty().withMessage('secretKey required')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { secretKey } = req.body;
    const result = await stellar.addUSDCTrustline(secretKey);
    res.json({ success: true, result });
  })
);

module.exports = router;
