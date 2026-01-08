import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Input component following Neo-Fi design system
 * Minimalist, bottom-border styling for modern aesthetic
 */
export function Input({
  className = '',
  type = 'text',
  error = false,
  label,
  id,
  ...props
}) {
  const inputClasses = cn(
    'w-full h-12 px-4',
    'bg-transparent border-b-2 border-border',
    'text-text-primary placeholder:text-text-muted',
    'focus:border-accent-primary focus:shadow-glow',
    'transition-all duration-fast',
    'outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={inputClasses}
        {...props}
      />
    </div>
  );
}

/**
 * Textarea component
 */
export function Textarea({
  className = '',
  error = false,
  label,
  id,
  rows = 4,
  ...props
}) {
  const textareaClasses = cn(
    'w-full px-4 py-3',
    'bg-surface-elevated border border-border rounded-xl',
    'text-text-primary placeholder:text-text-muted',
    'focus:border-accent-primary focus:shadow-glow',
    'transition-all duration-fast',
    'outline-none resize-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
    </div>
  );
}
