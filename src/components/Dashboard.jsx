import React from 'react';
import { useWallet } from '../hooks/index.js';
import { LoadingSpinner, SkeletonCard, EmptyState } from './Loading.jsx';

export function Dashboard() {
  const { currentUser, loading, balance, transactions } = useWallet();

  const activeTransactions = transactions.filter((t) => !t.deleted).slice(0, 10);

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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">💰 Welcome, {currentUser?.name || 'User'}!</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your wallet and track transactions</p>
      </div>

      {/* Balance Card */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="card dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <p className="text-blue-100 mb-2">Total Balance</p>
          <h2 className="text-5xl font-bold mb-4">₹{balance.toFixed(2)}</h2>
          <div className="flex gap-4 pt-4 border-t border-blue-400 dark:border-blue-500">
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
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 border border-emerald-200 dark:border-emerald-700 rounded-lg shadow-md p-6 hover:shadow-xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div className="text-4xl mb-3">💳</div>
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Add Money</h3>
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">Deposit funds to your wallet</p>
        </a>

        <a
          href="/transfer"
          className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 border border-purple-200 dark:border-purple-700 rounded-lg shadow-md p-6 hover:shadow-xl hover:shadow-purple-200 dark:hover:shadow-purple-900/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div className="text-4xl mb-3">💸</div>
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">Transfer Money</h3>
          <p className="text-purple-700 dark:text-purple-300 text-sm">Send money to another user</p>
        </a>
      </div>

      {/* Recent Transactions */}
      <div className="card dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📊</span> Recent Transactions
        </h3>

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
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-lg hover:shadow-md dark:hover:shadow-slate-800 transition-all duration-200 border border-gray-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                  <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-semibold border border-green-300 dark:border-green-700">
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
            className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
          >
            View All Transactions →
          </a>
        )}
      </div>
    </div>
  );
}
