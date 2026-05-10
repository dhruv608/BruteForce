import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [goToValue, setGoToValue] = useState('');
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

  const handleGoToPage = () => {
    const page = parseInt(goToValue);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToValue('');
    }
  };

  const handleGoToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage();
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

  // Hide pagination entirely when total items is 0
  if (totalItems === 0) {
    return null;
  }

  // Generate smart page numbers with ellipsis
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start: 1 2 3 4 ... last
        pages.push(2, 3, 4);
        pages.push('ellipsis-end');
      } else if (currentPage >= totalPages - 2) {
        // Near the end: 1 ... n-3 n-2 n-1 n
        pages.push('ellipsis-start');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // In the middle: 1 ... prev curr next ... last
        pages.push('ellipsis-start');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md rounded-2xl glass gap-3">

      {/* LEFT INFO */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-5 w-full sm:w-auto">
        <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">
          <span className="text-foreground font-semibold">
            {(currentPage - 1) * limit + 1}
          </span>
          {" – "}
          <span className="text-foreground font-semibold">
            {Math.min(currentPage * limit, totalItems)}
          </span>
          {" of "}
          <span className="text-foreground font-semibold">
            {totalItems}
          </span>
        </div>

        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-muted-foreground font-medium">Show</span>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={handleInputChange}
                className="
                  w-12 sm:w-14 h-7 sm:h-8 rounded-2xl bg-transparent
                  border border-border/40 outline-none
                  hover:bg-accent/60
                  transition text-foreground
                  text-center text-xs
                  focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                "
                placeholder="10"
              />

              <AnimatePresence>
                {showErrorPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-background text-[10px] rounded-2xl whitespace-nowrap z-50"
                  >
                    Max 100
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

      {/* RIGHT CONTROLS - Only show if there's more than 1 page */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end rounded-2xl">

          {/* PAGE BUTTONS */}
          <div className="flex items-center gap-0.5 px-1 py-1 rounded-2xl border border-border/40">

            {/* FIRST PAGE (desktop only, shown when pages > 7) */}
            {totalPages > 7 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="h-7 w-7 rounded-2xl p-0 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 hidden sm:flex"
                title="First page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* PREV */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-2xl p-0 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            {/* PAGE NUMBERS */}
            {pageNumbers.map((item, idx) => {
              if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                return (
                  <span
                    key={item}
                    className="px-1 text-muted-foreground text-[11px] sm:text-xs select-none"
                  >
                    ···
                  </span>
                );
              }

              const isActive = item === currentPage;

              return (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={`
                    h-7 min-w-[28px] px-1.5 rounded-2xl text-[11px] sm:text-xs font-medium
                    transition-all duration-200

                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-[0_0_8px_var(--hover-glow)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}

            {/* NEXT */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-7 rounded-2xl p-0 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>

            {/* LAST PAGE (desktop only, shown when pages > 7) */}
            {totalPages > 7 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-7 w-7 rounded-2xl p-0 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 hidden sm:flex"
                title="Last page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* GO TO PAGE — shown only when totalPages > 10 */}
          {totalPages > 10 && (
            <div className="flex items-center gap-1 ml-1">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium hidden sm:inline">
                Go to
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={goToValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+$/.test(val)) {
                    setGoToValue(val);
                  }
                }}
                onKeyDown={handleGoToKeyDown}
                placeholder="4"
                className="
                  w-10 sm:w-12 h-7 sm:h-8 rounded-2xl bg-transparent
                  border border-border/40 outline-none
                  hover:bg-accent/60 text-foreground
                  transition
                  text-center text-[11px] sm:text-xs
                  focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                "
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToPage}
                disabled={!goToValue || parseInt(goToValue) < 1 || parseInt(goToValue) > totalPages}
                className="h-7 w-7 rounded-2xl p-0 text-muted-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-30 transition-colors"
                title="Go to page"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
