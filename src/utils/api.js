import axios from 'axios';
import { APP_CONFIG } from '../config/appConfig.js';

const api = axios.create({
  baseURL: APP_CONFIG.API.baseURL,
  timeout: APP_CONFIG.API.timeout,
});

/**
 * Fetch all users
 */
export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

/**
 * Update user balance
 */
export const updateUserBalance = async (userId, newBalance) => {
  try {
    const response = await api.patch(`/users/${userId}`, { balance: newBalance });
    return response.data;
  } catch (error) {
    console.error('Error updating balance:', error);
    throw new Error('Failed to update balance');
  }
};

/**
 * Fetch all transactions
 */
export const fetchTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (transaction) => {
  try {
    const response = await api.post('/transactions', transaction);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

/**
 * Update transaction status
 */
export const updateTransactionStatus = async (transactionId, status, reason = '') => {
  try {
    const updateData = { status };
    if (reason) {
      updateData.reason = reason;
    }
    const response = await api.patch(`/transactions/${transactionId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
};

/**
 * Soft delete transaction
 */
export const softDeleteTransaction = async (transactionId) => {
  try {
    const response = await api.patch(`/transactions/${transactionId}`, { deleted: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
};

export default api;
