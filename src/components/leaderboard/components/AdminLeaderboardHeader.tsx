"use client";

import React from 'react';
import { Search, MapPin, CalendarDays, RefreshCw } from 'lucide-react';
import { EvaluationModal } from '@/components/student/leaderboard/EvaluationModal';
import { TimerLeaderboard } from './TimerLeaderboard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';

interface SelectOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  lSearch: string;
  setLSearch: (value: string) => void;
  lCity: string;
  setLCity: (value: string) => void;
  cityOptionsObj: SelectOption[];
  setLYear: (value: number) => void;
  lYear: number | undefined;
  yearOptionsObj: SelectOption[];
  allYears: number[];
  mode?: 'admin' | 'student';
  isLoading?: boolean;
}

interface AdminLeaderboardHeaderProps extends FilterBarProps {
  lastCalculated?: string | null;
  onRefresh: () => Promise<void>;
  onResetPodium?: () => void;
}

export function AdminLeaderboardHeader({ 
  lastCalculated, 
  onRefresh,
  lSearch, setLSearch, 
  lCity, setLCity, cityOptionsObj, setLYear,
  lYear, yearOptionsObj, allYears,
  mode = 'admin',
  isLoading = false,
  onResetPodium
}: AdminLeaderboardHeaderProps) {
  return (
    <div className="glass backdrop-blur-sm rounded-2xl px-4 py-3 mb-4 relative z-10">

      {/* 🔥 ROW 1 → TITLE + TIMER */}
      <div className="flex items-center justify-between gap-2 mb-1">

        {/* LEFT */}
        <div className="flex items-center gap-2 flex-wrap">

          <h2 className="text-sm sm:text-2xl font-semibold text-foreground whitespace-nowrap">
            Admin
            <span className="ms-1 text-primary">Leaderboard</span>
          </h2>

          <EvaluationModal />
        </div>

        {/* RIGHT */}
        <TimerLeaderboard
          lastUpdated={lastCalculated ?? undefined}
          refreshInterval={4}
          onRefresh={onRefresh}
        />
      </div>



      {/* 🔥 ROW 2 → SEARCH + RESET + FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        {/* LEFT → SEARCH + RESET */}
        <div className="flex items-center gap-2 w-full sm:w-auto">

          {/* Search */}
          <div className="relative w-full sm:w-[260px] md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground" />

            <Input
              placeholder="Search by name and username..."
              value={lSearch}
              onChange={(e) => setLSearch(e.target.value)}
              className="!pl-8 w-full h-8 text-xs sm:text-sm"
            />
          </div>

          {/* Reset */}
          {onResetPodium && (
            <button
              onClick={onResetPodium}
              className="flex items-center gap-1 px-2 py-1.5 h-8 text-xs sm:text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md border border-primary/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* RIGHT → FILTERS */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end relative z-20">

          <Select
            value={lCity}
            onChange={(v: string | number) => setLCity(String(v))}
            options={cityOptionsObj}
            className="w-auto h-8 text-xs sm:text-sm border border-border/40"
            icon={<MapPin className="w-3 h-3" />}
            placeholder="City"
          />

          <Select
            value={lYear?.toString() || ''}
            onChange={(v: string | number) => setLYear(Number(v))}
            options={yearOptionsObj}
            className="w-auto h-8 text-xs sm:text-sm border border-border/40"
            icon={<CalendarDays className="w-3 h-3" />}
            placeholder="Year"
            disabled={!allYears || allYears.length === 0}
          />
        </div>
      </div>

      {/* Optional */}
      {!isLoading && (!allYears || allYears.length === 0) && (
        <p className="text-[10px] text-muted-foreground mt-1">
          No years available
        </p>
      )}
    </div>
  );
}
