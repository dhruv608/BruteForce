"use client";

import React from "react";

export function MobilePodiumShimmer() {
  return (
    <div className="w-full flex items-end justify-center gap-2 px-2 py-6">
      
      {/* 🥈 Rank 2 Shimmer */}
      <div className="w-[30%] scale-95 opacity-90">
        <div className="glass rounded-2xl px-3 py-4 w-full text-center border border-border/50 shadow-xl">
          
          {/* Crown Shimmer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-muted/50 rounded-full animate-pulse" />
          
          {/* Avatar Shimmer */}
          <div className="relative mb-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-70 bg-muted/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full border-2 border-border/50 bg-muted/30 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-8 h-5 bg-muted/50 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Name Shimmer */}
          <div className="h-4 w-20 bg-muted/50 rounded-lg mx-auto mb-1 animate-pulse" />
          
          {/* Username Shimmer */}
          <div className="h-3 w-16 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
          
          {/* City Shimmer */}
          <div className="h-2 w-14 bg-muted/30 rounded mx-auto mb-2 animate-pulse" />
          
          {/* Score Shimmer */}
          <div className="rounded-2xl border border-border py-2 bg-muted/20">
            <div className="h-2 w-8 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
            <div className="h-4 w-10 bg-muted/50 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* 🏆 Rank 1 (Center Highlight) Shimmer */}
      <div className="w-[36%] scale-105 z-10">
        <div className="glass rounded-2xl px-3 py-4 w-full text-center border border-border/50 shadow-xl">
          
          {/* Crown Shimmer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-muted/50 rounded-full animate-pulse" />
          
          {/* Avatar Shimmer */}
          <div className="relative mb-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-70 bg-muted/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full border-2 border-border/50 bg-muted/30 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-8 h-5 bg-muted/50 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Name Shimmer */}
          <div className="h-4 w-20 bg-muted/50 rounded-lg mx-auto mb-1 animate-pulse" />
          
          {/* Username Shimmer */}
          <div className="h-3 w-16 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
          
          {/* City Shimmer */}
          <div className="h-2 w-14 bg-muted/30 rounded mx-auto mb-2 animate-pulse" />
          
          {/* Score Shimmer */}
          <div className="rounded-2xl border border-border py-2 bg-muted/20">
            <div className="h-2 w-8 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
            <div className="h-4 w-10 bg-muted/50 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* 🥉 Rank 3 Shimmer */}
      <div className="w-[30%] scale-95 opacity-90">
        <div className="glass rounded-2xl px-3 py-4 w-full text-center border border-border/50 shadow-xl">
          
          {/* Crown Shimmer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-muted/50 rounded-full animate-pulse" />
          
          {/* Avatar Shimmer */}
          <div className="relative mb-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-70 bg-muted/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full border-2 border-border/50 bg-muted/30 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-8 h-5 bg-muted/50 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Name Shimmer */}
          <div className="h-4 w-20 bg-muted/50 rounded-lg mx-auto mb-1 animate-pulse" />
          
          {/* Username Shimmer */}
          <div className="h-3 w-16 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
          
          {/* City Shimmer */}
          <div className="h-2 w-14 bg-muted/30 rounded mx-auto mb-2 animate-pulse" />
          
          {/* Score Shimmer */}
          <div className="rounded-2xl border border-border py-2 bg-muted/20">
            <div className="h-2 w-8 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
            <div className="h-4 w-10 bg-muted/50 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>

    </div>
  );
}
