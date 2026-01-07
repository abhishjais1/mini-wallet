import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WalletProvider } from './context/WalletProvider.jsx';
import { ErrorBoundary } from './components/Toast.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { AddMoneyForm } from './components/AddMoneyForm.jsx';
import { TransferMoneyForm } from './components/TransferMoneyForm.jsx';
import { TransactionHistory } from './components/TransactionHistory.jsx';
import './App.css';

function NavigationBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          💰 Mini Wallet
        </Link>
        <div className="flex gap-8">
          <Link to="/" className={`pb-2 transition-colors ${isActive('/')}`}>
            Dashboard
          </Link>
          <Link to="/add-money" className={`pb-2 transition-colors ${isActive('/add-money')}`}>
            Add Money
          </Link>
          <Link to="/transfer" className={`pb-2 transition-colors ${isActive('/transfer')}`}>
            Transfer
          </Link>
          <Link to="/transactions" className={`pb-2 transition-colors ${isActive('/transactions')}`}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-money" element={<AddMoneyForm />} />
          <Route path="/transfer" element={<TransferMoneyForm />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <Router>
          <AppContent />
        </Router>
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App;
