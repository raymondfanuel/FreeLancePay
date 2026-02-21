# FreeLancePay Backend

This Express server provides a thin API layer on top of the Stellar testnet for creating
accounts, adding USDC trustlines and sending payments between them. It is designed to
be lightweight, secure and easy to extend.

## Features implemented

* Centralized configuration using `config/index.js`
* Comprehensive request validation using `express-validator`
* Structured logging with `winston` and `morgan`
* Security headers (`helmet`), CORS and rate limiting
* Centralized error handling middleware
* Health-check endpoint
* Versioned API (`/api/v1/*`)
* Unit tests with Jest and Supertest
* Learnable code layout (controllers/services/routes/middlewares)

## Running

```bash
cd backend
npm install
npm run dev    # start with nodemon
npm test       # run unit tests
npm run lint   # ensure code style (eslint required)
```

Environment variables (`.env`):

```
HORIZON_URL=https://horizon-testnet.stellar.org
USDC_ISSUER=<your-usdc-issuer-public-key>
PORT=5000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

## API Overview

| Path | Method | Description |
|------|--------|-------------|
| `/health` | GET | Basic health check |
| `/api/v1/create-account/employer` | POST | Generate a funded keypair for an employer |
| `/api/v1/create-account/freelancer` | POST | Generate a funded keypair for a freelancer |
| `/api/v1/add-trustline` | POST | Add USDC trustline to an account |
| `/api/v1/send-payment` | POST | Send USDC payment between accounts |
| `/api/v1/balance/:publicKey` | GET | Retrieve balances for an account |

Request/response examples are available in the frontend documentation.

---

The backend is intentionally stateless; production use should add authentication and
persist transaction records to a database if needed.
