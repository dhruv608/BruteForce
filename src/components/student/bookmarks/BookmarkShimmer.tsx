"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BookmarkShimmer() {
  return (
    <div className="space-y-3 p-5 rounded-2xl glass backdrop-blur-md">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-start gap-4 rounded-2xl border border-border/60 px-5 py-3"
        >
          {/* LEFT: title + badges */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* TITLE */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-4" />
            </div>

            {/* BADGES */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-2xl" />
              <Skeleton className="h-6 w-24 rounded-2xl" />
            </div>
          </div>

          {/* RIGHT: date + actions, then optional view-description */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <div className="flex items-center gap-0.5">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
