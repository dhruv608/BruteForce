"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookmarkFilterProps {
  sortBy: 'recent' | 'old';
  setSortBy: (value: 'recent' | 'old') => void;
  filterBy: 'all' | 'solved' | 'unsolved';
  setFilterBy: (value: 'all' | 'solved' | 'unsolved') => void;
}

export function BookmarkFilter({ sortBy, setSortBy, filterBy, setFilterBy }: BookmarkFilterProps) {
  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-6">

        <div className="flex items-center gap-3">
          <label className="text-m font-medium text-foreground">Sort By:</label>
          <Select value={sortBy} onValueChange={(v: 'recent' | 'old') => setSortBy(v)}>
            <SelectTrigger className="w-35 bg-transparent border border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="old">Old</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-m font-medium text-foreground">Filter By:</label>
          <Select value={filterBy} onValueChange={(v: 'all' | 'solved' | 'unsolved') => setFilterBy(v)}>
            <SelectTrigger className="w-35 bg-transparent border border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
}
