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
    throw new Error(`friendbot failed: ${err.response?.data || err.message}`);
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
    throw new Error(err.response?.data?.extras?.result_codes || err.message);
  }
}

async function sendUSDCPayment({ senderSecret, receiverPublic, amount, memoText }) {
  try {
    const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
    const account = await server.loadAccount(senderKeypair.publicKey());
    const fee = await server.fetchBaseFee();

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
    logger.error('sendUSDCPayment failure', { error: err.message });
    throw new Error(err.response?.data?.extras?.result_codes || err.message);
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
    throw new Error(err.response?.data?.extras?.result_codes || err.message);
  }
}

module.exports = {
  createKeypairAndFund,
  addUSDCTrustline,
  sendUSDCPayment,
  getBalances,
};
