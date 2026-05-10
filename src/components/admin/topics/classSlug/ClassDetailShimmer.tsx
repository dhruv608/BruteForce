"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ClassDetailShimmer() {
   return (
      <div className="space-y-6">
         {/* Breadcrumb Skeleton */}
         <Skeleton className="h-4 w-32" />

         {/* Header Skeleton */}
         <div className="mb-6 rounded-2xl bg-linear-to-br from-background/80 to-background/40 glass backdrop-blur-3xl sm:p-6 shadow-sm">
            {/* TOP META ROW */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-1">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/10">
                     <Skeleton className="h-4 w-4" />
                     <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/10">
                     <Skeleton className="h-4 w-4" />
                     <Skeleton className="h-3 w-16" />
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-24 rounded-2xl" />
                  <Skeleton className="h-10 w-36 rounded-xl" />
               </div>
            </div>

            {/* TITLE & DESCRIPTION BUTTON */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-3">
               <Skeleton className="h-8 w-[250px]" />
               <Skeleton className="h-8 w-[130px] rounded-full" />
            </div>
         </div>

         {/* Filter Bar Skeleton */}
         <div className="glass backdrop-blur-2xl rounded-2xl mb-7 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
               <Skeleton className="h-10 w-64" />
               <Skeleton className="h-6 w-24" />
            </div>
         </div>

         {/* Table Skeleton */}
         <div className="p-2 mb-5 glass bg-linear-to-br from-background/80 to-background/40 backdrop-blur-3xl shadow-sm rounded-2xl overflow-hidden">
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
