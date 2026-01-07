import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard.jsx';
import { WalletProvider } from '../context/WalletProvider.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Abhishek', balance: 5000 }
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
      <WalletProvider>
        <Dashboard />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Abhishek/i)).toBeInTheDocument();
    });
  });

  it('should display wallet balance', async () => {
    render(
      <WalletProvider>
        <Dashboard />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/₹5000.00/i)).toBeInTheDocument();
    });
  });

  it('should show recent transactions', async () => {
    render(
      <WalletProvider>
        <Dashboard />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });
  });

  it('should display quick action cards', async () => {
    render(
      <WalletProvider>
        <Dashboard />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Add Money')).toBeInTheDocument();
      expect(screen.getByText('Transfer Money')).toBeInTheDocument();
    });
  });
});
