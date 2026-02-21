export default function BalanceCard({ title, balances }) {
  if (!balances) {
    return (
      <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>{title}</h3>
        <p style={{ color: '#999' }}>No balances available</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {balances.length === 0 ? (
        <p style={{ color: '#999' }}>No balances</p>
      ) : (
        <div>
          {balances.map((bal) => (
            <div key={bal.asset} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '3px' }}>
              <strong>{bal.asset}</strong>: {bal.balance}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
