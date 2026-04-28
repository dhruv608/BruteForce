import { PASSWORD_RULES } from '@/hooks/usePasswordValidation';

export interface ProgressiveValidationResult {
  message: string;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
  color: 'red' | 'yellow' | 'green';
}

/**
 * Gets the next password requirement for progressive validation flow
 * Shows only one requirement at a time in a specific order
 * 
 * @param password - Current password string
 * @returns ProgressiveValidationResult with next requirement or completion message
 */
export function getNextPasswordRequirement(password: string): ProgressiveValidationResult {
  // Define the order of validation steps
  const validationSteps = [
    {
      rule: PASSWORD_RULES[0], // Minimum 8 characters
      stepMessage: 'Password must be at least 8 characters',
      color: 'red' as const
    },
    {
      rule: PASSWORD_RULES[1], // At least 1 uppercase letter
      stepMessage: 'Add at least one uppercase letter',
      color: 'red' as const
    },
    {
      rule: PASSWORD_RULES[2], // At least 1 lowercase letter
      stepMessage: 'Add at least one lowercase letter',
      color: 'yellow' as const
    },
    {
      rule: PASSWORD_RULES[3], // At least 1 number
      stepMessage: 'Add at least one number',
      color: 'yellow' as const
    },
    {
      rule: PASSWORD_RULES[4], // At least 1 special character
      stepMessage: 'Add at least one special character',
      color: 'yellow' as const
    }
  ];

  // Check each step in order
  for (let i = 0; i < validationSteps.length; i++) {
    const step = validationSteps[i];
    if (!step.rule.regex.test(password)) {
      return {
        message: step.stepMessage,
        isComplete: false,
        currentStep: i + 1,
        totalSteps: validationSteps.length,
        color: step.color
      };
    }
  }

  // All requirements are met
  return {
    message: 'Strong password ',
    isComplete: true,
    currentStep: validationSteps.length,
    totalSteps: validationSteps.length,
    color: 'green'
  };
}

/**
 * Checks if password meets all requirements for form submission
 * 
 * @param password - Password string to validate
 * @returns Boolean indicating if password is valid
 */
export function isPasswordComplete(password: string): boolean {
  return getNextPasswordRequirement(password).isComplete;
}
