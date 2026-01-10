import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatTransactionType,
  formatTransactionStatus,
  truncate,
  getTransactionIcon,
  isTransactionPending,
  isTransactionFailed,
} from '../utils/formatters.js';

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    it('should format amount in INR by default', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('1,000');
      expect(result).toContain('₹');
    });

    it('should format with 2 decimal places by default', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('.00');
    });

    it('should handle decimal amounts correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1,234.56');
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0.00');
    });

    it('should format large amounts with proper grouping', () => {
      const result = formatCurrency(1234567.89);
      // Indian numbering: 12,34,567.89
      expect(result).toContain('12,34,567.89');
    });

    it('should respect custom fraction digits', () => {
      const result = formatCurrency(1000, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      expect(result).not.toContain('.00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2026-01-10T14:30:00Z');

    it('should format date string input', () => {
      const result = formatDate('2026-01-10');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format Date object input', () => {
      const result = formatDate(testDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should include time when includeTime option is true', () => {
      const result = formatDate(testDate, { includeTime: true });
      // Should contain time portion (varies by timezone)
      expect(result.length).toBeGreaterThan(10);
    });

    it('should not include time by default', () => {
      const resultWithTime = formatDate(testDate, { includeTime: true });
      const resultWithoutTime = formatDate(testDate);
      expect(resultWithTime.length).toBeGreaterThan(resultWithoutTime.length);
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-10T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Just now" for very recent times', () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toBe('Just now');
    });

    it('should return minutes ago for times within an hour', () => {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = formatRelativeTime(thirtyMinsAgo);
      expect(result).toBe('30 minutes ago');
    });

    it('should return singular minute for 1 minute ago', () => {
      const oneMinAgo = new Date(Date.now() - 1 * 60 * 1000);
      const result = formatRelativeTime(oneMinAgo);
      expect(result).toBe('1 minute ago');
    });

    it('should return hours ago for times within a day', () => {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
      const result = formatRelativeTime(fiveHoursAgo);
      expect(result).toBe('5 hours ago');
    });

    it('should return singular hour for 1 hour ago', () => {
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
      const result = formatRelativeTime(oneHourAgo);
      expect(result).toBe('1 hour ago');
    });

    it('should return days ago for times within a week', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toBe('3 days ago');
    });

    it('should return formatted date for times older than a week', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoWeeksAgo);
      // Should fall back to formatDate, not contain "ago"
      expect(result).not.toContain('ago');
    });

    it('should handle string date input', () => {
      const result = formatRelativeTime('2026-01-10T11:59:00Z');
      expect(result).toBe('1 minute ago');
    });
  });

  describe('formatTransactionType', () => {
    it('should format credit type', () => {
      expect(formatTransactionType('credit')).toBe('Credit');
    });

    it('should format debit type', () => {
      expect(formatTransactionType('debit')).toBe('Debit');
    });

    it('should format fee type', () => {
      expect(formatTransactionType('fee')).toBe('Fee');
    });

    it('should return original for unknown type', () => {
      expect(formatTransactionType('unknown')).toBe('unknown');
    });
  });

  describe('formatTransactionStatus', () => {
    it('should format pending status', () => {
      expect(formatTransactionStatus('pending')).toBe('Pending');
    });

    it('should format success status', () => {
      expect(formatTransactionStatus('success')).toBe('Success');
    });

    it('should format failed status', () => {
      expect(formatTransactionStatus('failed')).toBe('Failed');
    });

    it('should return original for unknown status', () => {
      expect(formatTransactionStatus('cancelled')).toBe('cancelled');
    });
  });

  describe('truncate', () => {
    it('should not truncate text shorter than maxLength', () => {
      const result = truncate('Hello', 10);
      expect(result).toBe('Hello');
    });

    it('should truncate text longer than maxLength', () => {
      const result = truncate('This is a very long text that needs truncation', 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + 3 for "..."
    });

    it('should use default maxLength of 50', () => {
      const longText = 'A'.repeat(60);
      const result = truncate(longText);
      expect(result).toBe('A'.repeat(50) + '...');
    });

    it('should handle exact length text', () => {
      const text = 'A'.repeat(50);
      const result = truncate(text, 50);
      expect(result).toBe(text); // No ellipsis needed
    });
  });

  describe('getTransactionIcon', () => {
    it('should return arrow-down-left for credit', () => {
      expect(getTransactionIcon('credit')).toBe('arrow-down-left');
    });

    it('should return arrow-up-right for debit', () => {
      expect(getTransactionIcon('debit')).toBe('arrow-up-right');
    });

    it('should return receipt for fee', () => {
      expect(getTransactionIcon('fee')).toBe('receipt');
    });

    it('should return circle for unknown type', () => {
      expect(getTransactionIcon('other')).toBe('circle');
    });

    it('should return circle for undefined type', () => {
      expect(getTransactionIcon(undefined)).toBe('circle');
    });
  });

  describe('isTransactionPending', () => {
    it('should return true for pending transaction', () => {
      const transaction = { id: '1', status: 'pending' };
      expect(isTransactionPending(transaction)).toBe(true);
    });

    it('should return false for success transaction', () => {
      const transaction = { id: '1', status: 'success' };
      expect(isTransactionPending(transaction)).toBe(false);
    });

    it('should return false for failed transaction', () => {
      const transaction = { id: '1', status: 'failed' };
      expect(isTransactionPending(transaction)).toBe(false);
    });

    it('should handle null transaction', () => {
      expect(isTransactionPending(null)).toBe(false);
    });

    it('should handle undefined transaction', () => {
      expect(isTransactionPending(undefined)).toBe(false);
    });
  });

  describe('isTransactionFailed', () => {
    it('should return true for failed transaction', () => {
      const transaction = { id: '1', status: 'failed' };
      expect(isTransactionFailed(transaction)).toBe(true);
    });

    it('should return false for success transaction', () => {
      const transaction = { id: '1', status: 'success' };
      expect(isTransactionFailed(transaction)).toBe(false);
    });

    it('should return false for pending transaction', () => {
      const transaction = { id: '1', status: 'pending' };
      expect(isTransactionFailed(transaction)).toBe(false);
    });

    it('should handle null transaction', () => {
      expect(isTransactionFailed(null)).toBe(false);
    });

    it('should handle undefined transaction', () => {
      expect(isTransactionFailed(undefined)).toBe(false);
    });
  });
});
