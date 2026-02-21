const express = require('express');
const router = express.Router();
const stellar = require('../stellarService');
const asyncHandler = require('../utils/asyncHandler');
const { saveAccount } = require('../utils/database');
const logger = require('../utils/logger');

// POST /create-account/employer
router.post(
  '/employer',
  asyncHandler(async (req, res) => {
    const keys = await stellar.createKeypairAndFund();
    // attempt to add USDC trustline automatically so new accounts can receive USDC
    let trustResult = null;
    try {
      trustResult = await stellar.addUSDCTrustline(keys.secretKey);
      logger.info('auto trustline added for new account', { publicKey: keys.publicKey });
    } catch (tErr) {
      // do not fail account creation for trustline errors, just log and continue
      logger.warn('auto trustline failed for new account', { publicKey: keys.publicKey, error: tErr.message });
      trustResult = { error: tErr.message };
    }
    // save to database
    try {
      await saveAccount(keys.publicKey, keys.secretKey, 'employer');
      logger.info('employer account created and saved', { publicKey: keys.publicKey });
    } catch (dbErr) {
      logger.warn('failed to save employer to db', { error: dbErr.message });
    }

    res.json({ success: true, role: 'employer', ...keys, trustResult });
  })
);

// POST /create-account/freelancer
router.post(
  '/freelancer',
  asyncHandler(async (req, res) => {
    const keys = await stellar.createKeypairAndFund();
    // attempt to add USDC trustline automatically so new accounts can receive USDC
    let trustResult = null;
    try {
      trustResult = await stellar.addUSDCTrustline(keys.secretKey);
      logger.info('auto trustline added for new account', { publicKey: keys.publicKey });
    } catch (tErr) {
      logger.warn('auto trustline failed for new account', { publicKey: keys.publicKey, error: tErr.message });
      trustResult = { error: tErr.message };
    }
    // save to database
    try {
      await saveAccount(keys.publicKey, keys.secretKey, 'freelancer');
      logger.info('freelancer account created and saved', { publicKey: keys.publicKey });
    } catch (dbErr) {
      logger.warn('failed to save freelancer to db', { error: dbErr.message });
    }

    res.json({ success: true, role: 'freelancer', ...keys, trustResult });
  })
);

module.exports = router;
