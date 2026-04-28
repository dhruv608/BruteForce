"use client";

import { Layers } from "lucide-react";

export default function QuickAction() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <Layers className="w-10 h-10 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold">No Batch Selected</h2>
      <p className="text-muted-foreground">
        Select batch from top to view stats
      </p>
    </div>
  );
}
