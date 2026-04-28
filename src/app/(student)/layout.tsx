"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import StudentHeader from '@/components/student/layout/StudentHeader';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { RecentQuestionsSidebar } from '@/components/student/RecentQuestionsSidebar';
import { RecentQuestionsProvider } from '@/contexts/RecentQuestionsContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { DotPattern } from '@/components/ui/DotPattern';
import { StudentLayoutProps } from '@/types/student/index.types';

export default function StudentLayout({
  children,
}: StudentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Allow public access to profile routes
    if (pathname.startsWith('/profile/')) {
      setLoading(false);
      return;
    }

    // Check if we have a student token
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear any invalid tokens (like admin tokens)
      router.push('/login');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router, pathname]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BruteForceLoader size="md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 relative ">
      {/* Dot Pattern Background - Only in light theme */}
      {mounted && theme === 'dark' && (
        <DotPattern 
          baseColor="#64748B"
          glowColor="#CCFF00"
          dotSize={2}
          gap={25}
          proximity={80}
          glowIntensity={1.2}
          waveSpeed={0.4}
        />
      )}
      
      <ProfileProvider>
        <RecentQuestionsProvider>
          <StudentHeader />
          
          <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </main>
          
          <RecentQuestionsSidebar />
        </RecentQuestionsProvider>
      </ProfileProvider>
    </div>
  );
}
