import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';

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

/**
 * Custom hook for user data
 */
export function useUser() {
  const { currentUser, users } = useWallet();
  return { currentUser, users };
}

/**
 * Custom hook for transactions
 */
export function useTransactions() {
  const { transactions } = useWallet();
  const activeTransactions = transactions.filter((t) => !t.deleted);
  return {
    transactions: activeTransactions,
    totalCount: activeTransactions.length,
  };
}

/**
 * Custom hook for balance
 */
export function useBalance() {
  const { balance } = useWallet();
  return {
    balance,
    formattedBalance: `₹${balance.toFixed(2)}`,
  };
}

/**
 * Custom hook for transaction actions
 */
export function useTransactionActions() {
  const { addMoney, transferMoney, deleteTransaction } = useWallet();
  return {
    addMoney,
    transferMoney,
    deleteTransaction,
  };
}

/**
 * Custom hook for loading and error states
 */
export function useAppState() {
  const { loading, error, clearError } = useWallet();
  return {
    loading,
    error,
    clearError,
  };
}

/**
 * Custom hook for theme management
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
