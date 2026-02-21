export default function BalanceCard({ title, balances }) {
  return (
    <div>
      <h3>{title}</h3>
      <pre>{JSON.stringify(balances, null, 2)}</pre>
    </div>
  );
}