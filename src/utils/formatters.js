/**
 * Formatter utility functions
 */

/**
 * Format currency amount in INR
 * @param {number} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, options = {}) {
  const { currency = 'INR', minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const { includeTime = false, format = 'medium' } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (includeTime) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: format,
      timeStyle: 'short',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: format,
  }).format(dateObj);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(dateObj);
}

/**
 * Format transaction type to display text
 * @param {string} type - Transaction type
 * @returns {string} - Formatted type text
 */
export function formatTransactionType(type) {
  const typeMap = {
    credit: 'Credit',
    debit: 'Debit',
    fee: 'Fee',
  };
  return typeMap[type] || type;
}

/**
 * Format transaction status to display text
 * @param {string} status - Transaction status
 * @returns {string} - Formatted status text
 */
export function formatTransactionStatus(status) {
  const statusMap = {
    pending: 'Pending',
    success: 'Success',
    failed: 'Failed',
  };
  return statusMap[status] || status;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get transaction icon name
 * @param {string} type - Transaction type
 * @returns {string} - Icon name from lucide-react
 */
export function getTransactionIcon(type) {
  const iconMap = {
    credit: 'arrow-down-left',
    debit: 'arrow-up-right',
    fee: 'receipt',
  };
  return iconMap[type] || 'circle';
}

/**
 * Check if a transaction is pending
 * @param {Object} transaction - Transaction object
 * @returns {boolean}
 */
export function isTransactionPending(transaction) {
  return transaction?.status === 'pending';
}

/**
 * Check if a transaction failed
 * @param {Object} transaction - Transaction object
 * @returns {boolean}
 */
export function isTransactionFailed(transaction) {
  return transaction?.status === 'failed';
}
