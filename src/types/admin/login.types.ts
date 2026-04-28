/**
 * Login-related types for admin
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  // No props needed - handles its own state
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string; // Backend sets as HTTP-only cookie
  user?: {
    name: string;
    email: string;
    role: string;
  };
}
