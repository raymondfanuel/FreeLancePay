# FreeLancePay Frontend

This React application provides a minimal UI for interacting with the FreeLancePay backend. It requires the backend server to be running (default `http://localhost:5000`).

## Quick start

```bash
cd frontend
npm install
# start backend in a separate terminal (see backend/README.md)
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Environment

You can override the backend URL by setting:

```bash
REACT_APP_BACKEND_URL=http://your-host:5000 npm start
```

## Workflow

1. Launch backend server (`npm run dev` under `backend/`).
2. In frontend, click **Create Employer** and **Create Freelancer** – these use the API to create two testnet accounts and automatically add USDC trustlines.
3. After accounts are created, the balance cards display each account's balances.
4. Use the payment form to transfer USDC from the employer to the freelancer; balances refresh automatically.
5. Raw keys are shown at the bottom for debugging (never use real secrets in production!).

## API Endpoints Used

* `POST /api/v1/create-account/employer`
* `POST /api/v1/create-account/freelancer`
* `POST /api/v1/add-trustline`
* `GET /api/v1/balance/:publicKey`
* `POST /api/v1/send-payment`

CORS is enabled on the backend so cross-origin requests should work out of the box.

## Scripts

Standard CRA commands are available (`npm start`, `npm test`, `npm run build`).

---

The rest of this file has been replaced with custom project instructions. Remove the boilerplate if you ejected or feel comfortable managing your own configuration.
