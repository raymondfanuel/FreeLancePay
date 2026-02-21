import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AccountTypePage from './pages/AccountTypePage';
import AccountSetupPage from './pages/AccountSetupPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  // Load account from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem('freelancepay_account');
    if (stored) {
      try {
        const account = JSON.parse(stored);
        setCurrentAccount(account);
        setPage('dashboard');
      } catch (e) {
        console.error('Failed to load stored account:', e);
      }
    }
  }, []);

  const handleGetStarted = () => {
    setPage('selectRole');
  };

  const handleSelectType = (role) => {
    setSelectedRole(role);
    setPage('setup');
  };

  const handleAccountCreated = (account) => {
    // Store account in localStorage
    localStorage.setItem('freelancepay_account', JSON.stringify(account));
    setCurrentAccount(account);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('freelancepay_account');
    setCurrentAccount(null);
    setSelectedRole(null);
    setPage('landing');
  };

  return (
    <div className="app">
      {page === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      
      {page === 'selectRole' && <AccountTypePage onSelectType={handleSelectType} />}
      
      {page === 'setup' && selectedRole && (
        <AccountSetupPage role={selectedRole} onAccountCreated={handleAccountCreated} />
      )}
      
      {page === 'dashboard' && currentAccount && (
        <Dashboard account={currentAccount} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;