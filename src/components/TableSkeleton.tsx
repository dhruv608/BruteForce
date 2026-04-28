import React from 'react';

interface TableSkeletonProps {
  row: React.ReactNode;
  count?: number;
}

export function TableSkeleton({ row, count = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => 
        React.cloneElement(row as React.ReactElement, { key: i })
      )}
    </>
  );
}
