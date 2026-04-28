"use client";

import { Users } from 'lucide-react';

interface AdminHeaderProps {
  totalAdmins?: number;
}
export function AdminHeader({ totalAdmins }: AdminHeaderProps) {
return (
  <div className="
    glass hover-glow
    rounded-2xl p-5 mb-8
    
    relative overflow-hidden 
    
  ">

    {/* ✨ Ambient Glow */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
    </div>

    <div className="flex items-center justify-between relative z-10 p-2">
      
      {/* 🔹 LEFT */}
      <div className="flex items-center gap-4">


        {/* Text */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Admin <span className='text-primary'>Management</span>
          </h2>
          <p className="text-xs p-0 m-0 sm:text-sm text-muted-foreground mt-1">
            Create and manage administrators, assign cities and batches.
          </p>
        </div>
      </div>

      {/* 🔸 RIGHT (UPGRADED BADGE) */}
      {totalAdmins !== undefined && (
        <div className="
          inline-flex items-center gap-1.5
          text-xs font-semibold tracking-wide
          px-3 py-1.5 rounded-full
          bg-primary/10 text-primary
          border border-primary/20
          shadow-[0_0_10px_var(--hover-glow)]
        ">
          <Users className="w-3 h-3" />
          {totalAdmins} Admin{totalAdmins !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  </div>
);
}
