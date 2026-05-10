import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { showError, showSuccess } from '@/ui/toast';

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const otpParam = searchParams.get('otp');

  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailParam || !otpParam) {
      router.push('/forgot-password');
    }
  }, [emailParam, otpParam, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fpNewPassword) {
      showError('Password Required', 'Please enter a new password to continue.');
      setError("Please enter a new password.");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      showError('Password Mismatch', 'The passwords you entered do not match. Please try again.');
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const resetData = {
        email: emailParam || '',
        otp: otpParam || '',
        newPassword: fpNewPassword
      };
      
      await studentAuthService.resetPassword(resetData);

      showSuccess('Password Reset', 'Your password has been updated. You can now log in.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      // Error is handled by API client interceptor for API errors
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { fpNewPassword, setFpNewPassword, fpConfirmPassword, setFpConfirmPassword, error, loading, handleResetPassword, router };
}
