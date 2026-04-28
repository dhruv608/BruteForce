"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertCircle, X, Sparkles } from "lucide-react";
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { Button } from "../../app/(auth)/shared/components/Button";
import { useOtpVerification } from "../../app/(auth)/verify-otp/hooks/useOtpVerification";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VerifyOtpModalContent({ isOpen, onClose }: VerifyOtpModalProps) {
  const {
    fpOtpArray,
    error,
    loading,
    handleOtpChange,
    handleOtpKeyDown,
    handlePaste,
    handleVerifyOtpLocal,
    router,
    firstOtpInputRef,
    inputRefs,
  } = useOtpVerification();

  // Local ref for handling the ref callback properly
  const localInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Auto-focus first input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstOtpInputRef.current?.focus(), 100);
    }
  }, [isOpen, firstOtpInputRef]);

  // AUTO-SUBMIT LOGIC: When all 6 digits are filled, trigger submit
  useEffect(() => {
    const isFull = fpOtpArray.every((digit) => digit !== "");
    if (isFull && !loading) {
      // Small delay for better UX so user sees the last digit enter
      const timer = setTimeout(() => {
        const form = document.getElementById("otp-form") as HTMLFormElement;
        form?.requestSubmit();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fpOtpArray, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 🔥 PREMIUM BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-login/80 backdrop-blur-md"
      />

      {/* 🔥 AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-logo/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔥 MODAL CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="
          relative z-10 w-full max-w-[420px]
           border border-white/[0.06]
          rounded-[32px] overflow-hidden
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] bg-login
        "
      >
        {/* TOP REFLECTION */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all z-20"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="relative px-8 pt-10 pb-4 text-center">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-logo/10 border border-logo/20 mb-6 group"
          >
            <ShieldCheck className="text-logo group-hover:scale-110 transition-transform" size={28} />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
            Verify <span className="text-[#CCFF00]">Identity</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            We sent a 6-digit code to your inbox
          </p>
        </div>

        {/* BODY */}
        <div className="px-8 pb-10 pt-4">
          <form id="otp-form" onSubmit={handleVerifyOtpLocal} className="space-y-8">
            

            {/* 🔥 ENHANCED OTP INPUT GRID */}
            <div className="flex justify-center gap-3">
  {fpOtpArray.map((digit, idx) => (
    <input
      key={idx}
      ref={(el) => {
        localInputRefs.current[idx] = el;
        inputRefs.current[idx] = el;
        if (idx === 0 && firstOtpInputRef) {
          (firstOtpInputRef as any).current = el;
        }
      }}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={digit}
      disabled={loading}
      onChange={(e) => handleOtpChange(idx, e.target.value)}
      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
      onPaste={idx === 0 ? handlePaste : undefined}
      className={`
        w-12 h-14 sm:w-14 sm:h-16
        rounded-md border border-input
        bg-background

        text-center text-xl font-semibold
        text-foreground

        shadow-sm
        transition-all duration-200

        focus:outline-none
        focus:ring-2 focus:ring-ring
        focus:border-ring

        disabled:opacity-50 disabled:cursor-not-allowed

        ${digit ? "border-ring" : ""}
      `}
    />
  ))}
</div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full h-14 rounded-2xl
                  bg-logo text-black font-black text-sm uppercase tracking-widest
                  hover:bg-logo hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]
                  active:scale-[0.98] transition-all duration-300
                  disabled:opacity-50 disabled:grayscale
                "
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <BruteForceLoader size="sm" />
                    Authenticating
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Code <Sparkles size={16} />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-foreground transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Resend Code / Change Email</span>
              </button>
            </div>
          </form>
        </div>

        {/* BOTTOM DECORATIVE SCANLINE */}
      </motion.div>

      {/* CUSTOM ANIMATION FOR INPUT BOXES */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        /* Shake animation for error */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export function VerifyOtpModal(props: VerifyOtpModalProps) {
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0F]">
          <BruteForceLoader size="md" />
        </div>
      }
    >
      <VerifyOtpModalContent {...props} />
    </Suspense>
  );
}