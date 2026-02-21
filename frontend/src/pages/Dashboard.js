import { useEffect, useState } from "react";
import { getBalances } from "../api";
import PaymentForm from "../components/PaymentForm";
import BalanceCard from "../components/BalanceCard";

export default function Dashboard() {
  const [balances, setBalances] = useState(null);

  const load = async () => {
    const data = await getBalances();
    setBalances(data);
  };

  useEffect(() => { load(); }, []);

  if (!balances) return <p>Loading...</p>;

  return (
    <div>
      <h2>FreeLancePay Dashboard</h2>

      <PaymentForm refresh={load} />

      <div style={{display:"flex", gap:"20px"}}>
        <BalanceCard title="Employer" balances={balances.employer}/>
        <BalanceCard title="Freelancer" balances={balances.freelancer}/>
      </div>
    </div>
  );
}