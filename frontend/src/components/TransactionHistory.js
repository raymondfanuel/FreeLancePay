import { useEffect, useState } from "react";
import { getTransactionHistory } from "../api";

export default function TransactionHistory({ publicKey, forceRefresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const res = await getTransactionHistory(publicKey, 20);
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error('transaction history error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [publicKey, forceRefresh]);

  if (!publicKey) return null;

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h4>Transaction History</h4>
      {loading && <p>Loading...</p>}
      {!loading && transactions.length === 0 && <p>No transactions yet</p>}
      {transactions.length > 0 && (
        <table style={{ width: '100%', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '5px' }}>Hash</th>
              <th style={{ textAlign: 'left', padding: '5px' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '5px' }}>From/To</th>
              <th style={{ textAlign: 'left', padding: '5px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '5px' }}>
                  <code style={{ fontSize: '10px' }}>{tx.hash.slice(0, 12)}...</code>
                </td>
                <td style={{ padding: '5px' }}>{tx.amount}</td>
                <td style={{ padding: '5px', fontSize: '11px' }}>
                  {tx.senderPublicKey === publicKey ? 'Out' : 'In'}
                </td>
                <td style={{ padding: '5px' }}>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
