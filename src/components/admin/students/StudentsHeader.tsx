"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface StudentsHeaderProps {
  totalRecords: number;
  selectedBatch: { name: string } | null;
}

export default function StudentsHeader({ totalRecords, selectedBatch }: StudentsHeaderProps) {
  return (
    <div className="glass backdrop-blur-2xl mb-5 -mt-3 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
       

        <div>
          <h1 className="text-3xl font-semibold">Student<span className="text-primary ms-1">Management</span> </h1>
          <p className="p-0 m-0 mt-1 text-sm text-muted-foreground" >Manage students, monitor progress, and handle bulk operations seamlessly.</p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mt-3 sm:mt-0 w-full sm:w-auto text-center sm:text-left">
        {totalRecords} Students
      </div>
    </div>
  );
}
