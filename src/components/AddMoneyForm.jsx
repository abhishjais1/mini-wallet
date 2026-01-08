import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/index.js';
import { APP_CONFIG } from '../config/appConfig.js';
import { formatCurrency } from '../utils/formatters.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Icon, IconContainer } from './ui/Icon.jsx';
import { ToastProvider, useToast } from './ui/Toast.jsx';

/**
 * Add Money Form Component
 */
function AddMoneyFormContent() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { addMoney, loading, balance } = useWallet();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const amount = Number(data.amount);

    // Validate amount limits
    if (amount < APP_CONFIG.LIMITS.minAddAmount) {
      addToast('Minimum amount is ' + formatCurrency(APP_CONFIG.LIMITS.minAddAmount), 'error');
      return;
    }

    if (amount > APP_CONFIG.LIMITS.maxAddAmount) {
      addToast('Maximum amount is ' + formatCurrency(APP_CONFIG.LIMITS.maxAddAmount), 'error');
      return;
    }

    const result = await addMoney(amount);

    if (result.success) {
      addToast(result.message, 'success');
      reset({ amount: '' });
      // Navigate to dashboard after success
      setTimeout(() => navigate('/'), 1500);
    } else {
      addToast(result.message, 'error');
    }
  };

  // Quick amount options
  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="max-w mx-auto animate-slideUp">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-2xl mb-4">
          <Icon name="wallet" size="2xl" className="text-accent-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary mb-2">
          Add Money
        </h1>
        <p className="text-text-secondary">
          Current balance: <span className="font-mono text-accent-secondary">{formatCurrency(balance)}</span>
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Input */}
            <div>
              <Input
                id="amount"
                type="number"
                label="Enter Amount"
                placeholder="0.00"
                step="0.01"
                min={APP_CONFIG.LIMITS.minAddAmount}
                max={APP_CONFIG.LIMITS.maxAddAmount}
                error={!!errors.amount}
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than 0',
                  },
                  max: {
                    value: APP_CONFIG.LIMITS.maxAddAmount,
                    message: `Maximum amount is ${formatCurrency(APP_CONFIG.LIMITS.maxAddAmount)}`,
                  },
                })}
                disabled={loading}
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <Icon name="alert-circle" size="sm" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Quick Amount Options */}
            <div>
              <p className="text-sm text-text-secondary mb-3">Quick select</p>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => reset({ amount: amount.toString() })}
                    className="p-3 rounded-xl border border-border hover:border-accent-primary hover:bg-accent-primary/10 transition-all duration-fast"
                    disabled={loading}
                  >
                    <span className="font-mono text-sm text-text-primary">{amount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Limits Info */}
            <div className="flex items-start gap-3 p-4 bg-surface-elevated border border-border rounded-xl">
              <Icon name="info" size="md" className="text-text-muted flex-shrink-0 mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p>Minimum: {formatCurrency(APP_CONFIG.LIMITS.minAddAmount)}</p>
                <p>Maximum: {formatCurrency(APP_CONFIG.LIMITS.maxAddAmount)}</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Money'}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-accent-secondary hover:text-accent-primary text-sm font-medium inline-flex items-center gap-1 transition-colors">
              <Icon name="arrow-left" size="sm" />
              Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Add Money Form wrapper with Toast Provider
 */
export function AddMoneyForm() {
  return (
    <ToastProvider>
      <AddMoneyFormContent />
    </ToastProvider>
  );
}
