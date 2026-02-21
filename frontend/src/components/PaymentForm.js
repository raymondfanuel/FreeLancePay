import { useState } from "react";
import { payFreelancer } from "../api";

export default function PaymentForm({ refresh }) {
  const [amount, setAmount] = useState("10");
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    setStatus("Sending payment...");
    const res = await payFreelancer(amount);

    if (res.hash) {
      setStatus(`✅ Success: ${res.hash}`);
      refresh();
    } else {
      setStatus("❌ Payment failed");
    }
  };

  return (
    <div>
      <h3>Pay Freelancer</h3>
      <input value={amount} onChange={e=>setAmount(e.target.value)} />
      <button onClick={handlePay}>Send USDC</button>
      <p>{status}</p>
    </div>
  );
}