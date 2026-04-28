"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShimmer() {
  return (
    <div className="space-y-8 pb-10 min-h-screen p-6">
      {/* Header Shimmer */}
      <div className="flex items-center justify-between glass mb-5 p-5 -mt-9 backdrop-blur-2xl rounded-2xl">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Stats Cards Shimmer */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cities Card */}
        <div className="glass p-4 rounded-2xl backdrop-blur-2xl border border-border/20">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-12" />
          <div className="mt-1 flex items-center gap-1.5">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Batches Card */}
        <div className="glass p-4 rounded-2xl backdrop-blur-2xl border border-border/20">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-12" />
          <div className="mt-1 flex items-center gap-1.5">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Admins Card */}
        <div className="glass p-4 rounded-2xl backdrop-blur-2xl border border-border/20">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-12" />
          <div className="mt-1 flex items-center gap-1.5">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Chart and Quick Actions Shimmer */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* City Breakdown Chart */}
        <div className="md:col-span-2 glass rounded-2xl backdrop-blur-2xl p-3 border border-border/20">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-[220px] w-full rounded-lg" />
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/10">
            <Skeleton className="h-3 w-3 rounded-sm" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass backdrop-blur-2xl h-full rounded-2xl p-5 border border-border/20">
          <div className="flex items-center gap-2 mb-7">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-border/20">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
