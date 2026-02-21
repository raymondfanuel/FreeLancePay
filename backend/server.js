const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const logger = require('./utils/logger');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const { initDB } = require('./utils/database');

const createAccountRouter = require('./routes/createAccount');
const addTrustlineRouter = require('./routes/addTrustline');
const sendPaymentRouter = require('./routes/sendPayment');
const getBalanceRouter = require('./routes/getBalance');
const transactionHistoryRouter = require('./routes/transactionHistory');
const getConfigRouter = require('./routes/getConfig');

const app = express();

// security headers
app.use(helmet());
// enable CORS
app.use(cors());
// parse JSON bodies
app.use(express.json());
// log all requests
app.use(requestLogger);
// basic rate limiting
app.use(rateLimit(config.rateLimit));

// health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// versioned API namespace
app.use('/api/v1/create-account', createAccountRouter);
app.use('/api/v1/add-trustline', addTrustlineRouter);
app.use('/api/v1/send-payment', sendPaymentRouter);
app.use('/api/v1/balance', getBalanceRouter);
app.use('/api/v1/transactions', transactionHistoryRouter);
app.use('/api/v1/config', getConfigRouter);

// central error handler (should be last middleware)
app.use(errorHandler);

const port = config.port;
const server = app.listen(port, async () => {
  // initialize database on startup
  await initDB();
  logger.info(`FreeLancePay backend listening on port ${port}`);
});

// export for testing
module.exports = { app, server };
