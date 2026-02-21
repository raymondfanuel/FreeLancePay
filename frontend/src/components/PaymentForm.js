import { useState, useEffect } from "react";
import { sendPayment, getAllTransactions, getBalances, addTrustline } from "../api";

// We'll fetch public config to show USDC issuer when needed
async function fetchConfig() {
  try {
    const res = await fetch((process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000') + '/api/v1/config');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default function PaymentForm({ refresh, employer, freelancer }) {
  const [amount, setAmount] = useState(10);
  const [memo, setMemo] = useState("work payment");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [usdcIssuer, setUsdcIssuer] = useState(null);
  const [showTrustlineHelp, setShowTrustlineHelp] = useState(false);

  const handlePay = async () => {
    if (!employer || !freelancer) {
      setStatus('❌ Create both accounts first');
      return;
    }

    if (!amount || amount <= 0) {
      setStatus('❌ Please enter a valid amount');
      return;
    }

    setSending(true);
    setStatus("⏳ Sending payment...");
    try {
      const res = await sendPayment({
        senderSecret: employer.secretKey,
        receiverPublic: freelancer.publicKey,
        amount: parseFloat(amount),
        memo,
      });

      setStatus(`✅ Success! Tx: ${res.transaction.hash.slice(0, 20)}...`);
      setMemo("work payment");
      setAmount(10);
      setTimeout(() => refresh(), 500);
    } catch (err) {
      // Normalize error message
      const errorMsg = err?.message || (typeof err === 'string' ? err : JSON.stringify(err)) || 'Unknown error';
      console.error('Payment error:', err);
      setStatus(`❌ Payment failed: ${errorMsg}`);

      // Show trustline help if error indicates missing trustline
      const lower = String(errorMsg).toLowerCase();
      if (lower.includes('op_no_trust') || lower.includes('does not trust usdc') || lower.includes('recipient does not trust')) {
        setShowTrustlineHelp(true);
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchConfig().then((cfg) => {
      if (!mounted) return;
      if (cfg && cfg.usdcIssuer) setUsdcIssuer(cfg.usdcIssuer);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: '15px', border: '2px solid #4CAF50', borderRadius: '4px', marginBottom: '20px', backgroundColor: '#f1f8f4' }}>
      <h3 style={{ marginTop: 0, color: '#2e7d32' }}>💸 Send Payment</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Amount (USDC):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          disabled={sending}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Memo (optional):</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={sending}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <button 
        onClick={handlePay}
        disabled={sending || !employer || !freelancer}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: sending ? 'not-allowed' : 'pointer',
          opacity: sending || !employer || !freelancer ? 0.5 : 1
        }}
      >
        {sending ? 'Sending...' : 'Send USDC'}
      </button>

      <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '3px', minHeight: '20px' }}>
        {status}
      </p>

      {showTrustlineHelp && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '6px' }}>
          <strong>Recipient needs a USDC trustline</strong>
          <p style={{ margin: '8px 0' }}>The recipient account does not trust USDC and cannot receive USDC payments until they add a trustline for the USDC asset.</p>
          {usdcIssuer ? (
            <p style={{ fontSize: '13px' }}>USDC Issuer: <code id="usdc-issuer" style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{usdcIssuer}</code>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(usdcIssuer);
                    setStatus('📋 USDC issuer copied to clipboard');
                  } catch (e) {
                    setStatus('⚠️ Could not copy issuer to clipboard');
                  }
                }}
                style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
              >Copy</button>
            </p>
          ) : (
            <p style={{ fontSize: '13px' }}>USDC issuer unknown (contact the platform admin).</p>
          )}
          <p style={{ marginTop: '8px', fontSize: '13px' }}>Share these instructions with the recipient:</p>
          <ol style={{ marginTop: '6px' }}>
            <li>Open the Stellar wallet (e.g., <em>Stellar Laboratory</em> or your wallet app).</li>
            <li>Add a trustline for asset code <strong>USDC</strong> issued by the issuer shown above.</li>
            <li>After the trustline is added, retry the payment.</li>
          </ol>
          <div style={{ marginTop: '8px' }}>
            <button
              onClick={async () => {
                // Ask for the recipient's secret key to add a trustline on their behalf
                const secret = window.prompt('Paste the recipient SECRET key here to add the USDC trustline (only do this if you trust the recipient and understand the risk):');
                if (!secret) return;
                setStatus('⏳ Adding trustline...');
                try {
                  const r = await addTrustline(secret);
                  setStatus('✅ Trustline added successfully');
                  setShowTrustlineHelp(false);
                } catch (e) {
                  const msg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e));
                  setStatus(`❌ Add trustline failed: ${msg}`);
                }
              }}
              style={{ padding: '8px 10px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >Add Trustline (recipient secret)</button>
          </div>
        </div>
      )}
    </div>
  );
}
