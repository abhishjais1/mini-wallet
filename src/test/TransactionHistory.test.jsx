import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TransactionHistory } from '../components/TransactionHistory.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

// Wrapper with router
function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('TransactionHistory Component', () => {
  const mockTransactions = [
    {
      id: '1',
      userId: 1,
      type: 'credit',
      amount: 1000,
      status: 'success',
      description: 'Money Added',
      timestamp: '2024-01-15T10:00:00Z',
      deleted: false
    },
    {
      id: '2',
      userId: 1,
      type: 'debit',
      amount: 500,
      status: 'pending',
      description: 'Transfer to User 2',
      timestamp: '2024-01-15T11:00:00Z',
      deleted: false
    },
    {
      id: '3',
      userId: 1,
      type: 'debit',
      amount: 200,
      status: 'failed',
      description: 'Transfer to User 3',
      timestamp: '2024-01-15T12:00:00Z',
      deleted: false,
      reason: 'Network timeout'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([{ id: 1, name: 'Demo User', balance: 5000 }]);
    api.fetchTransactions.mockResolvedValue(mockTransactions);
    api.softDeleteTransaction.mockResolvedValue({});
    api.updateTransactionStatus.mockResolvedValue({});
  });

  it('should render transaction history', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Transaction History/i)).toBeInTheDocument();
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });
  });

  it('should display transaction count', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/3 of 3 transactions/i)).toBeInTheDocument();
    });
  });

  it('should filter by status', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    // Filter by success status
    const statusFilter = screen.getByLabelText(/Status/i) || screen.getByDisplayValue(/All Status/);
    await user.selectOptions(statusFilter, 'success');

    await waitFor(() => {
      expect(screen.getByText(/Showing 1-1 of 1 transactions/i)).toBeInTheDocument();
    });
  });

  it('should filter by type', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    // Filter by credit type
    const typeFilter = screen.getByLabelText(/Type/i) || screen.getByDisplayValue(/All Types/);
    await user.selectOptions(typeFilter, 'credit');

    await waitFor(() => {
      expect(screen.getByText(/Showing 1-1 of 1 transactions/i)).toBeInTheDocument();
    });
  });

  it('should show failed transaction with reason', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Network timeout')).toBeInTheDocument();
      expect(screen.getByTitle(/Retry transaction/i)).toBeInTheDocument();
    });
  });

  it('should clear filters when clear button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransactionHistory />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    // Apply a filter
    const statusFilter = screen.getByLabelText(/Status/i) || screen.getByDisplayValue(/All Status/);
    await user.selectOptions(statusFilter, 'success');

    await waitFor(() => {
      expect(screen.getByText(/Showing 1-1 of 1 transactions/i)).toBeInTheDocument();
    });

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /Clear all/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/Showing 1-3 of 3 transactions/i)).toBeInTheDocument();
    });
  });
});
