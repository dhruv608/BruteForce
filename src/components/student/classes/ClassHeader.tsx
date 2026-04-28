"use client";

import React, { useState } from "react";
import { Badge } from "../shared/Badge";
import { Calendar, Clock, FileText, ChevronDown } from "lucide-react";
import { ClassHeaderProps } from '@/types/student/index.types';

export function ClassHeader({
  classData,
  progress,
  solvedQuestions,
  totalQuestions,
  formattedDate,
}: ClassHeaderProps) {

  const [isOpen, setIsOpen] = useState(false);

  // Parse HTML description to extract bullet points
  const parseDescriptionToBullets = (html: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bullets: string[] = [];

    // Extract from <ul> or <ol> lists
    const lists = doc.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        const text = item.textContent?.trim();
        if (text) bullets.push(text);
      });
    });

    // If no lists found, extract from <p> tags
    if (bullets.length === 0) {
      const paragraphs = doc.querySelectorAll('p');
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text) bullets.push(text);
      });
    }

    // If still no bullets, split by line breaks
    if (bullets.length === 0) {
      const text = doc.body.textContent?.trim();
      if (text) {
        const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l);
        bullets.push(...lines);
      }
    }

    return bullets;
  };

  const descriptionBullets = classData.description ? parseDescriptionToBullets(classData.description) : [];
  const hasDescription = descriptionBullets.length > 0;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 glass backdrop-blur-3xl sm:p-6 shadow-sm">

      {/* TOP META ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4  py-2 px-1">

        {/* LEFT META */}
        <div className="flex flex-wrap items-center gap-3">
         

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
          )}

          {classData.duration_minutes && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              {classData.duration_minutes} min
            </div>
          )}
        </div>

        {/* RIGHT ACTION */}
        {classData.pdf_url ? (
          <a
            href={classData.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            View Notes
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-muted/50 text-muted-foreground cursor-not-allowed">
            <FileText className="w-4 h-4" />
            No Notes
          </div>
        )}
      </div>

      {/* TITLE + PROGRESS */}
      <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">

        <h1 className="text-2xl sm:text-2xl  lg:text-3xl font-bold text-foreground leading-tight">
          {classData.class_name}
        </h1>

        {/* PROGRESS */}
        <div className="w-full lg:w-[260px] border border-border/40 p-4 backdrop-blur-3xl rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {solvedQuestions}/{totalQuestions}
            </span>

            <span className="text-primary font-medium">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-muted/30 border border-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 🔽 ACCORDION */}
      {hasDescription && (
        <div className="mt-4 border border-border/40 rounded-2xl overflow-hidden">

          {/* HEADER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-primary hover:bg-muted/20 transition"
          >
            <span>View Description</span>

            <ChevronDown
              className={`w-4 h-4 text-primary transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* CONTENT */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-4 pb-4 pt-1">
              <ul className="space-y-2 text-muted-foreground text-sm max-w-3xl leading-relaxed list-disc list-inside">
                {descriptionBullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}