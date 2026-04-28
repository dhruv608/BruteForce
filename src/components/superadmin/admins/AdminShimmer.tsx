"use client";

import { Skeleton } from "@/components/ui/skeleton";

// Admin Header Shimmer
function AdminHeaderShimmer() {
  return (
    <div className="glass hover-glow rounded-2xl p-5 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10 p-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

// Admin Filters Shimmer
function AdminFiltersShimmer() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-2xl" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Admin Table Shimmer
function AdminTableShimmer() {
  return (
    <div className="hover-glow rounded-2xl px-3 border border-border/30 overflow-hidden relative">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex gap-4 py-3 border-b border-border/40 bg-accent/40">
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 py-4 items-center border-b border-border/20">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-5 w-[70px] rounded-full" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
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

// Admin Card Grid Shimmer
function AdminCardsShimmer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass rounded-2xl p-5 border border-border/30 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface AdminShimmerProps {
  viewMode?: 'table' | 'cards';
}

export function AdminShimmer({ viewMode = 'table' }: AdminShimmerProps) {
  return (
    <div className="space-y-6">
      <AdminHeaderShimmer />
      <AdminFiltersShimmer />

      <div className="glass rounded-2xl overflow-hidden border border-border/20 p-6">
        {viewMode === 'table' ? <AdminTableShimmer /> : <AdminCardsShimmer />}

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
