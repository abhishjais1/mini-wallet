import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Skeleton component for loading states
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('animate-pulse bg-surface-elevated rounded', className)}
      {...props}
    />
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton({ className = '' }) {
  return (
    <div className={cn('bg-surface border border-border rounded-2xl p-6', className)}>
      <Skeleton className="h-5 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Text skeleton with multiple lines
 */
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/**
 * Transaction list item skeleton
 */
export function TransactionSkeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-border',
        'animate-pulse',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-5 w-20 mb-1" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 5, className = '' }) {
  return (
    <div className={cn('flex gap-4 p-4 border-b border-border', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * Spinner component
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={cn(
        'animate-spin text-accent-primary',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
