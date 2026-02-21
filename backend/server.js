const express = require('express');
const cors = require('cors');
require('dotenv').config();

const createAccountRouter = require('./routes/createAccount');
const addTrustlineRouter = require('./routes/addTrustline');
const sendPaymentRouter = require('./routes/sendPayment');
const getBalanceRouter = require('./routes/getBalance');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/create-account', createAccountRouter);
app.use('/add-trustline', addTrustlineRouter);
app.use('/send-payment', sendPaymentRouter);
app.use('/balance', getBalanceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`FreeLancePay backend listening on port ${port}`);
});
