"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuestionsHeaderProps {
  totalRecords: number;
}

export default function QuestionsHeader({ totalRecords }: QuestionsHeaderProps) {
  return (
    <div className="glass rounded-2xl p-6 mb-5 -mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        
        <div>
          <h2 className="text-3xl font-semibold">
            Question <span className='text-primary'>Bank</span>
          </h2>
          <p className='m-0 p-0 mt-1 text-sm text-muted-foreground ' >Add and manage questions globally across topics with support for bulk operations.</p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mt-3 sm:mt-0 w-full sm:w-auto text-center sm:text-left">
        {totalRecords} Questions
      </div>
    </div>
  );
}
