import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Card component following Neo-Fi design system
 * Floating panel aesthetic with subtle borders and glow on hover
 */
export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl',
        'transition-all duration-slow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header component
 */
export function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card title component
 */
export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold font-heading text-text-primary', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Card description component
 */
export function CardDescription({ className = '', children, ...props }) {
  return (
    <p
      className={cn('text-sm text-text-secondary mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Card content component
 */
export function CardContent({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card footer component
 */
export function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Interactive card with hover effects
 */
export function InteractiveCard({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl',
        'hover:border-accent-primary/30 hover:shadow-glow hover:-translate-y-1',
        'cursor-pointer transition-all duration-slow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
