"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

export default function BetterTree() {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // ⏳ Delay mount to avoid hydration race condition
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // 🔁 Retry with limit
  useEffect(() => {
    if (hasError && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        setHasError(false);
        setRetryKey((prev) => prev + 1);
        setRetryCount((prev) => prev + 1);
      }, 1000); // retry after 1 second

      return () => clearTimeout(retryTimer);
    }
  }, [hasError, retryCount]);

  if (!mounted) return null;

  // Fallback component when animation fails to load
  const FallbackAnimation = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl font-bold text-primary">BF</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {retryCount >= 3 ? "Animation unavailable" : `Retrying... (${retryCount}/3)`}
        </p>
      </div>
    </div>
  );

  if (hasError || retryCount >= 3) {
    return <FallbackAnimation />;
  }

  return (
    <DotLottieReact
      key={retryKey} 
      src="/home.lottie"
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
      onError={(error) => {
        console.error("Lottie animation error:", error);
        setHasError(true);
      }}
      onLoad={() => {
        // Animation loaded successfully
      }}
    />
  );
}