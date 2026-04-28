/**
 * Common API response and error types shared across all roles
 */

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
  code?: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN';
  batch_id?: number;
  city?: {
    id: number;
    city_name: string;
  } | null;
  batch?: {
    id: number;
    batch_name: string;
    year: number;
    city_id: number;
  } | null;
  created_at?: string;
  updated_at?: string;
}
