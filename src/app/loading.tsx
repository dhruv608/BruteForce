"use client";

import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <BruteForceLoader size="lg" />
    </div>
  );
}