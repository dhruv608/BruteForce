"use client";

import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClassHeaderProps {
   selectedBatch: any;
   topicSlug: string;
   topicDetails?: { topic_name: string; photo_url?: string; description?: string } | null;
   onAddClick: () => void;
}

export default function ClassHeader({ selectedBatch, topicSlug, topicDetails, onAddClick }: ClassHeaderProps) {
return (
  <>
    {/* Back */}
    <div className="flex items-center mb-4 gap-3 text-muted-foreground">
      <Link
        href="/admin/topics"
        className="hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Topics
      </Link>
    </div>

    {/* Card */}
    <div className="glass backdrop-blur-2xl mb-5 rounded-2xl p-5">

      <div className="flex items-center justify-between gap-4">

        {/* LEFT SIDE (Image + Title) */}
        <div className="flex items-center gap-4 min-w-0">

          {/* Image */}
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/40 shrink-0">
            {topicDetails?.photo_url ? (
              <img
                src={topicDetails.photo_url}
                alt={topicDetails.topic_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-foreground ">
            {topicDetails?.topic_name }
          </h2>

        </div>

        {/* RIGHT BUTTON */}
        <Button
          onClick={onAddClick}
          className="gap-2 h-10 px-4 rounded-xl shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </Button>

      </div>
    </div>
  </>
);
}
