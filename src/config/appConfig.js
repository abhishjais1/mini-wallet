/**
 * Application Configuration
 * Contains all configurable business rules and settings
 */

export const APP_CONFIG = {
  // Transaction Fee Configuration
  TRANSACTION_FEE: {
    percentage: 2, // 2% fee
    minAmount: 0,
  },

  // Transaction Limits
  LIMITS: {
    maxTransferAmount: 10000,
    minTransferAmount: 1,
    minAddAmount: 1,
    maxAddAmount: 100000,
  },

  // API Configuration
  API: {
    baseURL: 'http://localhost:3001',
    timeout: 10000,
  },

  // Pagination
  PAGINATION: {
    itemsPerPage: 10,
  },

  // Transaction Status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
  },

  // Transaction Types
  TRANSACTION_TYPE: {
    CREDIT: 'credit',
    DEBIT: 'debit',
    FEE: 'fee',
  },
};

/**
 * Calculate transaction fee
 * @param {number} amount - Transaction amount
 * @returns {number} Fee amount (rounded to 2 decimal places)
 */
export const calculateFee = (amount) => {
  const fee = (amount * APP_CONFIG.TRANSACTION_FEE.percentage) / 100;
  return Math.round(fee * 100) / 100;
};

/**
 * Calculate total amount including fee
 * @param {number} amount - Transaction amount
 * @returns {number} Total amount including fee (rounded to 2 decimal places)
 */
export const calculateTotalWithFee = (amount) => {
  const fee = calculateFee(amount);
  return Math.round((amount + fee) * 100) / 100;
};

/**
 * Validate transfer amount
 * @param {number} amount - Amount to validate
 * @param {number} balance - Current balance
 * @returns {object} Validation result with isValid and message
 */
export const validateTransferAmount = (amount, balance) => {
  const { maxTransferAmount, minTransferAmount } = APP_CONFIG.LIMITS;

  if (!amount || isNaN(amount)) {
    return { isValid: false, message: 'Please enter a valid amount' };
  }

  if (amount < minTransferAmount) {
    return { isValid: false, message: `Minimum transfer amount is ₹${minTransferAmount}` };
  }

  if (amount > maxTransferAmount) {
    return { isValid: false, message: `Maximum transfer limit is ₹${maxTransferAmount}` };
  }

  const totalWithFee = calculateTotalWithFee(amount);
  if (totalWithFee > balance) {
    return { isValid: false, message: `Insufficient balance. Required: ₹${totalWithFee.toFixed(2)}, Available: ₹${balance.toFixed(2)}` };
  }

  return { isValid: true, message: '' };
};
