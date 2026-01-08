import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

// Wrapper with router
function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Demo User', balance: 5000 }
    ]);
    api.fetchTransactions.mockResolvedValue([
      {
        id: '1',
        userId: 1,
        type: 'credit',
        amount: 1000,
        status: 'success',
        description: 'Money Added',
        timestamp: new Date().toISOString(),
        deleted: false
      }
    ]);
  });

  it('should render dashboard with user greeting', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Demo User/i)).toBeInTheDocument();
    });
  });

  it('should display wallet balance', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/₹5,000/)).toBeInTheDocument();
    });
  });

  it('should show recent transactions', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });
  });

  it('should display quick action cards', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add Money')).toBeInTheDocument();
      expect(screen.getByText('Transfer Money')).toBeInTheDocument();
    });
  });

  it('should show empty state when no transactions', async () => {
    api.fetchTransactions.mockResolvedValue([]);

    render(
      <RouterWrapper>
        <WalletProvider>
          <Dashboard />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No Transactions Yet')).toBeInTheDocument();
    });
  });
});
