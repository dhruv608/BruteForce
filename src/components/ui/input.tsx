import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, onFocus, onBlur, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:border-border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      style={{
        height: 'var(--spacing-lg)',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'var(--foreground)',
        fontSize: 'var(--text-base)',
        padding: '16px 20px',
        outline: 'none',
        transition: 'all 0.2s ease',
      }}
      {...props}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(204, 255, 0, 0.2)';
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        onBlur?.(e);
      }}
    />
  )
}

export { Input }
