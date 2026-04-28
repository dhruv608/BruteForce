"use client";

import { Skeleton } from "@/components/ui/skeleton";

// Batch Header Shimmer
function BatchHeaderShimmer() {
  return (
    <div className="glass hover-glow rounded-2xl p-5 mb-5 -mt-3 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10 p-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
}

// Batch Filters Shimmer
function BatchFiltersShimmer() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-2xl" />
        <Skeleton className="h-10 w-28 rounded-2xl" />
        <Skeleton className="h-10 w-28 rounded-full" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Batch Table Shimmer
function BatchTableShimmer() {
  return (
    <div className="hover-glow rounded border border-border/30 overflow-hidden relative">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex gap-4 py-3 px-4 border-b border-border/40 bg-accent/40">
          <Skeleton className="h-4 w-28 flex-1" />
          <Skeleton className="h-4 w-16 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-16 flex-1 text-center" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 py-4 px-4 items-center border-b border-border/20">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-5 w-[60px] rounded-full" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[30px] mx-auto" />
            <div className="flex justify-end gap-2 flex-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Batch Card Grid Shimmer
function BatchCardsShimmer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass rounded-2xl p-5 border border-border/30 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface BatchShimmerProps {
  viewMode?: 'table' | 'cards';
}

export function BatchShimmer({ viewMode = 'table' }: BatchShimmerProps) {
  return (
    <div className="space-y-6">
      <BatchHeaderShimmer />
      <BatchFiltersShimmer />

      <div className="glass rounded-2xl overflow-hidden border border-border p-6">
        {viewMode === 'table' ? <BatchTableShimmer /> : <BatchCardsShimmer />}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/20">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
