import React from 'react';
import { useWallet } from '../hooks/index.js';
import { LoadingSpinner, SkeletonCard, EmptyState } from './Loading.jsx';

export function Dashboard() {
  const { currentUser, loading, balance, transactions } = useWallet();

  const activeTransactions = transactions.filter((t) => !t.deleted).slice(0, 5);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return '📥';
      case 'debit':
        return '📤';
      case 'fee':
        return '💰';
      default:
        return '•';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {currentUser?.name || 'User'}!</h1>
        <p className="text-gray-600">Manage your wallet and track transactions</p>
      </div>

      {/* Balance Card */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <p className="text-blue-100 mb-2">Total Balance</p>
          <h2 className="text-5xl font-bold mb-4">₹{balance.toFixed(2)}</h2>
          <div className="flex gap-4 pt-4 border-t border-blue-400">
            <div>
              <p className="text-blue-100 text-sm">User ID</p>
              <p className="font-semibold">{currentUser?.id}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Transactions</p>
              <p className="font-semibold">{transactions.filter((t) => !t.deleted).length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/add-money"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-4xl mb-2">💳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Add Money</h3>
          <p className="text-gray-600 text-sm">Deposit funds to your wallet</p>
        </a>

        <a
          href="/transfer"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-4xl mb-2">💸</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Transfer Money</h3>
          <p className="text-gray-600 text-sm">Send money to another user</p>
        </a>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : activeTransactions.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Transactions Yet"
            description="Start by adding money to your wallet"
          />
        ) : (
          <div className="space-y-3">
            {activeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTransactions.length > 0 && (
          <a
            href="/transactions"
            className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All Transactions →
          </a>
        )}
      </div>
    </div>
  );
}
