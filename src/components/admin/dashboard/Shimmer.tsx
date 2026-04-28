"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardShimmer() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="glass backdrop-blur-2xl mb-5 p-5 -mt-3 rounded-2xl space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3 border-b border-border/40">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
