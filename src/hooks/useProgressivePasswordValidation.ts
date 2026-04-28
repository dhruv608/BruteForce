import { useMemo } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { getNextPasswordRequirement, ProgressiveValidationResult } from '@/utils/progressivePasswordValidation';

/**
 * Custom hook for progressive password validation with debouncing
 * 
 * @param password - Current password string
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Progressive validation result with debounced updates
 */
export function useProgressivePasswordValidation(password: string = '', delay: number = 500) {
  // Debounce the password value to avoid validation on every keystroke
  const debouncedPassword = useDebouncedValue(password, delay);

  // Calculate progressive validation result based on debounced password
  const validationResult = useMemo((): ProgressiveValidationResult => {
    return getNextPasswordRequirement(debouncedPassword);
  }, [debouncedPassword]);

  // Helper to get color classes for UI
  const getColorClasses = useMemo(() => ({
    red: {
      text: 'text-red-400',
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      focus: 'focus:border-red-400 focus:ring-red-400/20',
      progress: 'bg-red-500'
    },
    yellow: {
      text: 'text-yellow-400',
      border: 'border-yellow-500',
      bg: 'bg-yellow-500/10',
      focus: 'focus:border-yellow-400 focus:ring-yellow-400/20',
      progress: 'bg-yellow-500'
    },
    green: {
      text: 'text-green-400',
      border: 'border-green-500',
      bg: 'bg-green-500/10',
      focus: 'focus:border-green-400 focus:ring-green-400/20',
      progress: 'bg-green-500'
    }
  }), []);

  const currentColorClasses = getColorClasses[validationResult.color];

  return {
    validationResult,
    currentColorClasses,
    isComplete: validationResult.isComplete,
    message: validationResult.message,
    currentStep: validationResult.currentStep,
    totalSteps: validationResult.totalSteps,
    color: validationResult.color
  };
}
