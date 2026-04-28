"use client";

import React from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/student/shared/ProgressBar";
import { Calendar, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

interface ClassCardProps {
  topicSlug: string;
  classSlug: string;
  index: number;
  classNameTitle: string;
  duration?: number;
  date?: string;
  totalQuestions: number;
  solvedQuestions: number;
  pdfUrl?: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  topicSlug,
  classSlug,
  index,
  classNameTitle,
  duration,
  date,
  totalQuestions,
  solvedQuestions,
  pdfUrl,
}) => {
  const progress =
    totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  const isCompleted = progress === 100 && totalQuestions > 0;

return (
  <Link
    href={`/topics/${topicSlug}/classes/${classSlug}`}
    className=" backdrop-blur-2xl flex border border-border/60 hover:border-primary/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-primary/5"
  >

    {/* LEFT NUMBER */}
    <div className="w-12 flex-shrink-0 flex items-center justify-center border-r border-border/50 bg-muted/20 group-hover:bg-primary/5 transition-all">
      <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        {index}
      </span>
    </div>

    {/* CONTENT */}
    <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">

      {/* 🔥 TITLE + RIGHT PROGRESS */}
      <div className="flex items-center justify-between gap-4">

        {/* TITLE */}
        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {classNameTitle}
        </h3>

         {/* NOTES */}
        {pdfUrl ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(pdfUrl, "_blank");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-2xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            View Notes
          </button>
        ) : (
          <div className="flex items-center text-xs gap-1.5 px-2 py-1 rounded-2xl bg-muted/40 border border-border/50 text-muted-foreground">
            <FileText className="w-3.5 h-3.5 opacity-70" />
            No notes
          </div>
        )}
      </div>

      {/* META ROW */}
      <div className="flex items-center justify-between text-[11px]">

        {/* DATE */}
        {date ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          <span />
        )}
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* PROGRESS BAR */}
          <div className="w-20 sm:w-24">
            <div className="h-2 bg-muted/30 border border-border/90 rounded-full overflow-hidden">
              <div
                className=" h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* COUNT */}
          <span className="text-[11px]  font-medium text-muted-foreground whitespace-nowrap">
            {solvedQuestions}/{totalQuestions}
          </span>

          

        </div>
       

      </div>

    </div>
  </Link>
);
};
