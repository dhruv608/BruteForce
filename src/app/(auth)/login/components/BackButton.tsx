"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../shared/components/Button';

export function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) onClick();
    else router.back();
  };

  return (
  <Button
  type="button"
  onClick={handleClick}
  variant="outline"
  className="
    flex-1 h-11 text-[14px] font-semibold tracking-wide

    border border-border
    bg-transparent

    text-muted-foreground
    hover:text-foreground

    backdrop-blur-md

    hover:bg-accent/40
    hover:border-primary/40

    hover:shadow-[0_0_15px_var(--hover-glow)]
    hover:-translate-y-[1px]

    active:scale-[0.97]

    transition-all duration-200
  "
>
  ← Back
</Button>
  );
}
