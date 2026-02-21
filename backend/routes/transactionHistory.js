const express = require('express');
const { param, query, validationResult } = require('express-validator');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { getAccountTransactions, getAllTransactions } = require('../utils/database');

// GET /api/v1/transactions/account/:publicKey
// retrieve transaction history for a specific account
router.get(
  '/account/:publicKey',
  [
    param('publicKey').isString().notEmpty().withMessage('publicKey required'),
    query('limit').optional().isInt({ max: 500 }).toInt(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { publicKey } = req.params;
    const limit = req.query.limit || 50;
    const transactions = await getAccountTransactions(publicKey, limit);
    res.json({ success: true, count: transactions.length, transactions });
  })
);

// GET /api/v1/transactions
// retrieve all recorded transactions
router.get(
  '/',
  [query('limit').optional().isInt({ max: 500 }).toInt()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const limit = req.query.limit || 100;
    const transactions = await getAllTransactions(limit);
    res.json({ success: true, count: transactions.length, transactions });
  })
);

module.exports = router;
