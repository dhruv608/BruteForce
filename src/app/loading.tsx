"use client";

import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <BruteForceLoader size="lg" />
    </div>
  );
}