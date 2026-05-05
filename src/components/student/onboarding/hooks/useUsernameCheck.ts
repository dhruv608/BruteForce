"use client";
import { useMutation } from '@tanstack/react-query';

interface UsernameCheckResponse {
  available: boolean;
}

interface UsernameCheckParams {
  username: string;
  userId?: string;
}

export function useUsernameCheck() {
  return useMutation({
    mutationFn: async ({ username, userId }: UsernameCheckParams): Promise<UsernameCheckResponse> => {
      const params = new URLSearchParams({
        username: username.trim(),
        ...(userId && { userId }),
      });
      
      const response = await fetch(
        `/api/user/check-username?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to check username availability');
      }
      
      return response.json();
    },
    retry: false, // Don't retry username checks
  });
}
