/**
 * Admin management form types for superadmin
 */

export interface AdminFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  batch_id: string;
}

export interface AdminSubmitPayload {
  name: string;
  email: string;
  role: string;
  batch_id?: number;
  password?: string;
}

export interface AdminCreateData {
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN';
  batch_id?: number;
  password?: string;
}

export interface AdminUpdateData {
  name?: string;
  email?: string;
  role?: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN';
  batch_id?: number;
  password?: string;
}
