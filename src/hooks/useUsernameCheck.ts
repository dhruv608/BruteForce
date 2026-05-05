"use client";
import { useMutation } from '@tanstack/react-query';

interface UsernameCheckResponse {
  available: boolean;
}

interface UsernameCheckApiResponse {
  success: boolean;
  data: UsernameCheckResponse;
}

export function useUsernameCheck() {
  return useMutation({
    mutationFn: async (username: string): Promise<UsernameCheckResponse> => {
      const response = await fetch(
        `/api/user/check-username?username=${encodeURIComponent(username.trim())}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to check username availability');
      }
      
      const result: UsernameCheckApiResponse = await response.json();
      return result.data;
    },
    retry: false, // Don't retry username checks
  });
}
