import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  loading?: boolean;
}

export function Pagination({ currentPage, totalItems, limit, onPageChange, onLimitChange, showLimitSelector = false, loading = false }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const [inputValue, setInputValue] = useState(String(limit));
  const [showErrorPopover, setShowErrorPopover] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const errorPopoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync input value with external limit prop
  useEffect(() => {
    setInputValue(String(limit));
  }, [limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input or numeric input only
    if (value === '' || /^\d+$/.test(value)) {
      // Prevent typing values > 100
      const numValue = parseInt(value);
      if (numValue > 100) {
        // Show error popover
        setShowErrorPopover(true);
        
        // Clear previous error timer
        if (errorPopoverTimerRef.current) {
          clearTimeout(errorPopoverTimerRef.current);
        }
        
        // Hide popover after 2 seconds
        errorPopoverTimerRef.current = setTimeout(() => {
          setShowErrorPopover(false);
        }, 2000);
        
        // Don't update inputValue (prevent typing > 100)
        return;
      }
      
      setInputValue(value);
      
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Debounce the limit change
      debounceTimerRef.current = setTimeout(() => {
        const parsedValue = parseInt(value);
        if (parsedValue >= 1 && parsedValue <= 100 && onLimitChange) {
          onLimitChange(parsedValue);
          onPageChange(1);
        } else if (value === '' && onLimitChange) {
          setInputValue('5');
          onLimitChange(5);
          onPageChange(1);
        }
      }, 500);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (errorPopoverTimerRef.current) {
        clearTimeout(errorPopoverTimerRef.current);
      }
    };
  }, []);

  if (totalItems === 0) {
    return null;
  }

  return (
  <div className="
    flex flex-col sm:flex-row sm:items-center justify-between px-3 py-3 sm:px-6 sm:py-4 backdrop-blur-md rounded-2xl glass gap-3
  ">

    {/* LEFT INFO */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-6 w-full sm:w-auto">
      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
        Showing{" "}
        <span className="px-1 text-foreground font-semibold">
          {(currentPage - 1) * limit + 1}
        </span>{" "}
        to {" "}
        <span className="px-1 text-foreground font-semibold">
          {Math.min(currentPage * limit, totalItems)}
        </span>{" "}
        of{" "}
        <span className="px-1 text-foreground font-semibold">
          {totalItems}
        </span>{" "}
        results
      </div>

      {showLimitSelector && onLimitChange && (
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
          <span className="text-muted-foreground font-medium">Show</span>

          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleInputChange}
              className="
                w-17.5 sm:w-22.5 h-8 sm:h-9! rounded-2xl bg-transparent!
                border border-border/40!
                hover:bg-accent/60
                transition
                text-center
                focus:ring-2 focus:ring-primary/20
              "
              placeholder="5"
            />

            <AnimatePresence>
              {showErrorPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-background text-xs rounded-2xl whitespace-nowrap z-50"
                >
                  Limit must be below 100
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-muted-foreground font-medium hidden sm:inline">
            per page
          </span>
        </div>
      )}
    </div>

    {/* RIGHT CONTROLS */}
    <div className="
      flex flex-wrap items-center justify-center sm:justify-start gap-1 px-2 py-2 sm:py-1 rounded-2xl
       border border-border/40 w-full sm:w-auto
    ">

      {/* PREV */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          h-8 w-8 rounded-2xl p-0
          text-muted-foreground

          hover:bg-accent
          hover:text-foreground

          disabled:opacity-40
        "
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* PAGES */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;

        // Show fewer pages on mobile (3) vs desktop (5)
        if (
          totalPages > 5 &&
          page !== 1 &&
          page !== totalPages &&
          (page < currentPage - 1 || page > currentPage + 1)
        ) {
          if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span
                key={page}
                className="px-2 text-muted-foreground text-xs sm:text-sm hidden sm:inline"
              >
                ...
              </span>
            );
          }
          return null;
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              h-8 min-w-[32px] px-2 rounded-full text-xs sm:text-sm font-medium
              transition-all duration-200

              ${
                isActive
                  ? `
                    bg-primary text-primary-foreground
                    shadow-[0_0_10px_var(--hover-glow)]
                  `
                  : `
                    text-muted-foreground
                    hover:text-foreground
                    hover:bg-accent
                  `
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          h-8 w-8 rounded-full p-0
          text-muted-foreground

          hover:bg-accent
          hover:text-foreground

          disabled:opacity-40
        "
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

    </div>
  </div>
);
}
