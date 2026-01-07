import React, { useState, useMemo } from 'react';
import { useWallet } from '../hooks/index.js';
import { LoadingSpinner, TransactionSkeleton, EmptyState } from './Loading.jsx';
import { Toast } from './Toast.jsx';

export function TransactionHistory() {
  const { transactions, loading, deleteTransaction } = useWallet();
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchDate, setSearchDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (searchDate) {
        const tDate = new Date(t.timestamp).toLocaleDateString();
        const sDate = new Date(searchDate).toLocaleDateString();
        if (tDate !== sDate) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, typeFilter, searchDate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(id);
      if (result.success) {
        setToast({ type: 'success', message: result.message });
      } else {
        setToast({ type: 'error', message: result.message });
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'credit':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      case 'fee':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return '+';
      case 'debit':
        return '-';
      case 'fee':
        return '✓';
      default:
        return '•';
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      {/* Filters */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
                htmlFor="statusFilter"
                className="block text-sm font-medium text-gray-700 mb-2"
                >
                Status
                </label>

                <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
                >

              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label
                htmlFor="typeFilter"
                className="block text-sm font-medium text-gray-700 mb-2"
                >
                Type
                </label>

                <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
                >

              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="fee">Fee</option>
            </select>
          </div>

          <div>
            <label
                htmlFor="dateFilter"
                className="block text-sm font-medium text-gray-700 mb-2"
                >
                Date
                </label>

                <input
                id="dateFilter"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="input-field"
                />

          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Transactions"
            description={
              transactions.length === 0
                ? 'Start by adding money or making a transfer'
                : 'No transactions match your filters'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                      <span className="mr-1">{getTypeIcon(transaction.type)}</span>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
