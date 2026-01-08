import React, { useEffect, useState, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn.js';
import { Icon } from './Icon.jsx';
import { Button } from './Button.jsx';

const toastVariants = {
  success: {
    icon: 'check-circle',
    containerClass: 'border-emerald-500/30 bg-emerald-500/10',
    iconClass: 'text-emerald-400',
  },
  error: {
    icon: 'alert-circle',
    containerClass: 'border-red-500/30 bg-red-500/10',
    iconClass: 'text-red-400',
  },
  warning: {
    icon: 'alert-triangle',
    containerClass: 'border-amber-500/30 bg-amber-500/10',
    iconClass: 'text-amber-400',
  },
  info: {
    icon: 'info',
    containerClass: 'border-indigo-500/30 bg-indigo-500/10',
    iconClass: 'text-indigo-400',
  },
};

// Toast context
const ToastContext = createContext(null);

let toastId = 0;

/**
 * Toast provider component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = toastId++;
    const toast = {
      id,
      message,
      type,
      duration: options.duration ?? 4000,
      ...options,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to show toasts
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

/**
 * Toast container
 */
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[1070] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}

/**
 * Individual toast item
 */
function ToastItem({ toast, onRemove }) {
  const { icon, containerClass, iconClass } = toastVariants[toast.type] || toastVariants.info;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onRemove, 300);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onRemove]);

  return (
    <div
      className={cn(
        'pointer-events-auto min-w-[320px] max-w-md',
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg',
        'animate-slideIn',
        isExiting && 'animate-[fadeOut_0.3s_ease-out_forwards]',
        containerClass
      )}
      role="alert"
    >
      <Icon name={icon} size="md" className={cn('mt-0.5 flex-shrink-0', iconClass)} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-text-primary text-sm">{toast.title}</p>
        )}
        <p className="text-sm text-text-secondary">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onRemove, 300);
        }}
        className="flex-shrink-0 p-1 rounded text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
        aria-label="Close toast"
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  );
}

/**
 * Standalone toast component (for legacy usage)
 */
export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const { icon, containerClass, iconClass } = toastVariants[type] || toastVariants.info;

  return createPortal(
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[1070]',
        'pointer-events-auto min-w-[320px] max-w-md',
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg',
        'animate-slideIn',
        containerClass
      )}
      role="alert"
    >
      <Icon name={icon} size="md" className={cn('mt-0.5 flex-shrink-0', iconClass)} />
      <p className="text-sm text-text-primary">{message}</p>
    </div>,
    document.body
  );
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);
