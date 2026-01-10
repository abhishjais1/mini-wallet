import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { WalletProvider, useWallet, WalletContext } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

// Mock the API module
vi.mock('../utils/api.js');

// Test component to access context
function TestComponent({ onMount }) {
  const wallet = useWallet();
  if (onMount) {
    onMount(wallet);
  }
  return (
    <div>
      <span data-testid="balance">{wallet.balance}</span>
      <span data-testid="loading">{wallet.loading.toString()}</span>
      <span data-testid="error">{wallet.error || 'no-error'}</span>
      <span data-testid="user">{wallet.currentUser?.name || 'no-user'}</span>
      <span data-testid="transactions">{wallet.transactions.length}</span>
    </div>
  );
}

// Helper to render with provider
function renderWithProvider(onMount = null) {
  return render(
    <WalletProvider>
      <TestComponent onMount={onMount} />
    </WalletProvider>
  );
}

describe('WalletContext', () => {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', balance: 5000 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', balance: 3000 },
  ];

  const mockTransactions = [
    { id: '1', type: 'credit', amount: 1000, status: 'success', deleted: false },
    { id: '2', type: 'debit', amount: 500, status: 'success', deleted: false },
    { id: '3', type: 'credit', amount: 200, status: 'pending', deleted: true }, // Should be filtered
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    api.fetchUsers.mockResolvedValue(mockUsers);
    api.fetchTransactions.mockResolvedValue(mockTransactions);
    api.createTransaction.mockImplementation((t) => Promise.resolve({ ...t, id: t.id || Date.now().toString() }));
    api.updateUserBalance.mockResolvedValue({});
    api.updateTransactionStatus.mockResolvedValue({});
    api.softDeleteTransaction.mockResolvedValue({});
  });

  describe('Initial State and Data Loading', () => {
    it('should provide initial state', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
      });
    });

    it('should load users on mount', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledTimes(1);
      });
    });

    it('should load transactions on mount', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(api.fetchTransactions).toHaveBeenCalledTimes(1);
      });
    });

    it('should filter out deleted transactions', async () => {
      renderWithProvider();

      await waitFor(() => {
        // Only 2 non-deleted transactions should be loaded
        expect(screen.getByTestId('transactions')).toHaveTextContent('2');
      });
    });

    it('should set first user as current user', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('balance')).toHaveTextContent('5000');
      });
    });

    it('should handle fetch error', async () => {
      api.fetchUsers.mockRejectedValue(new Error('Network error'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });
  });

  describe('useWallet Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useWallet must be used within a WalletProvider');

      spy.mockRestore();
    });

    it('should provide all context values', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext).toBeDefined();
        expect(walletContext.addMoney).toBeInstanceOf(Function);
        expect(walletContext.transferMoney).toBeInstanceOf(Function);
        expect(walletContext.deleteTransaction).toBeInstanceOf(Function);
        expect(walletContext.retryTransaction).toBeInstanceOf(Function);
        expect(walletContext.clearError).toBeInstanceOf(Function);
      });
    });
  });

  describe('addMoney Action', () => {
    it('should add money successfully', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      let result;
      await act(async () => {
        result = await walletContext.addMoney(1000);
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Money added successfully');
      expect(api.createTransaction).toHaveBeenCalled();
      expect(api.updateUserBalance).toHaveBeenCalledWith('1', 6000);
    });

    it('should create credit transaction with correct data', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      await act(async () => {
        await walletContext.addMoney(500);
      });

      expect(api.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'credit',
          amount: 500,
          status: 'pending',
          recipient: 'Self',
          description: 'Money Added',
        })
      );
    });

    it('should return error when no user is loaded', async () => {
      api.fetchUsers.mockResolvedValue([]);

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalled();
      });

      let result;
      await act(async () => {
        result = await walletContext.addMoney(1000);
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('User data not loaded');
    });

    it('should handle API error', async () => {
      api.createTransaction.mockRejectedValue(new Error('API Error'));

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      let result;
      await act(async () => {
        result = await walletContext.addMoney(1000);
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('API Error');
    });
  });

  describe('transferMoney Action', () => {
    it('should transfer money successfully', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      let result;
      await act(async () => {
        result = await walletContext.transferMoney('2', 1000, 20);
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Transfer initiated successfully');
      expect(result.isPending).toBe(true);
    });

    it('should create debit and fee transactions', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      await act(async () => {
        await walletContext.transferMoney('2', 1000, 20);
      });

      // Should create 2 transactions: debit and fee
      expect(api.createTransaction).toHaveBeenCalledTimes(2);

      expect(api.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'debit',
          amount: 1000,
          recipient: '2',
        })
      );

      expect(api.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fee',
          amount: 20,
          recipient: 'System',
        })
      );
    });

    it('should deduct correct total (amount + fee) from balance', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      await act(async () => {
        await walletContext.transferMoney('2', 1000, 20);
      });

      // Initial balance 5000 - 1020 (1000 + 20 fee) = 3980
      expect(api.updateUserBalance).toHaveBeenCalledWith('1', 3980);
    });

    it('should return error when no user is loaded', async () => {
      api.fetchUsers.mockResolvedValue([]);

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalled();
      });

      let result;
      await act(async () => {
        result = await walletContext.transferMoney('2', 1000, 20);
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('User data not loaded');
    });
  });

  describe('deleteTransaction Action', () => {
    it('should soft delete transaction successfully', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.transactions.length).toBeGreaterThan(0);
      });

      let result;
      await act(async () => {
        result = await walletContext.deleteTransaction('1');
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Transaction deleted successfully');
      expect(api.softDeleteTransaction).toHaveBeenCalledWith('1');
    });

    it('should handle delete error', async () => {
      api.softDeleteTransaction.mockRejectedValue(new Error('Delete failed'));

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      let result;
      await act(async () => {
        result = await walletContext.deleteTransaction('1');
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Delete failed');
    });
  });

  describe('retryTransaction Action', () => {
    it('should retry failed transaction', async () => {
      const failedTransactions = [
        { id: '1', type: 'debit', amount: 500, status: 'failed', deleted: false },
      ];
      api.fetchTransactions.mockResolvedValue(failedTransactions);

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.transactions.length).toBeGreaterThan(0);
      });

      let result;
      await act(async () => {
        result = await walletContext.retryTransaction('1');
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Transaction retry initiated');
      expect(api.updateTransactionStatus).toHaveBeenCalledWith('1', 'pending');
    });

    it('should not retry non-failed transaction', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.transactions.length).toBeGreaterThan(0);
      });

      let result;
      await act(async () => {
        result = await walletContext.retryTransaction('1'); // This is a success transaction
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cannot retry this transaction');
    });

    it('should not retry non-existent transaction', async () => {
      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(walletContext.currentUser).toBeTruthy();
      });

      let result;
      await act(async () => {
        result = await walletContext.retryTransaction('999');
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cannot retry this transaction');
    });
  });

  describe('clearError Action', () => {
    it('should clear error state', async () => {
      api.fetchUsers.mockRejectedValue(new Error('Initial error'));

      let walletContext;

      renderWithProvider((wallet) => {
        walletContext = wallet;
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Initial error');
      });

      await act(async () => {
        walletContext.clearError();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      });
    });
  });
});
