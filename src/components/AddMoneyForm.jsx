import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '../hooks/index.js';
import { APP_CONFIG } from '../config/appConfig.js';
import { Toast } from './Toast.jsx';
import { LoadingSpinner } from './Loading.jsx';

export function AddMoneyForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { addMoney, loading } = useWallet();
  const [toast, setToast] = useState(null);

  const onSubmit = async (data) => {
    const amount = Number(data.amount);

    if (amount < APP_CONFIG.LIMITS.minAddAmount) {
      setToast({ type: 'error', message: `Minimum amount is ₹${APP_CONFIG.LIMITS.minAddAmount}` });
      return;
    }

    if (amount > APP_CONFIG.LIMITS.maxAddAmount) {
      setToast({ type: 'error', message: `Maximum amount is ₹${APP_CONFIG.LIMITS.maxAddAmount}` });
      return;
    }

    const result = await addMoney(amount);

    if (result.success) {
      setToast({ type: 'success', message: result.message });
      reset({ amount: '' });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Money to Wallet</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount (₹)
          </label>

          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            className="input-field"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            disabled={loading}
          />

          {errors.amount && (
            <span className="error-text">{errors.amount.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? 'Processing...' : 'Add Money'}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
