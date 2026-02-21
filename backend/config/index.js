// central configuration
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  horizonUrl: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
  usdcIssuer: process.env.USDC_ISSUER,
  network: process.env.STELLAR_NETWORK || 'TESTNET',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to X requests per windowMs
  },
};