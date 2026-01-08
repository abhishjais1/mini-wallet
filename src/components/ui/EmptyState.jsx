import React from 'react';
import { cn } from '../../utils/cn.js';
import { Icon } from './Icon.jsx';

/**
 * EmptyState component for no-data scenarios
 *
 * @param {string} icon - Name of the lucide-react icon
 * @param {string} title - Title text
 * @param {string} description - Description text
 * @param {React.ReactNode} action - Optional action button/component
 */
export function EmptyState({
  icon = 'inbox',
  title = 'No Data',
  description = 'No items to display',
  action = null,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-6 p-4 bg-surface-elevated border border-border rounded-2xl">
        <Icon name={icon} size="2xl" className="text-text-muted" />
      </div>
      <h3 className="text-xl font-semibold font-heading text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-md mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Empty state for transactions
 */
export function TransactionsEmptyState({ onReset }) {
  return (
    <EmptyState
      icon="receipt"
      title="No Transactions Yet"
      description="Start by adding money to your wallet or making a transfer"
      action={
        onReset && (
          <button
            onClick={onReset}
            className="text-accent-secondary hover:text-accent-primary font-medium text-sm"
          >
            Clear filters
          </button>
        )
      }
    />
  );
}

/**
 * Empty state for search/filter results
 */
export function NoResultsEmptyState({ onReset }) {
  return (
    <EmptyState
      icon="search-x"
      title="No Results Found"
      description="Try adjusting your filters or search criteria"
      action={
        onReset && (
          <button
            onClick={onReset}
            className="text-accent-secondary hover:text-accent-primary font-medium text-sm"
          >
            Clear all filters
          </button>
        )
      }
    />
  );
}
