import React from 'react';
import { cn } from '../../utils/cn.js';

const badgeVariants = {
  success: 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  error: 'px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20',
  warning: 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20',
  pending: 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse-subtle',
  info: 'px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  neutral: 'px-3 py-1 rounded-full text-xs font-semibold bg-surface-elevated text-text-secondary border border-border',
};

/**
 * Badge component for status indicators
 *
 * @param {'success' | 'error' | 'warning' | 'pending' | 'info' | 'neutral'} variant - Badge variant
 */
export function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}) {
  return (
    <span
      className={cn(badgeVariants[variant] || badgeVariants.neutral, className)}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Status badge for transaction statuses
 */
export function StatusBadge({ status, className = '' }) {
  const statusMap = {
    success: { variant: 'success', label: 'Success' },
    failed: { variant: 'error', label: 'Failed' },
    pending: { variant: 'pending', label: 'Pending' },
  };

  const config = statusMap[status?.toLowerCase()] || statusMap.pending;

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

/**
 * Transaction type badge
 */
export function TypeBadge({ type, className = '' }) {
  const typeMap = {
    credit: { variant: 'success', label: 'Credit' },
    debit: { variant: 'error', label: 'Debit' },
    fee: { variant: 'warning', label: 'Fee' },
  };

  const config = typeMap[type?.toLowerCase()] || { variant: 'neutral', label: type };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
