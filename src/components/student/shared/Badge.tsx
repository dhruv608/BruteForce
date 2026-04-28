import React from 'react';

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'solved' | 'unsolved' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    easy: 'bg-[var(--easy)]/10 text-[var(--easy)] border-[var(--easy)]/20',
    medium: 'bg-[var(--medium)]/10 text-[var(--medium)] border-[var(--medium)]/20',
    hard: 'bg-[var(--hard)]/10 text-[var(--hard)] border-[var(--hard)]/20',
    solved: 'bg-[var(--easy)]/10 text-[var(--easy)] border-[var(--easy)]/20',
    unsolved: 'bg-secondary text-muted-foreground border-border',
    default: 'bg-primary/10 text-primary border-primary/20',
  };

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wide border';

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
