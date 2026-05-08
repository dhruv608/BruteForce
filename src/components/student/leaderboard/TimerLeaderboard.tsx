"use client";

import React, { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { SyncTime } from "@/lib/utils/cronUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface TimerLeaderboardProps {
  lastUpdated?: string;
  syncSchedule?: SyncTime[];
}

function getNextSync(schedule: SyncTime[]): Date | null {
  if (!schedule.length) return null;
  // Build an IST "now" by parsing the locale string
  const istNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const nowMins = istNow.getHours() * 60 + istNow.getMinutes();
  const laterToday = schedule.find(t => t.hour * 60 + t.minute > nowMins);
  const target = laterToday ?? schedule[0];
  const result = new Date(istNow);
  if (!laterToday) result.setDate(result.getDate() + 1);
  result.setHours(target.hour, target.minute, 0, 0);
  return result;
}

function formatCountdown(target: Date): string {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "syncing...";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTime(t: SyncTime): string {
  return new Date(2000, 0, 1, t.hour, t.minute).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const TimerLeaderboard: React.FC<TimerLeaderboardProps> = ({
  lastUpdated,
  syncSchedule = [],
}) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!syncSchedule.length) return;
    const tick = () => {
      const next = getNextSync(syncSchedule);
      if (next) setCountdown(formatCountdown(next));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [syncSchedule]);

  const formatLastUpdated = (): string => {
    if (!lastUpdated) return "";
    return new Date(lastUpdated).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scheduleLabel = syncSchedule.map(formatTime).join(" · ");

  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono">
      {/* Last updated */}
      <div className="relative group/lastupdated">
        <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 sm:px-3 sm:py-1.5 border border-border rounded-full shadow-sm cursor-default select-none">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="hidden sm:inline">Last updated at:</span>
          {lastUpdated
            ? <span className="font-bold text-primary">{formatLastUpdated()}</span>
            : <Skeleton className="h-3 w-24 sm:w-28 rounded-full" />
          }
        </div>

        {/* Tooltip */}
        {syncSchedule.length > 0 && (
          <div className="absolute right-0 top-full mt-1.5 z-50 invisible group-hover/lastupdated:visible opacity-0 group-hover/lastupdated:opacity-100 transition-opacity duration-150 pointer-events-none">
            <div className="bg-popover border border-border rounded-2xl px-3 py-2 shadow-lg whitespace-nowrap">
              <p className="text-[10px] text-muted-foreground mb-0.5">Updates daily at</p>
              <p className="text-[11px] font-medium text-foreground">{scheduleLabel}</p>
            </div>
          </div>
        )}
      </div>

      {/* Next sync countdown */}
      {syncSchedule.length > 0 && (
        <div className="relative group/nextsync">
          <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 sm:px-3 sm:py-1.5 border border-border rounded-full shadow-sm cursor-default select-none">
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="hidden sm:inline">Next:</span>
            {lastUpdated
              ? <span className="font-bold text-primary">{countdown}</span>
              : <Skeleton className="h-3 w-12 sm:w-14 rounded-full" />
            }
          </div>

          {/* Tooltip */}
          <div className="absolute right-0 top-full mt-1.5 z-50 invisible group-hover/nextsync:visible opacity-0 group-hover/nextsync:opacity-100 transition-opacity duration-150 pointer-events-none">
            <div className="bg-popover border border-border rounded-2xl px-3 py-2 shadow-lg whitespace-nowrap">
              <p className="text-[10px] text-muted-foreground mb-0.5">Updates daily at</p>
              <p className="text-[11px] font-medium text-foreground">{scheduleLabel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
