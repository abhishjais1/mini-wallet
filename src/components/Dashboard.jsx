import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/index.js';
import { formatCurrency, formatRelativeTime, getTransactionIcon } from '../utils/formatters.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Badge, StatusBadge } from './ui/Badge.jsx';
import { Icon, IconContainer } from './ui/Icon.jsx';
import { Skeleton, TransactionSkeleton, Spinner } from './ui/Skeleton.jsx';
import { EmptyState } from './ui/EmptyState.jsx';

/**
 * Dashboard component - main wallet overview
 */
export function Dashboard() {
  const { currentUser, loading, balance, transactions } = useWallet();

  // Get last 10 non-deleted transactions
  const recentTransactions = transactions
    .filter((t) => !t.deleted)
    .slice(0, 10)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Stats calculations
  const totalTransactions = transactions.filter((t) => !t.deleted).length;
  const pendingTransactions = transactions.filter(
    (t) => !t.deleted && t.status === 'pending'
  ).length;

  return (
    <div className="space-y-8 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-text-primary mb-1">
            Welcome back, {currentUser?.name || 'User'}
          </h1>
          <p className="text-text-secondary">
            Here's what's happening with your wallet
          </p>
        </div>
      </div>

      {/* Balance Card */}
      {loading ? (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div className="flex gap-8">
              <Skeleton className="h-16 w-24" />
              <Skeleton className="h-16 w-24" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-surface border-indigo-500/30 relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />

          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-indigo-300 text-xs font-semibold mb-3 uppercase tracking-widest">
                  Total Balance
                </p>
                <h2 className="text-4xl md:text-6xl font-bold font-heading">
                  <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    {formatCurrency(balance)}
                  </span>
                </h2>
                {pendingTransactions > 0 && (
                  <p className="text-text-secondary text-sm mt-2 flex items-center gap-2">
                    <Spinner size="sm" />
                    {pendingTransactions} pending transaction{pendingTransactions > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex gap-6">
                <div className="text-center md:text-right">
                  <p className="text-text-secondary text-sm mb-1">User ID</p>
                  <p className="font-mono text-text-primary font-medium">#{currentUser?.id}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-text-secondary text-sm mb-1">Transactions</p>
                  <p className="font-mono text-text-primary font-medium">{totalTransactions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Link to="/add-money" className="group">
          <Card className="h-full hover:border-accent-primary/30 hover:shadow-glow hover:-translate-y-1 transition-all duration-slow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <IconContainer name="plus-circle" size="lg" variant="primary" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold font-heading text-text-primary mb-1 group-hover:text-accent-secondary transition-colors">
                    Add Money
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Deposit funds to your wallet instantly
                  </p>
                </div>
                <Icon name="chevron-right" className="text-text-muted group-hover:text-accent-secondary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/transfer" className="group">
          <Card className="h-full hover:border-accent-primary/30 hover:shadow-glow hover:-translate-y-1 transition-all duration-slow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <IconContainer name="send" size="lg" variant="success" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold font-heading text-text-primary mb-1 group-hover:text-accent-secondary transition-colors">
                    Transfer Money
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Send funds to other users securely
                  </p>
                </div>
                <Icon name="chevron-right" className="text-text-muted group-hover:text-accent-secondary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-3">
            <IconContainer name="clock-counter-clockwise" size="md" variant="default">
              <Icon name="clock-counter-clockwise" size="sm" />
            </IconContainer>
            Recent Transactions
          </CardTitle>
          {recentTransactions.length > 0 && (
            <Link to="/transactions">
              <Button variant="link" size="sm">
                View All
                <Icon name="arrow-right" size="sm" className="ml-1" />
              </Button>
            </Link>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <EmptyState
              icon="receipt"
              title="No Transactions Yet"
              description="Start by adding money to your wallet"
              action={
                <Link to="/add-money">
                  <Button variant="primary">Add Money</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Transaction item component
 */
function TransactionItem({ transaction, index }) {
  const isCredit = transaction.type === 'credit';
  const isPending = transaction.status === 'pending';
  const isFailed = transaction.status === 'failed';

  return (
    <Link
      to="/transactions"
      className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-elevated transition-all duration-fast group animate-slideUp"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`p-2.5 rounded-lg flex-shrink-0 ${
            isCredit
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : isPending
              ? 'bg-amber-500/10 border border-amber-500/20'
              : isFailed
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-surface-elevated border border-border'
          }`}
        >
          <Icon
            name={getTransactionIcon(transaction.type)}
            size="md"
            className={
              isCredit
                ? 'text-emerald-400'
                : isPending
                ? 'text-amber-400'
                : isFailed
                ? 'text-red-400'
                : 'text-text-secondary'
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text-primary truncate">{transaction.description}</p>
          <p className="text-sm text-text-muted">{formatRelativeTime(transaction.timestamp)}</p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-4">
        <p
          className={`font-mono font-semibold ${
            isCredit
              ? 'text-emerald-400'
              : transaction.type === 'fee'
              ? 'text-amber-400'
              : 'text-text-primary'
          }`}
        >
          {isCredit ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        <StatusBadge status={transaction.status} />
      </div>
    </Link>
  );
}
