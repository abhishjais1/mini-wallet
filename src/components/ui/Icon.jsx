import React from 'react';
import { cn } from '../../utils/cn.js';
import * as LucideIcons from 'lucide-react';

// Convert kebab-case to PascalCase for lucide-react icon names
// e.g., "trash-2" -> "Trash2", "arrow-left" -> "ArrowLeft", "refresh-cw" -> "RefreshCw"
function toPascalCase(str) {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Icon component wrapper for lucide-react icons
 *
 * @param {string} name - Name of the lucide-react icon (PascalCase, camelCase, or kebab-case)
 * @param {string} size - Size of the icon: 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} color - Color class
 */
export function Icon({
  name,
  size = 'md',
  color = 'text-text-secondary',
  className = '',
  ...props
}) {
  // Try direct lookup first (PascalCase or exact match)
  let IconComponent = LucideIcons[name];
  
  // If not found, try converting from kebab-case to PascalCase
  if (!IconComponent) {
    const pascalName = toPascalCase(name);
    IconComponent = LucideIcons[pascalName];
  }

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-12 h-12',
  };

  return (
    <IconComponent
      className={cn(sizeClasses[size] || sizeClasses.md, color, className)}
      {...props}
    />
  );
}

/**
 * Icon container with background and border
 */
export function IconContainer({
  name,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) {
  const variantClasses = {
    default: 'bg-surface-elevated border border-border text-text-secondary',
    primary: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/10 border border-red-500/20 text-red-400',
    warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
  };

  const containerSizes = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-4',
  };

  return (
    <div
      className={cn(
        'rounded-lg inline-flex',
        variantClasses[variant] || variantClasses.default,
        containerSizes[size] || containerSizes.md,
        'transition-all duration-fast',
        'hover:shadow-glow',
        className
      )}
      {...props}
    >
      <Icon name={name} size={size} />
    </div>
  );
}

// Export all lucide-react icons for convenience
export * from 'lucide-react';
