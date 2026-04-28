"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="glass backdrop-blur-2xl rounded-2xl p-6 flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="glass backdrop-blur-2xl rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="glass backdrop-blur-2xl rounded-2xl p-4">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-border/40">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20 ml-auto" />
            <Skeleton className="h-5 w-24" />
          </div>
          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
