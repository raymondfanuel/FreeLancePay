const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

async function handle(res) {
  let json;
  try {
    json = await res.json();
  } catch (parseErr) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }
  
  if (!res.ok) {
    // Extract error message from various possible locations
    let errorMsg = "Unknown error";
    
    if (json?.error) {
      errorMsg = typeof json.error === 'string' ? json.error : JSON.stringify(json.error);
    } else if (json?.message) {
      errorMsg = typeof json.message === 'string' ? json.message : JSON.stringify(json.message);
    } else if (json?.errors?.[0]?.msg) {
      errorMsg = json.errors[0].msg;
    } else if (json?.msg) {
      errorMsg = json.msg;
    } else {
      // Fallback: use entire response
      errorMsg = `Request failed with status ${res.status}`;
    }
    
    // Ensure we have a plain string
    const fullError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
    
    console.error('API Error:', { 
      status: res.status, 
      error: fullError, 
      fullResponse: json 
    });
    
    throw new Error(fullError);
  }
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

export async function getTransactionHistory(publicKey, limit = 50) {
  const res = await fetch(`${API}/api/v1/transactions/account/${publicKey}?limit=${limit}`);
  return handle(res);
}

export async function getAllTransactions(limit = 100) {
  const res = await fetch(`${API}/api/v1/transactions?limit=${limit}`);
  return handle(res);
}
