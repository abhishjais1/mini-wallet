import { describe, it, expect } from 'vitest';
import { calculateFee, calculateTotalWithFee, validateTransferAmount, APP_CONFIG } from '../config/appConfig.js';

describe('App Config - Business Rules', () => {
  describe('calculateFee', () => {
    it('should calculate 2% fee correctly', () => {
      const fee = calculateFee(1000);
      expect(fee).toBe(20);
    });

    it('should handle decimal amounts', () => {
      const fee = calculateFee(500.50);
      expect(fee).toBeCloseTo(10.01, 2);
    });

    it('should return 0 for zero amount', () => {
      const fee = calculateFee(0);
      expect(fee).toBe(0);
    });

    it('should handle large amounts', () => {
      const fee = calculateFee(10000);
      expect(fee).toBe(200);
    });
  });

  describe('calculateTotalWithFee', () => {
    it('should calculate total amount with fee', () => {
      const total = calculateTotalWithFee(1000);
      expect(total).toBe(1020);
    });

    it('should handle decimal amounts correctly', () => {
      const total = calculateTotalWithFee(999.99);
      expect(total).toBeCloseTo(1019.99, 2);
    });
  });

  describe('validateTransferAmount', () => {
    it('should validate amount within limits', () => {
      const result = validateTransferAmount(1000, 5000);
      expect(result.isValid).toBe(true);
    });

    it('should reject zero amount', () => {
      const result = validateTransferAmount(0, 5000);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('valid amount');
    });

    it('should reject amount below minimum', () => {
      const result = validateTransferAmount(0.5, 5000);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Minimum');
    });

    it('should reject amount above maximum', () => {
      const result = validateTransferAmount(15000, 20000);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Maximum');
    });

    it('should reject if balance insufficient', () => {
      const result = validateTransferAmount(5000, 5000);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Insufficient balance');
    });

    it('should account for fee in balance check', () => {
      // 10000 amount + 200 fee = 10200 needed, but only 10100 available
      const result = validateTransferAmount(10000, 10100);
      expect(result.isValid).toBe(false);
    });

    it('should pass with exact balance including fee', () => {
      // 1000 amount + 20 fee = 1020 total
      const result = validateTransferAmount(1000, 1020);
      expect(result.isValid).toBe(true);
    });
  });

  describe('APP_CONFIG constants', () => {
    it('should have correct fee percentage', () => {
      expect(APP_CONFIG.TRANSACTION_FEE.percentage).toBe(2);
    });

    it('should have correct max transfer amount', () => {
      expect(APP_CONFIG.LIMITS.maxTransferAmount).toBe(10000);
    });

    it('should have correct transaction statuses', () => {
      expect(APP_CONFIG.TRANSACTION_STATUS.SUCCESS).toBe('success');
      expect(APP_CONFIG.TRANSACTION_STATUS.FAILED).toBe('failed');
      expect(APP_CONFIG.TRANSACTION_STATUS.PENDING).toBe('pending');
    });

    it('should have correct transaction types', () => {
      expect(APP_CONFIG.TRANSACTION_TYPE.CREDIT).toBe('credit');
      expect(APP_CONFIG.TRANSACTION_TYPE.DEBIT).toBe('debit');
      expect(APP_CONFIG.TRANSACTION_TYPE.FEE).toBe('fee');
    });
  });
});
