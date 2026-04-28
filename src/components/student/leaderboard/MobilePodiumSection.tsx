"use client";

import React from "react";
import { MobilePodiumCard } from "./MobilePodiumCard";
import { MobilePodiumShimmer } from "./MobilePodiumShimmer";
import { PodiumSectionProps } from "@/types/student/index.types";

export default function MobilePodiumSection({
  top3,
  loading,
  selectedCity,
}: PodiumSectionProps) {
  if (loading) return <MobilePodiumShimmer />;
  if (!top3 || top3.length === 0) return null;

  const isGlobalView = selectedCity === "all";

  const getRank = (student: any, index: number) =>
    isGlobalView
      ? student?.global_rank || index + 1
      : student?.city_rank || index + 1;

  return (
    <div className="w-full flex items-end justify-center gap-2 px-2 py-6">
      
      {/* 🥈 Rank 2 */}
      <div className="w-[30%] scale-95 opacity-90">
        <MobilePodiumCard
          student={top3?.[1]}
          rank={getRank(top3?.[1], 1)}
        />
      </div>

      {/* 🏆 Rank 1 (Center Highlight) */}
      <div className="w-[36%] scale-105 z-10">
        <MobilePodiumCard
          student={top3?.[0]}
          rank={getRank(top3?.[0], 0)}
        />
      </div>

      {/* 🥉 Rank 3 */}
      <div className="w-[30%] scale-95 opacity-90">
        <MobilePodiumCard
          student={top3?.[2]}
          rank={getRank(top3?.[2], 2)}
        />
      </div>

    </div>
  );
}