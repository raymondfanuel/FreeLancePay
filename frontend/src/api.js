const API = "http://localhost:5000"; // Python backend

export async function getBalances() {
  const res = await fetch(`${API}/balances`);
  return res.json();
}

export async function payFreelancer(amount) {
  const res = await fetch(`${API}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  return res.json();
}