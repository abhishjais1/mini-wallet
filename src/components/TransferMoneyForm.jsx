import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '../hooks/index.js';
import { calculateFee, validateTransferAmount } from '../config/appConfig.js';
import { Toast } from './Toast.jsx';
import { LoadingSpinner, Modal } from './Loading.jsx';

export function TransferMoneyForm() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { transferMoney, loading, balance, users, currentUser } = useWallet();
  const [toast, setToast] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  // Filter out current user from recipients list
  const availableRecipients = users.filter(user => user.id !== currentUser?.id);

  // eslint-disable-next-line react-hooks/incompatible-library
  const amount = watch('amount');
  const fee = amount ? calculateFee(Number(amount)) : 0;
  const total = amount ? Number(amount) + fee : 0;

  const onSubmit = async (data) => {
    const validation = validateTransferAmount(Number(data.amount), balance);

    if (!validation.isValid) {
      setToast({ type: 'error', message: validation.message });
      return;
    }

    setConfirmation({
      recipientId: data.recipient,
      amount: Number(data.amount),
      fee,
      total,
    });
  };

  const handleConfirm = async () => {
    if (!confirmation) return;
    try {
      const result = await transferMoney(confirmation.recipientId, confirmation.amount, confirmation.fee);
      if (result.success) {
        setToast({ type: 'success', message: result.message });
        reset();
        setConfirmation(null);
      } else {
        setToast({ type: 'error', message: result.message });
        setConfirmation(null);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Transfer failed' });
      setConfirmation(null);
    }
  };

  return (
    <>
      <div className="card dark:bg-slate-800 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Transfer Money</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                Recipient
                </label>

                <select
                    id="recipient"
                    className="input-field"
                    {...register('recipient', { required: 'Please select a recipient' })}
                    disabled={loading || availableRecipients.length === 0}
                    >
                    <option value="">-- Select recipient --</option>
                    {availableRecipients.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
            {errors.recipient && <span className="error-text">{errors.recipient.message}</span>}
          </div>

          <div>
            <label
                htmlFor="transferAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                Amount (₹)
                </label>

                <input
                id="transferAmount"
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

            {errors.amount && <span className="error-text">{errors.amount.message}</span>}
          </div>

          {amount && (
            <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg space-y-2 border border-blue-200 dark:border-slate-600">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Amount:</span>
                <span>₹{Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Transaction Fee (2%):</span>
                <span>₹{fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-blue-200 dark:border-slate-600 pt-2 flex justify-between font-semibold text-gray-800 dark:text-white">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {total > balance && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  Insufficient balance! Available: ₹{balance.toFixed(2)}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            >
            Continue
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

      <Modal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        title="Confirm Transfer"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">To User:</span>
              <span className="font-semibold">{users?.find(u => u.id === confirmation?.recipientId)?.name || `User ${confirmation?.recipientId}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">₹{confirmation?.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fee (2%):</span>
              <span className="font-semibold">₹{confirmation?.fee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{confirmation?.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="btn-secondary flex-1"
              onClick={() => setConfirmation(null)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Processing...' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
