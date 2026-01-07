import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionHistory } from '../components/TransactionHistory.jsx';
import { WalletProvider } from '../context/WalletProvider.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

describe('TransactionHistory Component', () => {
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
        timestamp: '2025-01-07T10:00:00Z',
        deleted: false
      },
      {
        id: '2',
        userId: 1,
        type: 'debit',
        amount: 500,
        status: 'success',
        description: 'Transfer',
        timestamp: '2025-01-07T11:00:00Z',
        deleted: false
      }
    ]);
    api.softDeleteTransaction.mockResolvedValue({ id: '1', deleted: true });
  });

  it('should render transaction history', async () => {
    render(
      <WalletProvider>
        <TransactionHistory />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
      expect(screen.getByText('Transfer')).toBeInTheDocument();
    });
  });

  it('should filter by status', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <TransactionHistory />
      </WalletProvider>
    );

    const statusSelect = screen.getByRole('combobox', { name: /Status/i });

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    await user.selectOptions(statusSelect, 'success');

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });
  });

  it('should filter by type', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <TransactionHistory />
      </WalletProvider>
    );

    const typeSelect = screen.getByRole('combobox', { name: /Type/i });

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    await user.selectOptions(typeSelect, 'credit');

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });
  });

  it('should handle transaction deletion', async () => {
    const user = userEvent.setup();
    render(
      <WalletProvider>
        <TransactionHistory />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Money Added')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    window.confirm = vi.fn(() => true);

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.softDeleteTransaction).toHaveBeenCalled();
    });
  });
});
