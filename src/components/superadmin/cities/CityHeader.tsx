"use client";

import { Building2 } from 'lucide-react';

interface CityHeaderProps {
  totalCities?: number;
}


export function CityHeader({ totalCities }: CityHeaderProps) {
  return (
    <div className="
      glass hover-glow
      rounded-2xl p-5 mb-8
      relative overflow-hidden
      
    ">

      {/* ✨ Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-2/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-2/10 blur-3xl rounded-full"></div>
      </div>

      <div className="flex items-center justify-between relative z-10">

        {/* 🔹 LEFT */}
        <div className="flex items-center gap-4">

          {/* Text */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              City <span className='text-primary' >Management</span>
            </h2>
            <p className="text-xs p-0 m-0 sm:text-sm text-muted-foreground mt-1">
              Manage cities and their associated batches.
            </p>
          </div>
        </div>

        {/* 🔸 RIGHT (COUNT BADGE) */}
        {totalCities !== undefined && (
          <div className="
            px-4 py-2
            rounded-full
            text-xs font-semibold tracking-wide
            bg-primary/10 text-primary
            border border-primary/20
            shadow-[0_0_10px_var(--hover-glow)]
          ">
            {totalCities} cit{totalCities !== 1 ? "ies" : "y"}
          </div>
        )}
      </div>
    </div>
  );
}
