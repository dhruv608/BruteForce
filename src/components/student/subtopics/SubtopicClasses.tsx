"use client";

import React from 'react';
import { ClassCard } from '../classes/ClassCard';
import { Topic, Class } from '@/types/student/index.types';

interface SubtopicClassesProps {
  topic: Topic & { classes?: Class[] };
}

export function SubtopicClasses({ topic }: SubtopicClassesProps) {
return (
  <div className="mt-6 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl p-5 sm:p-6">

    {/* HEADER */}
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-widest uppercase">
        Classes
      </h2>

      <div className="flex-1 h-[1px] bg-border/60" />

      {/* COUNT BADGE */}
      <span className="text-xs px-2.5 py-1 rounded-2xl bg-primary/10 text-primary border border-primary/20">
        {topic.classes?.length || 0}
      </span>
    </div>

    {/* LIST */}
    <div className="flex flex-col gap-3">

      {(topic.classes?.length ?? 0) > 0 ? (
        topic.classes!.map((cls: Class, idx: number) => (
          <div
            key={cls.slug}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDelay: `${idx * 40}ms`,
              animationFillMode: 'both'
            }}
          >
            <ClassCard
              topicSlug={topic.slug}
              classSlug={cls.slug}
              index={idx}
              classNameTitle={cls.class_name}
              date={cls.date || cls.class_date || cls.classDate}
              totalQuestions={cls.total_questions || cls.totalQuestions || 0}
              solvedQuestions={cls.solved_questions || cls.solvedQuestions || 0}
              pdfUrl={cls.pdf_url}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border border-dashed border-border/50 bg-background/30">
          <div className="text-sm text-muted-foreground mb-1">
            No classes available
          </div>
          <div className="text-xs text-muted-foreground/70">
            Classes will appear here once assigned.
          </div>
        </div>
      )}

    </div>
  </div>
);
}
