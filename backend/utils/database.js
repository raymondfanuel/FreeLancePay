const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('./logger');

const dbPath = path.join(__dirname, '../data/freelancepay.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) logger.error('database open error', { error: err.message });
  else logger.info('database connected', { path: dbPath });
});

// initialize schema
const initDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // accounts table - stores created accounts
      db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          publicKey TEXT UNIQUE NOT NULL,
          secretKey TEXT NOT NULL,
          role TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) logger.error('accounts table error', { error: err.message });
      });

      // transactions table - records all payments
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hash TEXT UNIQUE NOT NULL,
          senderPublicKey TEXT NOT NULL,
          receiverPublicKey TEXT NOT NULL,
          amount TEXT NOT NULL,
          memo TEXT,
          ledger INTEGER,
          status TEXT DEFAULT 'success',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(senderPublicKey) REFERENCES accounts(publicKey),
          FOREIGN KEY(receiverPublicKey) REFERENCES accounts(publicKey)
        )
      `, (err) => {
        if (err) logger.error('transactions table error', { error: err.message });
        else resolve();
      });
    });
  });
};

// account methods
const dbMethods = {
  // save account to DB
  saveAccount: (publicKey, secretKey, role) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO accounts (publicKey, secretKey, role) VALUES (?, ?, ?)',
        [publicKey, secretKey, role],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, publicKey, secretKey, role });
        }
      );
    });
  },

  // get account by public key
  getAccount: (publicKey) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM accounts WHERE publicKey = ?',
        [publicKey],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  // get all accounts
  getAllAccounts: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, publicKey, role, createdAt FROM accounts', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // record transaction
  saveTransaction: (hash, senderPublicKey, receiverPublicKey, amount, memo, ledger) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO transactions 
         (hash, senderPublicKey, receiverPublicKey, amount, memo, ledger, status)
         VALUES (?, ?, ?, ?, ?, ?, 'success')`,
        [hash, senderPublicKey, receiverPublicKey, amount, memo, ledger],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, hash });
        }
      );
    });
  },

  // get transactions for an account (sent or received)
  getAccountTransactions: (publicKey, limit = 50) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM transactions 
         WHERE senderPublicKey = ? OR receiverPublicKey = ?
         ORDER BY createdAt DESC
         LIMIT ?`,
        [publicKey, publicKey, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  // get all transactions
  getAllTransactions: (limit = 100) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM transactions ORDER BY createdAt DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },
};

module.exports = { db, initDB, ...dbMethods };
