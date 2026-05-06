import React from 'react';
import { Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableShimmer() {
  return (
    <div className="flex-1 px-3 glass mb-5 backdrop-blur-2xl rounded-2xl overflow-auto">
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold px-4">Student</TableHead>
            <TableHead className="text-center font-bold">Rank</TableHead>
            <TableHead className="font-bold">Location</TableHead>
            <TableHead className="font-bold text-center">Score</TableHead>
            <TableHead className="font-bold text-center">Max Streak</TableHead>
            <TableHead className="font-bold text-center">Solved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow
              key={i}
              className="cursor-default animate-in fade-in slide-in-from-bottom-2 [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              {/* Student (avatar + name + username) */}
              <TableCell>
                <div className="flex flex-row items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex flex-col">
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>

              {/* Rank */}
              <TableCell className="text-center">
                <Skeleton className="h-5 w-10 mx-auto" />
              </TableCell>

              {/* Location */}
              <TableCell>
                <div className="flex flex-col gap-0.5 items-start">
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
              </TableCell>

              {/* Score */}
              <TableCell className="text-center">
                <Skeleton className="h-6 w-20 mx-auto" />
              </TableCell>

              {/* Max Streak */}
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <div className="px-2.5 py-1 rounded-full bg-muted/40 w-12 h-6 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                </div>
              </TableCell>

              {/* Solved */}
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-4 w-10" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
