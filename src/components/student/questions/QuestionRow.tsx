import React, { useState } from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeetCodeIcon, GeeksforGeeksIcon } from '../../platform/PlatformIcons';
import { QuestionRowProps } from '@/types/student/admin.types';

export const QuestionRow = ({
  questionName,
  platform,
  level,
  type,
  isSolved,
  link,
  topicName,
  questionId,
  isBookmarked = false,
  onBookmarkClick
}: QuestionRowProps) => {

  const isHomework = type === 'HOMEWORK';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (questionId && onBookmarkClick) {
      onBookmarkClick(questionId, {
        id: questionId.toString(),
        question_name: questionName,
        platform,
        level,
        type
      });
    }
  };

  const getLevelColor = (l: string) => {
    switch (l.toUpperCase()) {
      case 'EASY':
        return 'text-[var(--easy)] bg-[var(--easy)]/10 border-[var(--easy)]/20';
      case 'MEDIUM':
        return 'text-[var(--medium)] bg-[var(--medium)]/10 border-[var(--medium)]/20';
      case 'HARD':
        return 'text-[var(--hard)] bg-[var(--hard)]/10 border-[var(--hard)]/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPlatformData = (p: string) => {
    if (!p) return null;

    if (p.toLowerCase().includes('leetcode')) {
      return {
        name: 'LeetCode',
        icon: <LeetCodeIcon className="w-3.5 h-3.5 text-leetcode" />
      };
    }

    if (p.toLowerCase().includes('gfg')) {
      return {
        name: 'GeeksForGeeks',
        icon: <GeeksforGeeksIcon className="w-3.5 h-3.5 text-gfg" />
      };
    }

    return {
      name: p,
      icon: null
    };
  };

  const platformData = getPlatformData(platform);
  const [showPopover, setShowPopover] = useState(false);

 return (
  <div
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
    px-4 py-3 rounded-2xl border transition-all duration-300

    ${isSolved
        ? 'bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
        : 'backdrop-blur-sm border-border/60 hover:border-border hover:bg-accent/40'
      }`}
  >

    {/* LEFT */}
    <div className="flex flex-col gap-1 min-w-0 flex-1">

      {/* TITLE */}
      <h4 className="text-sm font-semibold text-foreground truncate">
        {questionName}
      </h4>

      {/* TOPIC */}
      {topicName && (
        <p className="text-xs text-muted-foreground truncate">
          {topicName}
        </p>
      )}

      {/* META */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">

        {/* LEVEL */}
        <span className={`px-2 py-0.5 rounded-full border font-semibold ${getLevelColor(level)}`}>
          {level}
        </span>

        {/* PLATFORM */}
        {platformData && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">
            {platformData.icon}
            <span className="truncate">{platformData.name}</span>
          </span>
        )}

        {/* TYPE */}
        <span className="px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
          {isHomework ? 'HOMEWORK' : 'CLASSWORK'}
        </span>

      </div>
    </div>

    {/* RIGHT */}
    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">

      {/* BOOKMARK */}
      {questionId && (
        isBookmarked ? (
          <div
            className="relative cursor-not-allowed"
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
          >
            <span className={`flex items-center justify-center h-9 w-9 rounded-2xl border border-border
              ${isSolved ? 'bg-emerald-500/30 text-white cursor-not-allowed pointer-events-none opacity-70' : 'bg-muted text-foreground'}`}>
              <Bookmark className="w-4 h-4 fill-current" />
            </span>

            <AnimatePresence>
              {showPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded-2xl whitespace-nowrap z-50"
                >
                  Already bookmarked
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={handleBookmarkClick}
            className={`flex items-center justify-center h-9 w-9 rounded-2xl border border-border transition
              ${isSolved
                ? 'bg-emerald-500/30 text-white hover:bg-emerald-500/40'
                : 'bg-muted text-foreground hover:bg-accent/50'
              }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )
      )}

      {/* CTA BUTTON */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 h-9 px-4 rounded-2xl text-xs font-medium transition whitespace-nowrap
            ${isSolved
              ? 'bg-emerald-500/20 text-white'
              : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
        >
          {isSolved ? 'View' : 'Solve'}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>

  </div>
);
};