import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { AddMoneyForm } from './components/AddMoneyForm.jsx';
import { TransferMoneyForm } from './components/TransferMoneyForm.jsx';
import { TransactionHistory } from './components/TransactionHistory.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { Icon } from './components/ui/Icon.jsx';

/**
 * Navigation Bar Component
 */
function NavigationBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'layout-dashboard' },
    { path: '/add-money', label: 'Add Money', icon: 'plus-circle' },
    { path: '/transfer', label: 'Transfer', icon: 'send' },
    { path: '/transactions', label: 'History', icon: 'clock-counter-clockwise' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-void border-b border-border sticky top-0 z-[1030] backdrop-blur-xl bg-void/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Icon name="wallet" size="md" className="text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-text-primary hidden sm:block">
              Mini Wallet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-base
                  ${isActive(item.path)
                    ? 'text-accent-primary bg-accent-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <Icon name={item.icon} size="sm" />
                  {item.label}
                </span>
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  p-2 rounded-lg transition-all duration-fast
                  ${isActive(item.path)
                    ? 'text-accent-primary bg-accent-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                  }
                `}
                title={item.label}
              >
                <Icon name={item.icon} size="md" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * App Content Component
 */
function AppContent() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <NavigationBar />

        <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-money" element={<AddMoneyForm />} />
          <Route path="/transfer" element={<TransferMoneyForm />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-secondary text-sm">
              Mini Wallet — A fintech application demo
            </p>
            <div className="flex items-center gap-6 text-text-secondary text-sm">
              <span className="flex items-center gap-1">
                <Icon name="shield-check" size="sm" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Icon name="zap" size="sm" />
                Fast
              </span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WalletProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
