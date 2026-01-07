const isTestEnv = import.meta.env.MODE === 'test';
import { useReducer, useCallback, useEffect } from 'react';
import { WalletContext } from './WalletContext.jsx';
import { fetchUsers, fetchTransactions, createTransaction, softDeleteTransaction, updateUserBalance } from '../utils/api.js';

const initialState = {
  currentUser: null,
  users: [],
  transactions: [],
  balance: 0,
  loading: false,
  error: null,
};

function walletReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_USERS':
      return { ...state, users: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload, balance: action.payload?.balance || 0 };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'UPDATE_BALANCE':
      return { ...state, balance: action.payload };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // Initialize app data
  useEffect(() => {
  const initializeApp = async () => {
    if (!isTestEnv) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }

    try {
      const usersData = await fetchUsers();
      const transactionsData = await fetchTransactions();

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
}, []);


  // Add money action
  const addMoney = useCallback(
    async (amount) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        if (!state.currentUser) {
          throw new Error('User data not loaded. Please refresh the page and ensure json-server is running on http://localhost:3001');
        }

        const transaction = {
          id: Date.now().toString(),
          userId: state.currentUser.id,
          type: 'credit',
          amount: Number(amount),
          status: 'success',
          recipient: 'Self',
          description: 'Money Added',
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        const createdTransaction = await createTransaction(transaction);
        const newBalance = state.balance + Number(amount);

        await updateUserBalance(state.currentUser.id, newBalance);

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
    [state.currentUser, state.balance]
  );

  // Transfer money action
  const transferMoney = useCallback(
    async (recipientId, amount, fee) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        if (!state.currentUser) {
          throw new Error('User data not loaded. Please refresh the page and ensure json-server is running on http://localhost:3001');
        }

        const totalAmount = Number(amount) + fee;

        // Create debit transaction
        const debitTransaction = {
          id: Date.now().toString(),
          userId: state.currentUser.id,
          type: 'debit',
          amount: Number(amount),
          status: 'success',
          recipient: recipientId,
          description: `Transfer to User ${recipientId}`,
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        // Create fee transaction
        const feeTransaction = {
          id: (Date.now() + 1).toString(),
          userId: state.currentUser.id,
          type: 'fee',
          amount: fee,
          status: 'success',
          recipient: 'System',
          description: 'Transaction Fee',
          timestamp: new Date().toISOString(),
          deleted: false,
        };

        await createTransaction(debitTransaction);
        await createTransaction(feeTransaction);

        const newBalance = state.balance - totalAmount;
        await updateUserBalance(state.currentUser.id, newBalance);

        dispatch({ type: 'ADD_TRANSACTION', payload: debitTransaction });
        dispatch({ type: 'ADD_TRANSACTION', payload: feeTransaction });
        dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
        dispatch({
          type: 'SET_CURRENT_USER',
          payload: { ...state.currentUser, balance: newBalance },
        });

        dispatch({ type: 'SET_ERROR', payload: null });
        return { success: true, message: 'Money transferred successfully' };
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return { success: false, message: err.message };
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.currentUser, state.balance]
  );

  // Delete transaction action
  const deleteTransaction = useCallback(
    async (transactionId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await softDeleteTransaction(transactionId);
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
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    addMoney,
    transferMoney,
    deleteTransaction,
    clearError,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
