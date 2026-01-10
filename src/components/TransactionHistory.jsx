import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/index.js';
import { formatCurrency, formatDate, getTransactionIcon } from '../utils/formatters.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Select, SelectOption } from './ui/Select.jsx';
import { Badge, StatusBadge, TypeBadge } from './ui/Badge.jsx';
import { Icon, IconContainer } from './ui/Icon.jsx';
import { TransactionSkeleton } from './ui/Skeleton.jsx';
import { NoResultsEmptyState, TransactionsEmptyState } from './ui/EmptyState.jsx';
import { Modal } from './ui/Modal.jsx';
import { ToastProvider, useToast } from './ui/Toast.jsx';

/**
 * Transaction History Component
 */
function TransactionHistoryContent() {
  const { transactions, loading, deleteTransaction, retryTransaction } = useWallet();
  const { addToast } = useToast();

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    // First filter, then sort by date descending (most recent first)
    return transactions
      .filter((t) => {
        // Status filter
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;

        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;

        // Start date filter
        if (startDate) {
          const transactionDate = new Date(t.timestamp);
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (transactionDate < start) return false;
        }

        // End date filter
        if (endDate) {
          const transactionDate = new Date(t.timestamp);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (transactionDate > end) return false;
        }

        return true;
      })
      // Sort by timestamp descending (newest first)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, statusFilter, typeFilter, startDate, endDate]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, startDate, endDate, itemsPerPage]);

  //  page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      //  show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Check if any filters are active
  const hasActiveFilters =
    statusFilter !== 'all' || typeFilter !== 'all' || startDate || endDate;

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await deleteTransaction(id);
    if (result.success) {
      addToast(result.message, 'success');
      setDeleteConfirm(null);
    } else {
      addToast(result.message, 'error');
    }
  };

  // Handle retry for failed transactions
  const handleRetry = async (id) => {
    const result = await retryTransaction(id);
    if (result.success) {
      addToast(result.message, 'info');
    } else {
      addToast(result.message, 'error');
    }
  };

  //  transaction type icon and color
  const getTypeConfig = (type) => {
    switch (type) {
      case 'credit':
        return { icon: 'arrow-down-left', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'debit':
        return { icon: 'arrow-up-right', color: 'text-text-primary', bg: 'bg-surface-elevated', border: 'border-border' };
      case 'fee':
        return { icon: 'receipt', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      default:
        return { icon: 'circle', color: 'text-text-muted', bg: 'bg-surface-elevated', border: 'border-border' };
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary mb-1">
            Transaction History
          </h1>
          <p className="text-text-secondary">
            {filteredTransactions.length > 0 
              ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredTransactions.length)} of ${filteredTransactions.length} transactions`
              : `${filteredTransactions.length} of ${transactions.length} transactions`
            }
          </p>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Icon name="arrow-left" size="sm" className="mr-1" />
            Back
          </Button>
        </Link>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="filter" size="md" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <Select
                id="statusFilter"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <Select
                id="typeFilter"
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                <option value="fee">Fee</option>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <Input
                id="startDate"
                type="date"
                label="From Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <Input
                id="endDate"
                type="date"
                label="To Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12">
              {hasActiveFilters || transactions.length > 0 ? (
                <NoResultsEmptyState onReset={clearFilters} />
              ) : (
                <TransactionsEmptyState />
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {paginatedTransactions.map((transaction) => {
                const typeConfig = getTypeConfig(transaction.type);
                const isFailed = transaction.status === 'failed';

                return (
                  <div
                    key={transaction.id}
                    className={`p-4 md:p-6 hover:bg-surface-elevated transition-colors duration-fast ${
                      isFailed ? 'bg-error/5' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl border ${typeConfig.bg} ${typeConfig.border}`}
                      >
                        <Icon name={typeConfig.icon} size="md" className={typeConfig.color} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-text-primary">{transaction.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-sm text-text-muted">
                                {formatDate(transaction.timestamp, { includeTime: true })}
                              </p>
                              <span className="text-text-muted">•</span>
                              <TypeBadge type={transaction.type} />
                            </div>
                            {isFailed && transaction.reason && (
                              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <Icon name="alert-circle" size="sm" />
                                {transaction.reason}
                              </p>
                            )}
                          </div>

                          {/* Amount & Actions */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p
                                className={`font-mono text-lg font-semibold ${
                                  transaction.type === 'credit'
                                    ? 'text-emerald-400'
                                    : transaction.type === 'fee'
                                    ? 'text-amber-400'
                                    : 'text-text-primary'
                                }`}
                              >
                                {transaction.type === 'credit' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </p>
                              <StatusBadge status={transaction.status} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {isFailed && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRetry(transaction.id)}
                                  title="Retry transaction"
                                >
                                  <Icon name="refresh-cw" size="sm" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(transaction)}
                                title="Delete transaction"
                              >
                                <Icon name="trash-2" size="sm" className="text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination Controls */}
        {filteredTransactions.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Show</span>
                <Select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-20"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Select>
                <span className="text-sm text-text-secondary">per page</span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Previous page"
                >
                  <Icon name="chevron-left" size="sm" />
                </Button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-text-muted">...</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[36px]"
                    >
                      {page}
                    </Button>
                  )
                ))}

                {/* Next button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Next page"
                >
                  <Icon name="chevron-right" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Transaction"
        size="sm"
      >
        <div className="space-y-6">
          <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
            <p className="text-text-primary">
              Are you sure you want to delete this transaction?
            </p>
            <p className="text-sm text-text-secondary mt-2">
              {deleteConfirm?.description} — {formatCurrency(deleteConfirm?.amount)}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteConfirm.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/**
 * Transaction History wrapper with Toast Provider
 */
export function TransactionHistory() {
  return (
    <ToastProvider>
      <TransactionHistoryContent />
    </ToastProvider>
  );
}
