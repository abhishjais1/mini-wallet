import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Select component following Neo-Fi design system
 */
export function Select({
  className = '',
  error = false,
  label,
  id,
  children,
  ...props
}) {
  const selectClasses = cn(
    'w-full h-12 px-4',
    'bg-surface-elevated border border-border rounded-xl',
    'text-text-primary',
    'focus:border-accent-primary focus:shadow-glow',
    'transition-all duration-fast',
    'outline-none appearance-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    className
  );

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={selectClasses}
        {...props}
      >
        {children}
      </select>
      {/* Custom dropdown arrow icon */}
      <svg
        className="absolute right-4 top-[38px] pointer-events-none text-text-muted"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Select option component
 */
export function SelectOption({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
