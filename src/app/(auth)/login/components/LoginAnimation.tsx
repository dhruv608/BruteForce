
"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';

const LoginAnimation = () => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    // Fallback UI when animation fails to load
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-muted-foreground">Welcome Back</p>
        </div>
      </div>
    );
  }

  return (
    <DotLottieReact
      src="/signin.lottie"
      loop
      autoplay
      onError={handleError}
    />
  );
};

export default LoginAnimation;
