"use client";

import React from 'react';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export function SubtopicLoading() {
  return (
    <div className="flex justify-center p-12">
      <BruteForceLoader size="sm" />
    </div>
  );
}
