import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/index.js';
import { calculateFee, validateTransferAmount } from '../config/appConfig.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Select, SelectOption } from './ui/Select.jsx';
import { Icon, IconContainer } from './ui/Icon.jsx';
import { Modal, ConfirmModal } from './ui/Modal.jsx';
import { ToastProvider, useToast } from './ui/Toast.jsx';

/**
 * Transfer Money Form Component
 */
function TransferMoneyFormContent() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { transferMoney, loading, balance, users, currentUser } = useWallet();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [confirmation, setConfirmation] = useState(null);

  // Filter out current user from recipients list
  const availableRecipients = users.filter((user) => user.id !== currentUser?.id);

  // Watch amount for real-time fee calculation
  const amount = watch('amount');
  const fee = amount ? calculateFee(Number(amount)) : 0;
  const total = amount ? Number(amount) + fee : 0;

  const onSubmit = async (data) => {
    const validation = validateTransferAmount(Number(data.amount), balance);

    if (!validation.isValid) {
      addToast(validation.message, 'error');
      return;
    }

    // Show confirmation modal
    setConfirmation({
      recipientId: data.recipient,
      recipientName: users.find((u) => u.id === data.recipient)?.name || `User ${data.recipient}`,
      amount: Number(data.amount),
      fee,
      total,
    });
  };

  const handleConfirm = async () => {
    if (!confirmation) return;

    const result = await transferMoney(confirmation.recipientId, confirmation.amount, confirmation.fee);

    if (result.success) {
      addToast(result.message, result.isPending ? 'info' : 'success');
      reset();
      setConfirmation(null);
      // Navigate to dashboard
      setTimeout(() => navigate('/'), 1500);
    } else {
      addToast(result.message, 'error');
      setConfirmation(null);
    }
  };

  return (
    <>
      <div className="max-w mx-auto animate-slideUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-accent-tertiary/10 border border-accent-tertiary/20 rounded-2xl mb-4">
            <Icon name="send" size="2xl" className="text-accent-tertiary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary mb-2">
            Transfer Money
          </h1>
          <p className="text-text-secondary">
            Available balance: <span className="font-mono text-accent-secondary">{formatCurrency(balance)}</span>
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Recipient Select */}
              <div>
                <Select
                  id="recipient"
                  label="Select Recipient"
                  {...register('recipient', { required: 'Please select a recipient' })}
                  disabled={loading || availableRecipients.length === 0}
                  error={!!errors.recipient}
                >
                  <option value="">-- Select recipient --</option>
                  {availableRecipients.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id})
                    </option>
                  ))}
                </Select>
                {errors.recipient && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <Icon name="alert-circle" size="sm" />
                    {errors.recipient.message}
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <Input
                  id="amount"
                  type="number"
                  label="Enter Amount"
                  placeholder="0.00"
                  step="0.01"
                  min={1}
                  max={10000}
                  error={!!errors.amount}
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                    max: { value: 10000, message: 'Maximum transfer limit is ₹10,000' },
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

              {/* Fee Breakdown */}
              {amount && Number(amount) > 0 && (
                <div className="p-4 bg-surface-elevated border border-border rounded-xl space-y-3">
                  <p className="text-sm font-medium text-text-primary">Transaction Summary</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Amount:</span>
                      <span className="font-mono text-text-primary">{formatCurrency(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Transaction Fee (2%):</span>
                      <span className="font-mono text-amber-400">{formatCurrency(fee)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="text-sm font-medium text-text-primary">Total:</span>
                      <span className="font-mono text-lg font-bold text-accent-secondary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Balance Warning */}
                  {total > balance && (
                    <div className="flex items-start gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                      <Icon name="alert-triangle" size="sm" className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">
                        Insufficient balance. Available: {formatCurrency(balance)}, Required: {formatCurrency(total)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={loading}
                disabled={loading || !amount || Number(amount) <= 0}
              >
                Review Transfer
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        title="Confirm Transfer"
        size="sm"
      >
        <div className="space-y-6">
          <div className="p-4 bg-surface-elevated border border-border rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">To:</span>
              <span className="font-medium text-text-primary">{confirmation?.recipientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Amount:</span>
              <span className="font-mono text-text-primary">{formatCurrency(confirmation?.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Transaction Fee:</span>
              <span className="font-mono text-amber-400">{formatCurrency(confirmation?.fee)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-sm font-medium text-text-primary">Total to be debited:</span>
              <span className="font-mono text-lg font-bold text-accent-secondary">{formatCurrency(confirmation?.total)}</span>
            </div>
          </div>

          {/* Fee Info */}
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <Icon name="info" size="sm" className="flex-shrink-0 mt-0.5" />
            <p>Transactions are processed instantly. A 2% fee applies to all transfers.</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setConfirmation(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleConfirm}
              isLoading={loading}
              disabled={loading}
            >
              Confirm Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/**
 * Transfer Money Form wrapper with Toast Provider
 */
export function TransferMoneyForm() {
  return (
    <ToastProvider>
      <TransferMoneyFormContent />
    </ToastProvider>
  );
}
