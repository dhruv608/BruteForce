"use client";

import React from 'react';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Loader2,
  X
} from 'lucide-react';

// =============================================================================
// TOAST DEDUPLICATION SYSTEM
// =============================================================================

// Set to track currently active toast IDs for deduplication
const activeToastIds = new Set<string>();

/**
 * Generate a unique ID based on message content and type
 * This ensures same error message + type = same ID
 */
function generateToastId(message: string, type: 'success' | 'error' | 'loading'): string {
  // Simple hash function to create consistent ID from message + type
  const content = `${type}:${message}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `toast-${Math.abs(hash)}`;
}

/**
 * Clean up toast ID when toast is dismissed
 */
function cleanupToastId(id: string): void {
  activeToastIds.delete(id);
}

// Custom premium toast renderer
const PremiumToastRenderer = ({ toast: toastObj, title, description, icon, id }: any) => {
  const isSuccess = toastObj.type === 'success';
  const isError = toastObj.type === 'error';
  const isLoading = toastObj.type === 'loading';

  const getIcon = () => {
    if (isLoading) return React.createElement(Loader2, { className: "w-5 h-5 animate-spin text-blue-400" });
    if (isSuccess) return React.createElement(CheckCircle, { className: "w-5 h-5 text-primary" });
    if (isError) return React.createElement(XCircle, { className: "w-5 h-5 text-red-400" });
    return icon;
  };



  const getTextColorClass = () => {
    if (isSuccess) return 'text-primary';
    if (isError) return 'text-red-400';
    return 'text-gray-300';
  };

  const duration = toastObj.duration || 4000;

  return React.createElement('div', {
    className: `
      dark:bg-glass-bg 
      border border-border     
      rounded-2xl
      p-4
      flex items-center gap-3
      min-w-[320px]
      max-w-[400px]
      relative
    `
  },
    // Icon
    React.createElement('div', {
      className: "flex-shrink-0"
    }, getIcon()),

    // Content
    React.createElement('div', {
      className: "flex-1 min-w-0"
    },
      React.createElement('div', {
        className: `font-semibold text-sm ${getTextColorClass()} truncate`
      }, title || description)
    ),

    // Close Button
    !isLoading && React.createElement('button', {
      onClick: () => toast.dismiss(id),
      className: `
        flex-shrink-0
        w-6 h-6
        flex items-center justify-center
        rounded
        border-none
        bg-transparent
        cursor-pointer 
        text-foreground/60
        hover:text-white/90
        hover:bg-white/10
        transition-all duration-200
      `
    },
      React.createElement(X, { className: "w-4 h-4" })
    )
  );
};

// Premium SaaS toast variants
export const glassToast = {
  success: (message: string, options?: any) => {
    const toastId = generateToastId(message, 'success');

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'success', duration: 4000, ...options },
        title: message,
        id: id
      })
      , {
        id: toastId,
        duration: 4000,
        onDismiss: () => cleanupToastId(toastId),
        ...options
      });
  },

  error: (message: string, options?: any) => {
    const toastId = generateToastId(message, 'error');

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'error', duration: 6000, ...options },
        title: message,
        id: id
      })
      , {
        id: toastId,
        duration: 6000,
        onDismiss: () => cleanupToastId(toastId),
        ...options
      });
  },


  loading: (message: string, options?: any) => {
    const toastId = generateToastId(message, 'loading');

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'loading', duration: Infinity, ...options },
        title: message,
        id: id
      })
      , {
        id: toastId,
        duration: Infinity,
        onDismiss: () => cleanupToastId(toastId),
        ...options
      });
  },

  // Promise-based toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  dismissId: (id: string | number) => {
    toast.dismiss(id);
  },
};

// Helper function to handle errors
export const handleToastError = (error: any, customMessage?: string) => {
  const errorMessage = customMessage || error?.message || 'An error occurred';
  glassToast.error(errorMessage);
};

export default glassToast;
