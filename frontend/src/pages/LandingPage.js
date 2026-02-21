export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
        }
        
        .landing-content {
          max-width: 600px;
          text-align: center;
          color: white;
          padding: 40px;
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        
        .landing-content h1 {
          font-size: 48px;
          margin-bottom: 20px;
          font-weight: 800;
        }
        
        .landing-content p {
          font-size: 18px;
          margin-bottom: 40px;
          line-height: 1.6;
          opacity: 0.95;
        }
        
        .landing-content button {
          background: white;
          color: #667eea;
          border: none;
          padding: 16px 40px;
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.3s;
        }
        
        .landing-content button:hover {
          transform: scale(1.05);
        }
        
        .features {
          display: grid;
          gap: 20px;
          margin-top: 40px;
          text-align: left;
        }
        
        .feature-item {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 8px;
        }
        
        .feature-item strong {
          display: block;
          margin-bottom: 5px;
        }
      `}</style>
      
      <div className="landing-content">
        <h1>💰 FreeLancePay</h1>
        <p>Fast, secure, and transparent payments on the Stellar blockchain</p>
        
        <div className="features">
          <div className="feature-item">
            <strong>⚡ Instant Payments</strong>
            Send USDC instantly to freelancers worldwide
          </div>
          <div className="feature-item">
            <strong>🔒 Secure</strong>
            Full control of your keys and transactions
          </div>
          <div className="feature-item">
            <strong>📊 Track History</strong>
            Complete transaction audit trail
          </div>
        </div>
        
        <button onClick={onGetStarted} style={{ marginTop: '40px', width: '100%' }}>
          Get Started →
        </button>
      </div>
    </div>
  );
}
