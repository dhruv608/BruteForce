"use client";

import { glassToast } from '@/utils/toast-system';


export function showError(title: string, message?: string): void {
  glassToast.error(title, message);
}

/**
 * Show warning toast with premium glass UI
 */
export function showWarning(title: string, message?: string): void {
  // Use error styling for warnings as glassToast doesn't have warning variant
  glassToast.error(title, message);
}

/**
 * Show success toast with premium glass UI
 * Supports both predefined actions and custom messages
 */
export function showSuccess(title: string, message?: string): void {
  glassToast.success(title, message);
}

/**
 * Show loading toast with premium glass UI
 */
export function showLoading(title: string, message?: string): string | number {
  return glassToast.loading(title, message);
}

/**
 * Dismiss all toasts
 */
export function dismissAll(): void {
  glassToast.dismiss();
}

/**
 * Dismiss specific toast by ID
 */
export function dismiss(id: string | number): void {
  glassToast.dismissId(id);
}
