import { useEffect, useState } from "react";
import { getBalances, sendPayment } from "../api";

export default function Dashboard({ account, onLogout }) {
  const [accountData, setAccountData] = useState(account || null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadBalances = async () => {
    setLoading(true);
    try {
      if (accountData?.publicKey) {
        const res = await getBalances(accountData.publicKey);
        setAccountData((a) => ({ ...a, balances: res.balances || [] }));
      }
    } catch (err) {
      console.error("balance load error", err);
      showNotification("Failed to load balances", "error");
    } finally {
      setLoading(false);
      setRefreshKey((k) => k + 1);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (accountData?.publicKey) {
      loadBalances();
    }
  }, [accountData?.publicKey]);

  const totalUSDC = () => {
    if (!accountData?.balances) return "0.00";
    const usdc = accountData.balances.find((b) => b.asset === "USDC" || b.asset?.includes("USDC"));
    return usdc ? parseFloat(usdc.balance).toFixed(2) : "0.00";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #16161f;
          --border: rgba(255,255,255,0.07);
          --border-glow: rgba(99,102,241,0.3);
          --accent: #6366f1;
          --accent2: #22d3ee;
          --accent3: #f59e0b;
          --success: #10b981;
          --error: #ef4444;
          --text: #f1f5f9;
          --text-muted: #64748b;
          --text-dim: #94a3b8;
          --glow: rgba(99,102,241,0.15);
        }

        body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; }

        .app-wrapper {
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(34,211,238,0.08) 0%, transparent 60%);
        }

        /* HEADER */
        .header {
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10,10,15,0.85);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .logo-text span { color: var(--accent); }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 100px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: var(--success);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* MAIN LAYOUT */
        .main {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px;
        }

        /* STATS ROW */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }

        .stat-card:hover {
          border-color: var(--border-glow);
          transform: translateY(-2px);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.5;
        }

        .stat-label {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1;
        }

        .stat-value.accent { color: var(--accent); }
        .stat-value.cyan { color: var(--accent2); }
        .stat-value.amber { color: var(--accent3); }
        .stat-value.green { color: var(--success); }

        .stat-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
          font-family: 'DM Mono', monospace;
        }

        /* SETUP SECTION */
        .setup-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 28px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::before {
          content: '';
          display: block;
          width: 3px;
          height: 14px;
          background: var(--accent);
          border-radius: 2px;
        }

        .setup-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          letter-spacing: 0.2px;
        }

        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #818cf8);
          color: white;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99,102,241,0.45);
        }

        .btn-cyan {
          background: linear-gradient(135deg, #0891b2, var(--accent2));
          color: white;
          box-shadow: 0 4px 20px rgba(34,211,238,0.2);
        }

        .btn-cyan:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(34,211,238,0.35);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
        }

        .btn-ghost:hover:not(:disabled) {
          border-color: var(--border-glow);
          color: var(--text);
          background: rgba(99,102,241,0.05);
        }

        .btn-success {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--success);
          cursor: default;
        }

        /* ACCOUNTS GRID */
        .accounts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 28px;
        }

        /* ACCOUNT PANEL */
        .account-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .account-panel:hover { border-color: rgba(255,255,255,0.12); }

        .panel-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
        }

        .role-badge {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .role-badge.employer {
          background: rgba(99,102,241,0.15);
          color: var(--accent);
          border: 1px solid rgba(99,102,241,0.25);
        }

        .role-badge.freelancer {
          background: rgba(34,211,238,0.1);
          color: var(--accent2);
          border: 1px solid rgba(34,211,238,0.2);
        }

        .panel-body { padding: 24px; }

        /* BALANCE DISPLAY */
        .balance-list { display: flex; flex-direction: column; gap: 10px; }

        .balance-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: border-color 0.2s;
        }

        .balance-item:hover { border-color: rgba(255,255,255,0.1); }

        .balance-asset {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
        }

        .asset-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
        }

        .asset-icon.usdc { background: rgba(37,99,235,0.2); color: #60a5fa; border: 1px solid rgba(37,99,235,0.3); }
        .asset-icon.xlm { background: rgba(99,102,241,0.2); color: var(--accent); border: 1px solid rgba(99,102,241,0.3); }
        .asset-icon.other { background: rgba(245,158,11,0.15); color: var(--accent3); border: 1px solid rgba(245,158,11,0.25); }

        .balance-amount {
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
        }

        .key-display {
          margin-top: 16px;
          padding: 12px 14px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        .key-label {
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .key-value {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text-dim);
          word-break: break-all;
          line-height: 1.5;
        }

        .empty-state {
          text-align: center;
          padding: 32px 20px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.5; }

        /* PAYMENT FORM */
        .payment-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }

        .payment-section::after {
          content: '';
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }

        .form-label {
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .form-input {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }

        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .form-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-pay {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--accent), #818cf8);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          letter-spacing: 0.3px;
        }

        .btn-pay:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.5);
        }

        .btn-pay:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .status-bar {
          margin-top: 14px;
          padding: 12px 16px;
          background: var(--surface2);
          border-radius: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          min-height: 42px;
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          transition: all 0.3s;
        }

        .status-bar.success { border-color: rgba(16,185,129,0.3); color: var(--success); }
        .status-bar.error { border-color: rgba(239,68,68,0.3); color: #f87171; }

        /* TRANSACTION TABLE */
        .tx-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 16px;
        }

        .tx-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tx-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .tx-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          background: rgba(99,102,241,0.1);
          color: var(--accent);
          border-radius: 100px;
          border: 1px solid rgba(99,102,241,0.2);
        }

        .tx-table { width: 100%; border-collapse: collapse; }

        .tx-table th {
          padding: 12px 20px;
          text-align: left;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
        }

        .tx-table td {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 13px;
        }

        .tx-table tr:last-child td { border-bottom: none; }

        .tx-table tr:hover td { background: rgba(255,255,255,0.02); }

        .tx-hash {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          background: var(--surface2);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .tx-direction {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          font-weight: 500;
        }

        .tx-direction.in {
          background: rgba(16,185,129,0.1);
          color: var(--success);
          border: 1px solid rgba(16,185,129,0.2);
        }

        .tx-direction.out {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .tx-amount {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 500;
        }

        /* NOTIFICATION */
        .notification {
          position: fixed;
          top: 80px;
          right: 24px;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          max-width: 340px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .notification.success {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: var(--success);
        }

        .notification.error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* SPINNER */
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* DEBUG SECTION */
        .debug-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 16px;
        }

        .debug-toggle {
          width: 100%;
          padding: 14px 20px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }

        .debug-toggle:hover { color: var(--text-dim); }

        .debug-body {
          padding: 0 20px 20px;
          overflow: auto;
          max-height: 200px;
        }

        .debug-body pre {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .main { padding: 20px; }
          .header { padding: 16px 20px; }
          .stats-row { grid-template-columns: 1fr 1fr; }
          .accounts-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app-wrapper">
        {/* NOTIFICATION */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === "success" ? "✓ " : "✗ "}{notification.message}
          </div>
        )}

        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">₿</div>
            <div className="logo-text">Free<span>Lance</span>Pay</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {loading && <div className="spinner" />}
            <div className="header-badge">
              <div className="live-dot" />
              Stellar Network
            </div>
            <button 
              onClick={onLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Logout
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="main">

          {/* STATS ROW */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total USDC</div>
              <div className="stat-value accent">${totalUSDC()}</div>
              <div className="stat-sub">Available Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Account Role</div>
              <div className="stat-value" style={{ fontSize: "18px", marginTop: "4px", textTransform: "capitalize" }}>
                {accountData?.role || "Unknown"}
              </div>
              <div className="stat-sub" style={{ marginTop: "6px", fontSize: "10px", wordBreak: "break-all" }}>
                {accountData?.publicKey?.slice(0, 16)}...
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Account Status</div>
              <div className="stat-value green" style={{ fontSize: "18px", marginTop: "4px" }}>✓ Active</div>
              <div className="stat-sub">On Stellar Testnet</div>
            </div>
          </div>

          {/* SETUP SECTION */}
          <div className="setup-section">
            <div className="section-header">
              <div className="section-title">Account Overview</div>
              <button className="btn btn-ghost" onClick={loadBalances} disabled={loading}>
                {loading ? <><div className="spinner" /> Refreshing</> : "↻ Refresh Balances"}
              </button>
            </div>
            <div style={{ 
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '12px',
              border: '1px solid var(--accent-dim)'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
                <strong>Public Key:</strong>
              </p>
              <p style={{ 
                fontSize: '11px', 
                fontFamily: '"Courier New", monospace', 
                wordBreak: 'break-all',
                color: 'var(--text-primary)',
                margin: '0',
                padding: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px'
              }}>
                {accountData?.publicKey}
              </p>
            </div>
          </div>

          {/* PAYMENT FORM */}
          <PaymentFormStyled
            refresh={loadBalances}
            account={accountData}
            onNotify={showNotification}
          />

          {/* ACCOUNT DETAILS */}
          <div className="accounts-grid" style={{ gridTemplateColumns: '1fr' }}>
            <AccountPanel title={accountData?.role ? accountData.role.charAt(0).toUpperCase() + accountData.role.slice(1) : "Account"} role={accountData?.role} account={accountData} />
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="accounts-grid" style={{ gridTemplateColumns: '1fr' }}>
            <TransactionHistoryStyled publicKey={accountData?.publicKey} forceRefresh={refreshKey} title="Transaction History" />
          </div>

        </main>
      </div>
    </>
  );
}

function AccountPanel({ title, role, account }) {
  if (!account) {
    return (
      <div className="account-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>{title}</span>
            <span className={`role-badge ${role}`}>{role}</span>
          </div>
        </div>
        <div className="panel-body">
          <div className="empty-state">
            <div className="empty-icon">{role === "employer" ? "🏢" : "💼"}</div>
            <div>No account created yet</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span>{title}</span>
          <span className={`role-badge ${role}`}>{role}</span>
        </div>
      </div>
      <div className="panel-body">
        <div className="balance-list">
          {account.balances && account.balances.length > 0 ? (
            account.balances.map((bal) => {
              const isUSDC = bal.asset?.includes("USDC");
              const isXLM = bal.asset === "XLM" || bal.asset === "native";
              return (
                <div key={bal.asset} className="balance-item">
                  <div className="balance-asset">
                    <div className={`asset-icon ${isUSDC ? "usdc" : isXLM ? "xlm" : "other"}`}>
                      {isUSDC ? "$" : isXLM ? "★" : bal.asset?.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>{isXLM ? "XLM" : bal.asset}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>
                        {isUSDC ? "USD Coin" : isXLM ? "Stellar Lumens" : "Token"}
                      </div>
                    </div>
                  </div>
                  <div className="balance-amount">{parseFloat(bal.balance).toFixed(4)}</div>
                </div>
              );
            })
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px 0" }}>No balances loaded</div>
          )}
        </div>
        {account.publicKey && (
          <div className="key-display" style={{ marginTop: "16px" }}>
            <div className="key-label">Public Key</div>
            <div className="key-value">{account.publicKey}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentFormStyled({ refresh, account, onNotify }) {
  const [amount, setAmount] = useState(10);
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("payment");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [sending, setSending] = useState(false);

  const handlePay = async () => {
    if (!account?.secretKey) {
      setStatus("Account not found");
      setStatusType("error");
      return;
    }
    if (!recipient || recipient.length < 50) {
      setStatus("Please enter a valid recipient public key");
      setStatusType("error");
      return;
    }
    if (!amount || amount <= 0) {
      setStatus("Please enter a valid amount");
      setStatusType("error");
      return;
    }
    setSending(true);
    setStatus("Sending payment...");
    setStatusType("");
    try {
      const res = await sendPayment({
        senderSecret: account.secretKey,
        receiverPublic: recipient,
        amount: parseFloat(amount),
        memo,
      });
      setStatus(`Payment sent! Tx: ${res.hash.slice(0, 24)}...`);
      setStatusType("success");
      onNotify("Payment sent successfully!", "success");
      setMemo("payment");
      setAmount(10);
      setRecipient("");
      refresh();
    } catch (err) {
      // Extract error message safely
      let errorMessage = "Unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error) {
        errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      } else {
        errorMessage = JSON.stringify(err);
      }
      // Remove [object Object] if it appears
      if (errorMessage === '[object Object]') {
        errorMessage = 'Payment processing failed. Check console for details.';
      }
      console.error('Payment error details:', { err, errorMessage });
      setStatus(`Payment failed: ${errorMessage}`);
      setStatusType("error");
      onNotify(`Payment failed: ${errorMessage}`, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="payment-section" style={{ marginBottom: "28px" }}>
      <div className="section-header">
        <div className="section-title">Send Payment</div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace" }}>
          Send USDC to any Stellar address
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Recipient Public Key</label>
          <input
            className="form-input"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={sending}
            placeholder="G..."
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Amount (USDC)</label>
          <input
            className="form-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            disabled={sending}
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Memo</label>
          <input
            className="form-input"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={sending}
            placeholder="Optional memo"
          />
        </div>
      </div>
      <button className="btn-pay" onClick={handlePay} disabled={sending || !account || !recipient}>
        {sending ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" /> Sending...</span> : "Send USDC Payment"}
      </button>
      {status && (
        <div className={`status-bar ${statusType}`}>
          {status}
        </div>
      )}
    </div>
  );
}

function TransactionHistoryStyled({ publicKey, forceRefresh, title }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const { getTransactionHistory } = await import("../api");
      const res = await getTransactionHistory(publicKey, 20);
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error("transaction history error", err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadTransactions();
  }, [publicKey, forceRefresh]);

  if (!publicKey) return null;

  return (
    <div className="tx-section">
      <div className="tx-header">
        <div className="tx-title">{title}</div>
        <div className="tx-count">{transactions.length} txns</div>
      </div>
      {loading && <div style={{ padding: "20px", color: "var(--text-muted)", fontSize: "12px", fontFamily: "'DM Mono', monospace", textAlign: "center" }}>Loading transactions...</div>}
      {!loading && transactions.length === 0 && (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px", opacity: 0.4 }}>📋</div>
          No transactions yet
        </div>
      )}
      {transactions.length > 0 && (
        <table className="tx-table">
          <thead>
            <tr>
              <th>Hash</th>
              <th>Amount</th>
              <th>Direction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncoming = tx.senderPublicKey !== publicKey;
              return (
                <tr key={tx.hash}>
                  <td><span className="tx-hash">{tx.hash.slice(0, 14)}...</span></td>
                  <td><span className="tx-amount">{tx.amount} <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>USDC</span></span></td>
                  <td>
                    <span className={`tx-direction ${isIncoming ? "in" : "out"}`}>
                      {isIncoming ? "↓ IN" : "↑ OUT"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}