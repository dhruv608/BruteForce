"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import glassToast from '@/utils/toast-system';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ToastTestingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme toggle after mount
  React.useEffect(() => setMounted(true), []);

  const triggerSuccess = () => {
    glassToast.success('Questions Assigned', 'The selected questions have been added to this class.');
  };

  const triggerError = () => {
    glassToast.error('Assignment Failed', 'Failed to assign question. Please try again.');
  };

  const triggerLoading = () => {
    glassToast.loading('Assigning Questions', 'Assigning question to the batch...');
    setTimeout(() => glassToast.dismiss(), 5000);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 space-y-8">
      <div className="absolute top-6 right-6">
        {mounted && (
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </div>

      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Toast Notification Testing</h1>
          <p className="text-muted-foreground">
            Test the toast UI in the current theme. Toggle the theme using the button in the top right.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={triggerSuccess} className="w-full">
            Success Toast
          </Button>
          <Button variant="destructive" onClick={triggerError} className="w-full">
            Error Toast
          </Button>
          <Button variant="secondary" onClick={triggerLoading} className="w-full">
            Loading Toast
          </Button>
        </div>
      </div>
    </div>
  );
}
