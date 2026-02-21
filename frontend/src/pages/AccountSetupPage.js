import { useState } from 'react';
import { createAccount } from '../api';
import './styles.css';

export default function AccountSetupPage({ role, onAccountCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCreateAccount = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await createAccount(role);
      setAccount(result);
      console.log('Account created:', result);
    } catch (err) {
      console.error('Account creation failed:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="account-setup-wrapper">
      <style>{`
        .account-setup-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Syne', sans-serif;
        }
        
        .account-setup-container {
          max-width: 600px;
          width: 100%;
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .account-setup-container h2 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .account-setup-container p {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .role-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 20px;
        }
        
        .create-btn-wrapper {
          margin-bottom: 30px;
        }
        
        .create-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        
        .create-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .create-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-banner {
          background: #fee;
          color: #c33;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .account-details {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .key-field {
          margin-bottom: 20px;
        }
        
        .key-field label {
          display: block;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .key-field-content {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .key-value {
          flex: 1;
          background: white;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          word-break: break-all;
          color: #333;
          max-height: 80px;
          overflow-y: auto;
        }
        
        .copy-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          transition: background 0.3s;
        }
        
        .copy-btn:hover {
          background: #764ba2;
        }
        
        .copy-btn.copied {
          background: #4caf50;
        }
        
        .security-warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 14px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 13px;
          color: #856404;
          line-height: 1.6;
        }
        
        .security-warning strong {
          display: block;
          margin-bottom: 8px;
        }
        
        .success-message {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .continue-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .continue-btn:hover {
          opacity: 0.9;
        }
        
        .account-summary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          text-align: center;
        }
        
        .account-summary p {
          margin: 8px 0;
          color: white;
        }
      `}</style>
      
      <div className="account-setup-container">
        <h2>Create Your Account</h2>
        <span className="role-badge">{role === 'employer' ? '💼' : '🚀'} {role}</span>
        <p>Set up your FreeLancePay account and get your Stellar keys</p>
        
        {error && <div className="error-banner">❌ {error}</div>}
        
        {!account ? (
          <>
            <p style={{ fontSize: '13px', color: '#666', margin: '20px 0' }}>
              Your account will be created on the Stellar testnet with USDC capability.
            </p>
            <div className="create-btn-wrapper">
              <button 
                className="create-btn" 
                onClick={handleCreateAccount} 
                disabled={loading}
              >
                {loading ? '⏳ Creating Account...' : '✨ Create Account'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="success-message">
              ✅ Account created successfully on Stellar testnet!
            </div>
            
            <div className="account-details">
              <div className="key-field">
                <label>Public Key (Share this to receive payments)</label>
                <div className="key-field-content">
                  <div className="key-value">{account.publicKey}</div>
                  <button 
                    className={`copy-btn ${copied === 'public' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(account.publicKey, 'public')}
                  >
                    {copied === 'public' ? '✓' : 'COPY'}
                  </button>
                </div>
              </div>
              
              <div className="key-field">
                <label>Secret Key (Store this securely ⚠️)</label>
                <div className="key-field-content">
                  <div className="key-value">{account.secretKey}</div>
                  <button 
                    className={`copy-btn ${copied === 'secret' ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(account.secretKey, 'secret')}
                  >
                    {copied === 'secret' ? '✓' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="security-warning">
              <strong>🔒 Security Notice:</strong>
              Your secret key is your account's master password. Anyone with this key can access and transfer your funds. Never share it. Store it securely offline if possible.
            </div>

            <div className="account-summary">
              <p><strong>Account Role:</strong> {role}</p>
              <p><strong>Chain:</strong> Stellar Testnet</p>
              <p><strong>Status:</strong> ✓ Ready to use</p>
            </div>
            
            <button 
              className="continue-btn"
              onClick={() => onAccountCreated(account)}
            >
              Continue to Dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
