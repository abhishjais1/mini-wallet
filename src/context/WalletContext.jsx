import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

// Import API functions
import * as api from '../utils/api.js';

// Import config
import { APP_CONFIG } from '../config/appConfig.js';

// Test environment check
const isTestEnv = import.meta.env.MODE === 'test';

// Initial state
const initialState = {
  currentUser: null,
  users: [],
  transactions: [],
  balance: 0,
  loading: false,
  error: null,
};

// Reducer function
function walletReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_USERS':
      return { ...state, users: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload, balance: Math.round((action.payload?.balance || 0) * 100) / 100 };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'UPDATE_BALANCE':
      return { ...state, balance: action.payload };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions
          .map((t) => (t.id === action.payload.id ? { ...t, ...action.payload.updates } : t))
          .filter((t) => !t.deleted),
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// Create context
export const WalletContext = createContext(null);

/**
 * WalletProvider component - manages wallet state and operations
 */
export function WalletProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Helper to dispatch state updates
  const dispatch = useCallback((action) => {
    setState((prev) => walletReducer(prev, action));
  }, []);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      if (!isTestEnv) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }

      try {
        const usersData = await api.fetchUsers();
        const transactionsData = await api.fetchTransactions();

        dispatch({ type: 'SET_USERS', payload: usersData });
        dispatch({
          type: 'SET_TRANSACTIONS',
          payload: transactionsData.filter((t) => !t.deleted),
        });

        if (usersData.length > 0) {
          dispatch({ type: 'SET_CURRENT_USER', payload: usersData[0] });
        }

        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        if (!isTestEnv) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initializeApp();
  }, [dispatch]);

  // Add money action
  const addMoney = useCallback(
    async (amount) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        if (!state.currentUser) {
          throw new Error('User data not loaded. Please refresh the page.');
        }

        // Create transaction with pending status
        const numAmount = Math.round(Number(amount) * 100) / 100;
        const transaction = {
          id: Date.now().toString(),
          userId: state.currentUser.id,
          type: 'credit',
          amount: numAmount,
          status: APP_CONFIG.TRANSACTION_STATUS.PENDING,
          recipient: 'Self',
          description: 'Money Added',
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        const createdTransaction = await api.createTransaction(transaction);
        const newBalance = Math.round((state.balance + numAmount) * 100) / 100;

        await api.updateUserBalance(state.currentUser.id, newBalance);

        // Simulate transaction processing
        setTimeout(async () => {
          try {
            await api.updateTransactionStatus(
              createdTransaction.id,
              APP_CONFIG.TRANSACTION_STATUS.SUCCESS
            );
            dispatch({
              type: 'UPDATE_TRANSACTION',
              payload: { id: createdTransaction.id, updates: { status: APP_CONFIG.TRANSACTION_STATUS.SUCCESS } },
            });
          } catch (err) {
            console.error('Failed to update transaction status:', err);
          }
        }, 1500);

        dispatch({ type: 'ADD_TRANSACTION', payload: createdTransaction });
        dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
        dispatch({
          type: 'SET_CURRENT_USER',
          payload: { ...state.currentUser, balance: newBalance },
        });

        dispatch({ type: 'SET_ERROR', payload: null });
        return { success: true, message: 'Money added successfully' };
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return { success: false, message: err.message };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.currentUser, state.balance, dispatch]
  );

  // Transfer money action
  const transferMoney = useCallback(
    async (recipientId, amount, fee) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        if (!state.currentUser) {
          throw new Error('User data not loaded. Please refresh the page.');
        }

        // Round all amounts to 2 decimal places
        const numAmount = Math.round(Number(amount) * 100) / 100;
        const numFee = Math.round(Number(fee) * 100) / 100;
        const totalAmount = Math.round((numAmount + numFee) * 100) / 100;

        // Create debit transaction with pending status
        const debitTransaction = {
          id: Date.now().toString(),
          userId: state.currentUser.id,
          type: 'debit',
          amount: numAmount,
          status: APP_CONFIG.TRANSACTION_STATUS.PENDING,
          recipient: recipientId,
          description: `Transfer to User ${recipientId}`,
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        // Create fee transaction with pending status
        const feeTransaction = {
          id: (Date.now() + 1).toString(),
          userId: state.currentUser.id,
          type: 'fee',
          amount: numFee,
          status: APP_CONFIG.TRANSACTION_STATUS.PENDING,
          recipient: 'System',
          description: 'Transaction Fee',
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        const createdDebit = await api.createTransaction(debitTransaction);
        const createdFee = await api.createTransaction(feeTransaction);

        const newBalance = Math.round((state.balance - totalAmount) * 100) / 100;
        await api.updateUserBalance(state.currentUser.id, newBalance);

        dispatch({ type: 'ADD_TRANSACTION', payload: createdDebit });
        dispatch({ type: 'ADD_TRANSACTION', payload: createdFee });
        dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
        dispatch({
          type: 'SET_CURRENT_USER',
          payload: { ...state.currentUser, balance: newBalance },
        });

        // Simulate transaction processing with possible failure
        setTimeout(async () => {
          const shouldFail = Math.random() < 0.1; // 10% chance of failure for demo
          const finalStatus = shouldFail
            ? APP_CONFIG.TRANSACTION_STATUS.FAILED
            : APP_CONFIG.TRANSACTION_STATUS.SUCCESS;

          try {
            await api.updateTransactionStatus(
              createdDebit.id,
              finalStatus,
              shouldFail ? 'Network timeout - please retry' : ''
            );
            await api.updateTransactionStatus(createdFee.id, finalStatus);

            dispatch({
              type: 'UPDATE_TRANSACTION',
              payload: {
                id: createdDebit.id,
                updates: { status: finalStatus, reason: shouldFail ? 'Network timeout' : undefined },
              },
            });
            dispatch({
              type: 'UPDATE_TRANSACTION',
              payload: { id: createdFee.id, updates: { status: finalStatus } },
            });

            // If failed, refund the amount
            if (shouldFail) {
              const refundBalance = state.balance + totalAmount;
              await api.updateUserBalance(state.currentUser.id, refundBalance);
              dispatch({ type: 'UPDATE_BALANCE', payload: refundBalance });
              dispatch({
                type: 'SET_CURRENT_USER',
                payload: { ...state.currentUser, balance: refundBalance },
              });
            }
          } catch (err) {
            console.error('Failed to update transaction status:', err);
          }
        }, 2000);

        dispatch({ type: 'SET_ERROR', payload: null });
        return {
          success: true,
          message: 'Transfer initiated successfully',
          isPending: true,
        };
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return { success: false, message: err.message };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.currentUser, state.balance, dispatch]
  );

  // Delete transaction action
  const deleteTransaction = useCallback(
    async (transactionId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await api.softDeleteTransaction(transactionId);
        dispatch({
          type: 'UPDATE_TRANSACTION',
          payload: { id: transactionId, updates: { deleted: true } },
        });
        dispatch({ type: 'SET_ERROR', payload: null });
        return { success: true, message: 'Transaction deleted successfully' };
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return { success: false, message: err.message };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch]
  );

  // Retry failed transaction
  const retryTransaction = useCallback(
    async (transactionId) => {
      const transaction = state.transactions.find((t) => t.id === transactionId);
      if (!transaction || transaction.status !== APP_CONFIG.TRANSACTION_STATUS.FAILED) {
        return { success: false, message: 'Cannot retry this transaction' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await api.updateTransactionStatus(transactionId, APP_CONFIG.TRANSACTION_STATUS.PENDING);

        dispatch({
          type: 'UPDATE_TRANSACTION',
          payload: { id: transactionId, updates: { status: APP_CONFIG.TRANSACTION_STATUS.PENDING, reason: undefined } },
        });

        // Simulate retry
        setTimeout(async () => {
          const success = Math.random() > 0.2; // 80% success on retry
          await api.updateTransactionStatus(
            transactionId,
            success ? APP_CONFIG.TRANSACTION_STATUS.SUCCESS : APP_CONFIG.TRANSACTION_STATUS.FAILED
          );
          dispatch({
            type: 'UPDATE_TRANSACTION',
            payload: {
              id: transactionId,
              updates: { status: success ? APP_CONFIG.TRANSACTION_STATUS.SUCCESS : APP_CONFIG.TRANSACTION_STATUS.FAILED },
            },
          });
        }, 1500);

        dispatch({ type: 'SET_ERROR', payload: null });
        return { success: true, message: 'Transaction retry initiated' };
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return { success: false, message: err.message };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.transactions, dispatch]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  const value = {
    ...state,
    addMoney,
    transferMoney,
    deleteTransaction,
    retryTransaction,
    clearError,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access wallet context
 */
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
