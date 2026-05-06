"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TopicsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
        >
          <div className="relative overflow-hidden rounded-2xl glass backdrop-blur-2xl min-h-[260px] flex flex-col">

            {/* IMAGE */}
            <Skeleton className="h-[150px] w-full rounded-none rounded-t-2xl" />

            {/* CONTENT */}
            <div className="p-4 flex flex-col justify-between flex-1 gap-3">
              {/* TITLE */}
              <Skeleton className="h-5 w-2/3" />

              {/* STATS ROW */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-3.5 h-3.5 rounded" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-24 rounded-2xl" />
              </div>

              {/* PROGRESS BAR */}
              <Skeleton className="w-full h-1.5 rounded-full mt-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
