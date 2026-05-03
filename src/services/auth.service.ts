import { apiClient } from '@/api';
import { showSuccess } from '@/ui/toast';

export const loginAdmin = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/admin/login', data);
  // Check if response is undefined (network error handled by interceptor)
  if (!response) {
    return undefined;
  }
  showSuccess('Welcome to Admin Portal');
  return response.data;
};

export const loginSuperAdmin = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/admin/login', data);
  // Check if response is undefined (network error handled by interceptor)
  if (!response) {
    return undefined;
  }
  showSuccess('Welcome to SuperAdmin Portal');
  return response.data;
};

export const logoutUser = async (showToast = true) => {
  // Call backend to invalidate refresh token in DB and clear httpOnly refreshToken cookie.
  // Best-effort — never block client-side cleanup if the API call fails.
  try {
    await apiClient.post('/api/auth/admin/logout');
  } catch {
    // Token may already be expired — ignore
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  if (showToast) {
    showSuccess('Logged out successfully.');
  }
};
