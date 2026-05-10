"use client";

import React from 'react';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Loader2,
  X
} from 'lucide-react';


// Set to track currently active toast IDs for deduplication
const activeToastIds = new Set<string>();

/**
 * Generate a unique ID based on title + message content and type
 * This ensures same title + message + type = same ID
 */
function generateToastId(title: string, type: 'success' | 'error' | 'loading', message?: string): string {
  const content = `${type}:${title}:${message ?? ''}`;
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
const PremiumToastRenderer = ({ toast: toastObj, title, message, icon, id }: any) => {
  const isSuccess = toastObj.type === 'success';
  const isError = toastObj.type === 'error';
  const isLoading = toastObj.type === 'loading';

  const getIcon = () => {
    if (isLoading) return React.createElement(Loader2, { className: "w-5 h-5 animate-spin text-blue-400", strokeWidth: 3 });
    if (isSuccess) return React.createElement(CheckCircle, { className: "w-5 h-5 text-logo", strokeWidth: 3 });
    if (isError) return React.createElement(XCircle, { className: "w-5 h-5 text-hard", strokeWidth: 3 });
    return icon;
  };

  const getTitleColorClass = () => {
    if (isSuccess) return 'text-logo';
    if (isError) return 'text-hard sm:text-red-500';
    return 'text-foreground';
  };

  return React.createElement('div', {
    className: `
      bg-background
      dark:bg-background/80
      border-2 border-border/60
      rounded-2xl
      p-4
      shadow-2xl drop-shadow-xl
      flex items-start gap-3
      min-w-[320px]
      max-w-[420px]
      relative
      overflow-hidden
    `
  },
    // Icon
    React.createElement('div', {
      className: "flex-shrink-0 mt-0.5"
    }, getIcon()),

    // Content
    React.createElement('div', {
      className: "flex-1 min-w-0"
    },
      // Title
      React.createElement('div', {
        className: `font-bold text-[15px] ${getTitleColorClass()} tracking-tight leading-tight`
      }, title),
      // Message (only rendered when provided)
      message && React.createElement('div', {
        className: "text-[13px] text-muted-foreground mt-1 leading-snug"
      }, message)
    ),

    // Close Button
    !isLoading && React.createElement('button', {
      onClick: () => toast.dismiss(id),
      className: `
        flex-shrink-0
        w-6 h-6
        flex items-center justify-center
        rounded-md
        border-none
        bg-transparent
        cursor-pointer
        text-muted-foreground
        hover:text-foreground
        hover:bg-muted
        transition-all duration-200
        mt-0.5
      `
    },
      React.createElement(X, { className: "w-4 h-4", strokeWidth: 3 })
    ),


  );
};

// Premium SaaS toast variants
export const glassToast = {
  success: (title: string, message?: string, options?: any) => {
    const toastId = generateToastId(title, 'success', message);

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'success', duration: 4000, ...options },
        title,
        message,
        id: id
      })
      , {
        id: toastId,
        duration: 4000,
        onDismiss: () => cleanupToastId(toastId),
        ...options
      });
  },

  error: (title: string, message?: string, options?: any) => {
    const toastId = generateToastId(title, 'error', message);

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'error', duration: 6000, ...options },
        title,
        message,
        id: id
      })
      , {
        id: toastId,
        duration: 6000,
        onDismiss: () => cleanupToastId(toastId),
        ...options
      });
  },


  loading: (title: string, message?: string, options?: any) => {
    const toastId = generateToastId(title, 'loading', message);

    // If toast with same ID exists, dismiss it first
    if (activeToastIds.has(toastId)) {
      toast.dismiss(toastId);
    }

    // Track this toast as active
    activeToastIds.add(toastId);

    return toast.custom((id) =>
      React.createElement(PremiumToastRenderer, {
        toast: { type: 'loading', duration: Infinity, ...options },
        title,
        message,
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
export const handleToastError = (error: any, customTitle?: string, customMessage?: string) => {
  const errorTitle = customTitle || 'Error';
  const errorMessage = customMessage || error?.message || 'An error occurred';
  glassToast.error(errorTitle, errorMessage);
};

export default glassToast;
