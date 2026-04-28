import { useState, useCallback, useMemo } from 'react';

export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
  missingRequirements: string[];
  passedRequirements: string[];
}

export interface PasswordRule {
  regex: RegExp;
  message: string;
  description: string;
}

/**
 * Password validation rules matching backend validation
 */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    regex: /.{8,}/,
    message: 'Password must be at least 8 characters long',
    description: 'At least 8 characters'
  },
  {
    regex: /[A-Z]/,
    message: 'Password must contain at least one uppercase letter',
    description: 'One uppercase letter'
  },
  {
    regex: /[a-z]/,
    message: 'Password must contain at least one lowercase letter',
    description: 'One lowercase letter'
  },
  {
    regex: /\d/,
    message: 'Password must contain at least one number',
    description: 'One number'
  },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    message: 'Password must contain at least one special character',
    description: 'One special character'
  }
];

/**
 * Custom hook for password validation with real-time feedback
 * 
 * @param password - Password string to validate
 * @returns PasswordValidationResult and helper functions
 */
export function usePasswordValidation(password: string = '') {
  const [validationResult, setValidationResult] = useState<PasswordValidationResult>({
    isValid: false,
    message: 'Password is required',
    strength: 'weak',
    missingRequirements: ['Password is required'],
    passedRequirements: []
  });

  const validatePassword = useCallback((pwd: string): PasswordValidationResult => {
    // Check for empty password
    if (!pwd) {
      return {
        isValid: false,
        message: 'Password is required',
        strength: 'weak',
        missingRequirements: ['Password is required'],
        passedRequirements: []
      };
    }

    const missingRequirements: string[] = [];
    const passedRequirements: string[] = [];

    // Check each rule
    PASSWORD_RULES.forEach(rule => {
      if (!rule.regex.test(pwd)) {
        missingRequirements.push(rule.description);
      } else {
        passedRequirements.push(rule.description);
      }
    });

    const isValid = missingRequirements.length === 0;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let message: string;

    if (isValid) {
      // Calculate strength based on additional factors
      const length = pwd.length;
      const hasComplexSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
      const hasMultipleSpecialChars = (pwd.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2;
      const hasNumbers = (pwd.match(/\d/g) || []).length >= 2;
      const hasMultipleUppercase = (pwd.match(/[A-Z]/g) || []).length >= 2;
      const hasMultipleLowercase = (pwd.match(/[a-z]/g) || []).length >= 2;
      
      if (length >= 12 && (hasMultipleSpecialChars || hasMultipleUppercase || hasMultipleLowercase) && hasNumbers) {
        strength = 'strong';
        message = 'Password is strong and meets all security requirements';
      } else if (length >= 8 && hasComplexSpecialChars) {
        strength = 'medium';
        message = 'Password is good and meets all security requirements';
      } else {
        strength = 'weak';
        message = 'Password meets minimum requirements but could be stronger';
      }
    } else {
      // Build error message based on missing requirements
      if (missingRequirements.length === 1) {
        message = `Missing: ${missingRequirements[0]}`;
      } else if (missingRequirements.length <= 3) {
        message = `Missing: ${missingRequirements.join(', ')}`;
      } else {
        message = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
      }
    }

    return {
      isValid,
      message,
      strength,
      missingRequirements,
      passedRequirements
    };
  }, []);

  // Update validation when password changes
  useState(() => {
    const result = validatePassword(password);
    setValidationResult(result);
  });

  // Real-time validation
  const currentValidation = useMemo(() => {
    return validatePassword(password);
  }, [password, validatePassword]);

  // Strength indicator colors
  const strengthColors = useMemo(() => ({
    weak: 'text-red-500 border-red-500',
    medium: 'text-yellow-500 border-yellow-500', 
    strong: 'text-green-500 border-green-500'
  }), []);

  // Strength indicator background colors
  const strengthBgColors = useMemo(() => ({
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  }), []);

  // Get password requirements for UI display
  const getPasswordRequirements = useCallback((): string[] => {
    return PASSWORD_RULES.map(rule => rule.description);
  }, []);

  // Check if password meets minimum requirements
  const meetsMinimumRequirements = useCallback((pwd: string): boolean => {
    return validatePassword(pwd).isValid;
  }, [validatePassword]);

  return {
    validationResult: currentValidation,
    strengthColors,
    strengthBgColors,
    getPasswordRequirements,
    meetsMinimumRequirements,
    validatePassword
  };
}

/**
 * Hook for managing password input with show/hide functionality
 */
export function usePasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const passwordValidation = usePasswordValidation(password);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handlePasswordChange = useCallback((newPassword: string) => {
    setPassword(newPassword);
  }, []);

  const clearPassword = useCallback(() => {
    setPassword('');
  }, []);

  return {
    password,
    showPassword,
    togglePasswordVisibility,
    handlePasswordChange,
    clearPassword,
    validationResult: passwordValidation.validationResult,
    strengthColors: passwordValidation.strengthColors,
    strengthBgColors: passwordValidation.strengthBgColors,
    isValid: passwordValidation.validationResult.isValid,
    strength: passwordValidation.validationResult.strength
  };
}
