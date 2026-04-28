"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TimerLeaderboardProps {
  lastUpdated?: string;
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
}

export const TimerLeaderboard: React.FC<TimerLeaderboardProps> = ({ lastUpdated, refreshInterval, onRefresh }) => {
  // Format last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return "";

    return new Date(lastUpdated).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono">
      {/* Last updated info */}
      <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 sm:px-3 sm:py-1.5 border border-border rounded-full shadow-sm">
        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="hidden sm:inline">Last updated:</span>
        <span className="font-bold text-primary">
          {formatLastUpdated()}
        </span>
      </div>
    </div>
  );
};
