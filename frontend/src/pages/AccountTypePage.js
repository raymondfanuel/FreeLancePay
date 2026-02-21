import './styles.css';

export default function AccountTypePage({ onSelectType }) {
  return (
    <div className="account-type-wrapper">
      <style>{`
        .account-type-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Syne', sans-serif;
        }
        
        .account-type-container {
          max-width: 800px;
          width: 100%;
        }
        
        .account-type-header {
          text-align: center;
          color: white;
          margin-bottom: 50px;
        }
        
        .account-type-header h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        
        .account-type-header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .account-type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        .account-card {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          padding: 40px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
        }
        
        .account-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .account-card-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .account-card h3 {
          font-size: 24px;
          color: #333;
          margin-bottom: 12px;
        }
        
        .account-card p {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .account-card-features {
          text-align: left;
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          font-size: 13px;
          color: #555;
          margin-bottom: 20px;
        }
        
        .account-card-features li {
          margin-bottom: 8px;
        }
        
        .account-card button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          transition: opacity 0.3s;
        }
        
        .account-card button:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .account-type-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="account-type-container">
        <div className="account-type-header">
          <h2>Choose Your Role</h2>
          <p>Select whether you're hiring or providing services</p>
        </div>
        
        <div className="account-type-cards">
          <div className="account-card">
            <div className="account-card-icon">💼</div>
            <h3>Employer</h3>
            <p>Hire freelancers and pay for work</p>
            <ul className="account-card-features">
              <li>✓ Pay freelancers in USDC</li>
              <li>✓ Track payments history</li>
              <li>✓ Manage team members</li>
              <li>✓ Instant settlement</li>
            </ul>
            <button onClick={() => onSelectType('employer')}>
              Continue as Employer
            </button>
          </div>
          
          <div className="account-card">
            <div className="account-card-icon">🚀</div>
            <h3>Freelancer</h3>
            <p>Provide services and get paid instantly</p>
            <ul className="account-card-features">
              <li>✓ Receive USDC payments</li>
              <li>✓ Withdraw anytime</li>
              <li>✓ No hidden fees</li>
              <li>✓ Global access</li>
            </ul>
            <button onClick={() => onSelectType('freelancer')}>
              Continue as Freelancer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
