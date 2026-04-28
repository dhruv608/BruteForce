"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ClassDetailShimmer() {
   return (
      <div className="space-y-6">
         {/* Breadcrumb Skeleton */}
         <Skeleton className="h-4 w-32" />

         {/* Header Skeleton */}
         <div className="glass px-7 py-4 mb-7 rounded-2xl backdrop-blur-2xl flex items-center justify-between">
            <div className="space-y-2">
               <Skeleton className="h-8 w-64" />
               <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
         </div>

         {/* Filter Bar Skeleton */}
         <div className="glass backdrop-blur-2xl rounded-2xl mb-7 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
               <Skeleton className="h-10 w-64" />
               <Skeleton className="h-6 w-24" />
            </div>
         </div>

         {/* Table Skeleton */}
         <div className="px-6 mb-7 glass backdrop-blur-2xl shadow-sm rounded-2xl overflow-hidden">
            <div className="space-y-4 py-4">
               {/* Table Header */}
               <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20 ml-auto" />
               </div>
               {/* Table Rows */}
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                     <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-3 w-32" />
                     </div>
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-6 w-16" />
                     <Skeleton className="h-6 w-20" />
                     <div className="flex items-center justify-end gap-1 ml-auto">
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
