import { useState, useEffect } from 'react';
import { showError, showSuccess } from '@/ui/toast';
import { OnboardingData } from '@/types/student/index.types';

export function useOnboardingModal(onComplete?: () => void) {
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ username: '', leetcode_id: '', gfg_id: '', linkedin: '', github: '', city_id: undefined, batch_id: undefined });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetStep = (newStep: number) => {
    setStep(newStep);
  };

  const submitOnboarding = async () => {
    if (!confirmChecked) {
      showError('Confirmation Required', 'Please check the box to confirm your LeetCode and GFG usernames are correct.');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showError('Session Expired', 'Your session has expired. Please log in again to continue.');
        return;
      }
      
      // Only send profile data, no city_id/batch_id needed for /me endpoint
      const payload = {
        leetcode_id: data.leetcode_id,
        gfg_id: data.gfg_id,
        linkedin: data.linkedin,
        github: data.github,
        username: data.username
      };
      
      const res = await fetch(`/api/students/me`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        
        if (res.status === 401) {
          showError('Session Expired', 'Your session has expired. Please log in again to continue.');
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to save profile.`);
        }
        return;
      }
      
      showSuccess('Profile Complete!', 'Welcome! Your profile has been set up successfully.');
      
      // Dispatch custom event to notify StudentHeader and page to refresh
      window.dispatchEvent(new Event('profileUpdated'));
      
      // Call onComplete callback to close modal and refresh data
      if (onComplete) {
        onComplete();
      }
      
    } catch (err) {
      // Error is handled by API client interceptor
      showError('Setup Failed', 'We could not complete your profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { step, setStep: handleSetStep, data, setData, confirmChecked, setConfirmChecked, loading, submitOnboarding };
}
