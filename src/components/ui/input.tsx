import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, onFocus, onBlur, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:border-border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-hard aria-invalid:ring-3 aria-invalid:ring-hard/20 md:text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-logo/20 border border-border",
        className
      )}
      style={{
        height: 'var(--spacing-lg)',
        borderRadius: '10px',
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'var(--foreground)',
        fontSize: 'var(--text-base)',
        padding: '16px 20px',
        outline: 'none',
        transition: 'all 0.2s ease',
      }}
      {...props}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export { Input }
