import React from 'react';
import { cn } from '../../utils/cn.js';

const buttonVariants = {
  primary: `
    h-11 px-6 rounded-xl font-semibold font-heading
    bg-gradient-to-r from-accent-primary to-accent-tertiary
    text-white shadow-lg shadow-accent-primary/25
    hover:shadow-xl hover:shadow-accent-primary/35 hover:-translate-y-0.5
    active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-lg
    transition-all duration-base
    focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void
  `,
  secondary: `
    h-11 px-6 rounded-xl font-semibold font-heading
    bg-surface-elevated border border-border
    text-text-primary
    hover:border-accent-primary hover:bg-surface hover:shadow-glow
    active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-base
    focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void
  `,
  ghost: `
    h-11 px-4 rounded-xl font-medium font-heading
    text-text-secondary
    hover:text-text-primary hover:bg-white/5
    active:bg-white/10
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-base
    focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void
  `,
  destructive: `
    h-11 px-6 rounded-xl font-semibold font-heading
    bg-red-500/10 text-red-400 border border-error/20
    hover:bg-red-500/20 hover:border-error/40 hover:shadow-lg hover:shadow-red-500/20
    active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-base
    focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-void
  `,
  danger: `
    h-11 px-6 rounded-xl font-semibold font-heading
    bg-red-500 text-white
    hover:bg-red-500/90 hover:shadow-lg hover:shadow-red-500/30
    active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-base
    focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-void
  `,
  link: `
    h-auto px-2 py-1 rounded-lg font-medium font-heading
    text-accent-secondary
    hover:text-accent-primary hover:underline underline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-fast
    focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void rounded-md
  `,
};

const sizeVariants = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-13 px-8 text-lg',
  icon: 'h-11 w-11 p-0',
};

/**
 * Button component following Neo-Fi design system
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger' | 'link'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg' | 'icon'
 * @param {boolean} props.isLoading - Show loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ElementType} props.as - Component to render as (default: 'button')
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  as: Component = 'button',
  disabled,
  ...props
}) {
  const baseClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = sizeVariants[size] || sizeVariants.md;

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'disabled:pointer-events-none',
        baseClasses,
        size !== 'icon' && sizeClasses,
        size === 'icon' && sizeVariants.icon,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
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
      )}
      {children}
    </Component>
  );
}
