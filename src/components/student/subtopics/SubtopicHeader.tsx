"use client";

import React from "react";
import { ProgressBar } from "../shared/ProgressBar";
import { Topic } from '@/types/student/index.types';

interface SubtopicHeaderProps {
  topic: Topic;
  progress: number;
}

export function SubtopicHeader({ topic, progress }: SubtopicHeaderProps) {
  const hasImage = !!topic.photo_url;
return (
  <div className="mb-10  rounded-2xl glass bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl overflow-hidden">

    <div className="flex flex-col md:flex-row">

      {/* LEFT VISUAL */}
      <div className="relative md:w-[32%] h-[180px] border-e border-border/60 md:h-auto overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={topic.photo_url}
              alt={topic.topic_name}
              className="w-full h-full object-cover  "
            />

            {/* 🔥 overlay for better blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">

        {/* TOP */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 leading-tight">
            {topic.topic_name}
          </h1>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-5 border-t border-border/40">

          {/* 🔥 STATS CARDS */}
          <div className="flex items-center gap-4">

            {/* Classes */}
            <div className="px-4 py-2 rounded-2xl bg-background/40 border border-border/40">
              <p className="text-[10px] uppercase text-muted-foreground mb-1 tracking-wide">
                Classes
              </p>
              <p className="text-lg font-semibold">
                {topic.classes?.length || 0}
              </p>
            </div>

            {/* Questions */}
            <div className="px-4 py-2 rounded-2xl bg-background/40 border border-border/40">
              <p className="text-[10px] uppercase text-muted-foreground mb-1 tracking-wide">
                Questions
              </p>
              <p className="text-lg font-semibold">
                {topic.overallProgress?.totalQuestions || 0}
              </p>
            </div>

          </div>

          {/* 🔥 PROGRESS BLOCK */}
          <div className="flex-1 sm:ml-auto w-full sm:max-w-[260px]">

            <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
              <span className="uppercase tracking-wide">Progress</span>
              <span className="text-primary font-medium">
                {topic.overallProgress?.solvedQuestions || 0} /{" "}
                {topic.overallProgress?.totalQuestions || 0}
              </span>
            </div>

            <ProgressBar progress={progress} className="h-2 rounded-full" />

          </div>

        </div>
      </div>

    </div>
  </div>
);
}
