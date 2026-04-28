"use client";

import React from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export function BookmarkHeader() {
  return (
    <div className="mb-8 px-5 py-4 backdrop-blur-sm rounded-2xl glass">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-foreground">
          My <span className='text-primary'>Bookmarks</span>
        </h1>
      </div>
      <p className="text-muted-foreground ">
        Your saved questions for practice
      </p>
    </div>
  );
}
