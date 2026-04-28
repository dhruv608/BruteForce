"use client";

import React, { useState } from 'react';
import { ExternalLink, Edit2, Trash2, Loader2, ChevronDown } from 'lucide-react';
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
    <div className={`flex flex-col rounded-2xl border px-6 py-5 transition-all duration-300 ${bookmark.isSolved
        ? 'bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
        : 'border-border/60 hover:border-primary/30'
      }`}>
      {/* FLEX ROW FOR LEFT AND RIGHT */}
      <div className="flex justify-between items-start">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-3 flex-1">

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
          <div className="flex items-center gap-3 flex-wrap text-[11px]">

            {/* LEVEL */}
            <span
              className={`px-3 py-1 rounded-2xl border font-semibold ${getLevelColor(
                bookmark.question.level
              )}`}
            >
              {bookmark.question.level}
            </span>

            {/* PLATFORM */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-2xl border border-border bg-muted text-muted-foreground font-medium">
              {platformData.icon}
              {platformData.name}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-3 ml-6">

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(bookmark)}
              disabled={updatingBookmark}
              className="rounded-2xl px-3"
            >
              {updatingBookmark ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(bookmark)}
              className="rounded-2xl px-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* DATE */}
          <div className="text-xs px-3 py-1.5 rounded-2xl border border-border bg-muted text-muted-foreground">
            Bookmarked on{" "}
            {new Date(bookmark.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* DESCRIPTION (optional) - Outside flex, on next line */}
      {hasDescription && (
        <div className="mt-4 border border-border backdrop-blur-2xl rounded-2xl overflow-hidden">
          {/* HEADER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-primary hover:bg-muted/20 transition"
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
              <ul className="space-y-2 text-muted-foreground text-xs leading-relaxed list-disc list-inside">
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
