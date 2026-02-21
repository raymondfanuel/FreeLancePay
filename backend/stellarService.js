const StellarSdk = require('stellar-sdk');
const axios = require('axios');
require('dotenv').config();

const config = require('./config');
const logger = require('./utils/logger');

const horizonUrl = config.horizonUrl;
// Server class moved under Horizon namespace in newer versions
const server = new StellarSdk.Horizon.Server(horizonUrl);
// network passphrase will be provided per-transaction below

const USDC_ISSUER = config.usdcIssuer;
const USDC = new StellarSdk.Asset('USDC', USDC_ISSUER);
const FRIEND_BOT_URL = 'https://friendbot.stellar.org';

async function fundAccount(publicKey) {
  try {
    const response = await axios.get(`${FRIEND_BOT_URL}?addr=${publicKey}`);
    return response.data;
  } catch (err) {
    const detail = err.response?.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : err.message;
    throw new Error(`friendbot failed: ${detail}`);
  }
}

async function createKeypairAndFund() {
  const pair = StellarSdk.Keypair.random();
  await fundAccount(pair.publicKey());
  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
  };
}

async function addUSDCTrustline(secretKey) {
  try {
    const pair = StellarSdk.Keypair.fromSecret(secretKey);
    const account = await server.loadAccount(pair.publicKey());
    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: config.network === 'TESTNET' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC,
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: USDC,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(pair);
    const result = await server.submitTransaction(transaction);
    logger.info('trustline added', { publicKey: pair.publicKey() });
    return result;
  } catch (err) {
    logger.error('addUSDCTrustline failure', { error: err.message });
    const rc = err.response?.data?.extras?.result_codes;
    const detail = rc ? (typeof rc === 'string' ? rc : JSON.stringify(rc)) : err.message;
    throw new Error(detail);
  }
}

async function sendUSDCPayment({ senderSecret, receiverPublic, amount, memoText }) {
  try {
    const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
    const account = await server.loadAccount(senderKeypair.publicKey());
    const fee = await server.fetchBaseFee();

    // Preflight: ensure sender has enough USDC balance to cover the payment
    try {
      const usdcBal = account.balances.find((b) => b.asset_code === 'USDC' && b.asset_issuer === USDC_ISSUER);
      const numericBal = usdcBal ? parseFloat(usdcBal.balance) : 0;
      if (numericBal < Number(amount)) {
        throw new Error(`insufficient_balance: sender has ${numericBal} USDC, needs ${amount}`);
      }
    } catch (preflightErr) {
      // throw a clear error that callers can map
      throw new Error(preflightErr.message || 'insufficient balance for USDC payment');
    }

    const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: config.network === 'TESTNET' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receiverPublic,
          asset: USDC,
          amount: amount.toString(),
        })
      )
      .setTimeout(30);

    if (memoText) {
      transactionBuilder.addMemo(StellarSdk.Memo.text(memoText));
    }

    const transaction = transactionBuilder.build();
    transaction.sign(senderKeypair);
    const result = await server.submitTransaction(transaction);
    logger.info('sent payment', { from: senderKeypair.publicKey(), to: receiverPublic, amount });
    return {
      hash: result.hash,
      fee_charged: result.fee_charged,
      ledger: result.ledger,
    };
  } catch (err) {
    logger.error('sendUSDCPayment failure', { error: err.message, raw: err });
    // If Horizon returned structured extras, extract codes
    const rc = err.response?.data?.extras?.result_codes || err.response?.data?.extras || null;
    // Map common Horizon operation errors to friendly messages
    if (rc && rc.operations && Array.isArray(rc.operations)) {
      if (rc.operations.includes('op_no_trust')) {
        throw new Error('op_no_trust: recipient does not trust USDC');
      }
      if (rc.operations.includes('op_underfunded')) {
        throw new Error('op_underfunded: insufficient balance to perform the operation');
      }
    }

    // Fallback: preserve original message
    const detail = rc ? (typeof rc === 'string' ? rc : JSON.stringify(rc)) : err.message || String(err);
    throw new Error(detail);
  }
}

async function getBalances(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const balances = account.balances.map((bal) => {
      if (bal.asset_type === 'native') {
        return { asset: 'XLM', balance: bal.balance };
      }
      return { asset: bal.asset_code, issuer: bal.asset_issuer, balance: bal.balance };
    });
    return balances;
  } catch (err) {
    logger.error('getBalances failure', { publicKey, error: err.message });
    const rc = err.response?.data?.extras?.result_codes;
    const detail = rc ? (typeof rc === 'string' ? rc : JSON.stringify(rc)) : err.message;
    throw new Error(detail);
  }
}

module.exports = {
  createKeypairAndFund,
  addUSDCTrustline,
  sendUSDCPayment,
  getBalances,
};
