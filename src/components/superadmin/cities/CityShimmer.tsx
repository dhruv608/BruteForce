"use client";

import { Skeleton } from "@/components/ui/skeleton";

// City Header Shimmer
function CityHeaderShimmer() {
  return (
    <div className="glass hover-glow rounded-2xl p-5 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10 p-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

// City Filters Shimmer
function CityFiltersShimmer() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-24 rounded-full" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// City Table Shimmer
function CityTableShimmer() {
  return (
    <div className="hover-glow bg-transparent rounded-2xl border border-border/30 overflow-hidden relative">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex gap-4 py-3 px-4 border-b border-border/40 bg-accent/40">
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 py-4 px-4 items-center border-b border-border/20">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[90px] rounded-full" />
            <Skeleton className="h-5 w-[90px] rounded-full" />
            <div className="flex justify-end flex-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// City Card Grid Shimmer
function CityCardsShimmer() {
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
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface CityShimmerProps {
  viewMode?: 'table' | 'cards';
}

export function CityShimmer({ viewMode = 'table' }: CityShimmerProps) {
  return (
    <div className="space-y-6">
      <CityHeaderShimmer />
      <CityFiltersShimmer />

      <div className="glass rounded-2xl overflow-hidden border border-border/20 p-6">
        {viewMode === 'table' ? <CityTableShimmer /> : <CityCardsShimmer />}

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
