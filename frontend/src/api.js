const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // backend base url

async function handle(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'request failed');
  return json;
}

export async function getBalances(publicKey) {
  const res = await fetch(`${API}/api/v1/balance/${publicKey}`);
  return handle(res);
}

export async function createAccount(role = 'freelancer') {
  const res = await fetch(`${API}/api/v1/create-account/${role}`, {
    method: 'POST',
  });
  return handle(res);
}

export async function addTrustline(secretKey) {
  const res = await fetch(`${API}/api/v1/add-trustline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secretKey }),
  });
  return handle(res);
}

export async function sendPayment({ senderSecret, receiverPublic, amount, memo }) {
  const res = await fetch(`${API}/api/v1/send-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderSecret, receiverPublic, amount, memo }),
  });
  return handle(res);
}
