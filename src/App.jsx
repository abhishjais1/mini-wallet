import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WalletProvider } from './context/WalletProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import { ErrorBoundary } from './components/Toast.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { AddMoneyForm } from './components/AddMoneyForm.jsx';
import { TransferMoneyForm } from './components/TransferMoneyForm.jsx';
import { TransactionHistory } from './components/TransactionHistory.jsx';
import './App.css';

function NavigationBar() {
  const location = useLocation();
  const { isDark, toggleTheme } = React.useContext(ThemeContext);

  const isActive = (path) => location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md border-b dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          💰 Mini Wallet
        </Link>
        <div className="flex gap-8 items-center">
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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-semibold"
            title="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 h-screen text-gray-900 dark:text-gray-100 flex flex-col">
      <NavigationBar />
      <main className="w-full px-4 py-8 flex-1 overflow-y-auto">
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
      <ThemeProvider>
        <WalletProvider>
          <Router>
            <AppContent />
          </Router>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
