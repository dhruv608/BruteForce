"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { UserX, ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileNotFoundProps {
  username?: string;
  error?: string;
}

export function ProfileNotFound({ username, error }: ProfileNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-16 mt-3">
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        {/* Icon */}
        <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <UserX className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          Profile Not Found
        </h1>

        {/* Message */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          {username ? (
            <p className="text-muted-foreground text-lg mb-2">
              The profile <span className="font-mono font-semibold text-foreground bg-muted/50 px-2 py-1 rounded">@{username}</span> doesn't exist
            </p>
          ) : (
            <p className="text-muted-foreground text-lg mb-2">
              The requested profile doesn't exist
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            {error || "The username may be incorrect or the user might have been removed"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <p className="text-muted-foreground text-sm">
            Looking for someone? Try searching for their username or check the spelling.
          </p>
        </div>
      </div>
    </div>
  );
}
