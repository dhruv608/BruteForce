"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BookmarkShimmer() {
  return (
    <div className="space-y-3 p-5 rounded-2xl glass backdrop-blur-md">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-start rounded-2xl border border-border/60 px-6 py-5"
        >
          {/* LEFT SIDE SKELETON */}
          <div className="flex flex-col gap-3 flex-1">
            {/* TITLE SKELETON */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
            </div>

            {/* BADGES SKELETON */}
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-6 w-16 rounded-2xl" />
              <Skeleton className="h-6 w-24 rounded-2xl" />
            </div>

            {/* DESCRIPTION SKELETON */}
            <Skeleton className="h-3 w-64" />
          </div>

          {/* RIGHT SIDE SKELETON */}
          <div className="flex flex-col items-end gap-3 ml-6">
            {/* ACTION BUTTONS SKELETON */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-2xl" />
              <Skeleton className="h-8 w-16 rounded-2xl" />
            </div>

            {/* DATE SKELETON */}
            <Skeleton className="h-6 w-32 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
