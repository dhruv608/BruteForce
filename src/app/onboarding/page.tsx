"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStep1 } from '@/components/student/onboarding/components/OnboardingStep1';
import { OnboardingStep2 } from '@/components/student/onboarding/components/OnboardingStep2';
import { OnboardingStep3 } from '@/components/student/onboarding/components/OnboardingStep3';
import { ProgressBar } from '@/components/student/onboarding/components/ProgressBar';
import { useOnboarding } from '@/components/student/onboarding/hooks/useOnboarding';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function OnboardingPage() {
  const router = useRouter();
  const [onboardingUser, setOnboardingUser] = useState<any>(null);
  const { step, setStep, data, confirmChecked, setConfirmChecked, loading, submitOnboarding } = useOnboarding();

  useEffect(() => {
    const stored = localStorage.getItem('onboardingUser');
    if (stored) {
      setOnboardingUser(JSON.parse(stored));
    } else {
      // No onboarding data, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleSubmitOnboarding = async () => {
    await submitOnboarding();
    // Clear onboarding user data after successful submission
    localStorage.removeItem('onboardingUser');
    // After successful onboarding, redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50 backdrop-blur-md  border border-border rounded-full p-1 ">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>
      <div className=" max-w-[720px] bg-login border border border-border  rounded-[40px] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-border/30 relative">
          {/* Header Actions */}
          <div className="absolute top-6 right-6 flex items-center gap-3">

            <button
              onClick={() => router.push('/login')}
              className="rounded-full w-9 h-9 p-0 border border-border bg-background hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center hover:border-primary/50 hover:shadow-[0_0_8px_var(--hover-glow)]"
              title="Back to login"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to login</span>
            </button>
          </div>

          <h2 className="text-lg font-semibold">
            Complete Your Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step {step} of 3 - Let's set up your BruteForce profile
          </p>
        </div>

        {/* STEPPER */}
        <div className="px-6 pt-4">
          <ProgressBar step={step} />
        </div>

        {/* BODY */}
        <div className="px-6 pb-6 pt-4 max-h-[75vh] overflow-y-auto">
          {step === 1 && (
            <OnboardingStep1
              data={data}
              setData={setData}
              setStep={setStep}
              onboardingUser={onboardingUser}
            />
          )}

          {step === 2 && (
            <OnboardingStep2
              data={data}
              setData={setData}
              setStep={setStep}
            />
          )}

          {step === 3 && (
            <OnboardingStep3
              data={data}
              setStep={setStep}
              confirmChecked={confirmChecked}
              setConfirmChecked={setConfirmChecked}
              submitOnboarding={handleSubmitOnboarding}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}