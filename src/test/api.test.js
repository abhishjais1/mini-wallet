import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  fetchUsers,
  fetchUserById,
  updateUserBalance,
  fetchTransactions,
  createTransaction,
  updateTransactionStatus,
  softDeleteTransaction,
} from '../utils/api.js';

// Mock axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      ...mockAxiosInstance,
    },
  };
});

// Get the mocked axios instance
const mockAxios = axios.create();

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ];
      mockAxios.get.mockResolvedValueOnce({ data: mockUsers });

      const result = await fetchUsers();

      expect(mockAxios.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when fetch fails', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('fetchUserById', () => {
    it('should fetch user by ID successfully', async () => {
      const mockUser = { id: '1', name: 'John Doe', balance: 5000 };
      mockAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await fetchUserById('1');

      expect(mockAxios.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Not found'));

      await expect(fetchUserById('999')).rejects.toThrow('Failed to fetch user');
    });
  });

  describe('updateUserBalance', () => {
    it('should update user balance successfully', async () => {
      const updatedUser = { id: '1', name: 'John Doe', balance: 6000 };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedUser });

      const result = await updateUserBalance('1', 6000);

      expect(mockAxios.patch).toHaveBeenCalledWith('/users/1', { balance: 6000 });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when update fails', async () => {
      mockAxios.patch.mockRejectedValueOnce(new Error('Update failed'));

      await expect(updateUserBalance('1', 6000)).rejects.toThrow('Failed to update balance');
    });
  });

  describe('fetchTransactions', () => {
    it('should fetch all transactions successfully', async () => {
      const mockTransactions = [
        { id: '1', type: 'credit', amount: 1000, status: 'success' },
        { id: '2', type: 'debit', amount: 500, status: 'success' },
      ];
      mockAxios.get.mockResolvedValueOnce({ data: mockTransactions });

      const result = await fetchTransactions();

      expect(mockAxios.get).toHaveBeenCalledWith('/transactions');
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array when no data', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: null });

      const result = await fetchTransactions();

      expect(result).toEqual([]);
    });

    it('should throw error when fetch fails', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchTransactions()).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('createTransaction', () => {
    it('should create a credit transaction successfully', async () => {
      const newTransaction = {
        type: 'credit',
        amount: 1000,
        description: 'Added money',
        status: 'pending',
      };
      const createdTransaction = { id: '123', ...newTransaction };
      mockAxios.post.mockResolvedValueOnce({ data: createdTransaction });

      const result = await createTransaction(newTransaction);

      expect(mockAxios.post).toHaveBeenCalledWith('/transactions', newTransaction);
      expect(result).toEqual(createdTransaction);
      expect(result.id).toBe('123');
    });

    it('should create a debit transaction with fee', async () => {
      const newTransaction = {
        type: 'debit',
        amount: 1000,
        fee: 20,
        recipient: '2',
        description: 'Transfer to Jane',
        status: 'pending',
      };
      const createdTransaction = { id: '124', ...newTransaction };
      mockAxios.post.mockResolvedValueOnce({ data: createdTransaction });

      const result = await createTransaction(newTransaction);

      expect(mockAxios.post).toHaveBeenCalledWith('/transactions', newTransaction);
      expect(result.fee).toBe(20);
    });

    it('should throw error when creation fails', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(createTransaction({})).rejects.toThrow('Failed to create transaction');
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status to success', async () => {
      const updatedTransaction = { id: '1', status: 'success' };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedTransaction });

      const result = await updateTransactionStatus('1', 'success');

      expect(mockAxios.patch).toHaveBeenCalledWith('/transactions/1', { status: 'success' });
      expect(result.status).toBe('success');
    });

    it('should update transaction status to failed with reason', async () => {
      const updatedTransaction = { id: '1', status: 'failed', reason: 'Insufficient funds' };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedTransaction });

      const result = await updateTransactionStatus('1', 'failed', 'Insufficient funds');

      expect(mockAxios.patch).toHaveBeenCalledWith('/transactions/1', {
        status: 'failed',
        reason: 'Insufficient funds',
      });
      expect(result.reason).toBe('Insufficient funds');
    });

    it('should not include reason when empty', async () => {
      const updatedTransaction = { id: '1', status: 'success' };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedTransaction });

      await updateTransactionStatus('1', 'success', '');

      expect(mockAxios.patch).toHaveBeenCalledWith('/transactions/1', { status: 'success' });
    });

    it('should throw error when update fails', async () => {
      mockAxios.patch.mockRejectedValueOnce(new Error('Update failed'));

      await expect(updateTransactionStatus('1', 'success')).rejects.toThrow(
        'Failed to update transaction'
      );
    });
  });

  describe('softDeleteTransaction', () => {
    it('should soft delete transaction successfully', async () => {
      const deletedTransaction = { id: '1', deleted: true };
      mockAxios.patch.mockResolvedValueOnce({ data: deletedTransaction });

      const result = await softDeleteTransaction('1');

      expect(mockAxios.patch).toHaveBeenCalledWith('/transactions/1', { deleted: true });
      expect(result.deleted).toBe(true);
    });

    it('should throw error when delete fails', async () => {
      mockAxios.patch.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(softDeleteTransaction('1')).rejects.toThrow('Failed to delete transaction');
    });
  });
});
