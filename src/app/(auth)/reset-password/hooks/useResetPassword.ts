import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { showError } from '@/ui/toast';

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
      showError("Please enter a new password.");
      setError("Please enter a new password.");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      showError("Passwords do not match.");
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
      
      const response = await studentAuthService.resetPassword(resetData);
      
      setTimeout(() => router.push('/login'), 1000);
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
