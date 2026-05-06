"use client";

import React, { useState } from 'react';
import { ExternalLink, Edit2, Trash2, Loader2, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HTMLRenderer } from '@/components/ui/HTMLRenderer';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { Bookmark } from '@/types/student/index.types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  updatingBookmark: boolean;
}

export function BookmarkCard({ bookmark, onEdit, onDelete, updatingBookmark }: BookmarkCardProps) {
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

  const descriptionBullets = bookmark.description ? parseDescriptionToBullets(bookmark.description) : [];
  const hasDescription = descriptionBullets.length > 0;

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-easy bg-easy/10 border-easy/20';
      case 'MEDIUM': return 'text-medium bg-medium/10 border-medium/20';
      case 'HARD': return 'text-hard bg-hard/10 border-hard/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const platform = bookmark.question.platform?.toLowerCase();

  const platformData =
    platform?.includes("leetcode")
      ? { name: "LeetCode", icon: <LeetCodeIcon className="w-3.5 h-3.5 text-orange-500" /> }
      : platform?.includes("gfg")
        ? { name: "GeeksForGeeks", icon: <GeeksforGeeksIcon className="w-3.5 h-3.5 text-green-500" /> }
        : { name: bookmark.question.platform, icon: null };

  return (
    <div className={`flex flex-col rounded-2xl border px-5 py-3 transition-all duration-300 ${bookmark.isSolved
        ? 'bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
        : 'border-border/60 hover:border-primary/30'
      }`}>
      {/* TOP SECTION */}
      <div className="flex justify-between items-start gap-4">
        {/* LEFT: title + badges */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* TITLE + LINK */}
          <div
            className="flex items-center gap-2 cursor-pointer group w-fit"
            onClick={() => {
              if (bookmark.question.question_link) {
                window.open(bookmark.question.question_link, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition">
              {bookmark.question.question_name}
            </h3>
            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />
          </div>

          {/* BADGES */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span
              className={`px-3 py-1 rounded-2xl border font-semibold ${getLevelColor(
                bookmark.question.level
              )}`}
            >
              {bookmark.question.level}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-2xl border border-border bg-muted text-muted-foreground font-medium">
              {platformData.icon}
              {platformData.name}
            </span>
          </div>
        </div>

        {/* RIGHT: date + icon actions, then view-description toggle */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <Calendar className="w-3 h-3" />
              {new Date(bookmark.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(bookmark)}
                disabled={updatingBookmark}
                className="rounded-full h-7 w-7"
                aria-label="Edit bookmark"
              >
                {updatingBookmark ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Edit2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(bookmark)}
                className="rounded-full h-7 w-7 text-destructive hover:bg-destructive/10"
                aria-label="Delete bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {hasDescription && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-foreground px-3 py-1 rounded-2xl border border-border hover:bg-muted/40 transition"
            >
              <span>View Description</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* DESCRIPTION CONTENT (full-width, below) */}
      {hasDescription && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-3 rounded-2xl border border-border bg-muted/20">
            <ul className="space-y-2 text-muted-foreground text-xs leading-relaxed list-disc list-inside">
              {descriptionBullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
