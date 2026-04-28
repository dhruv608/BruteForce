import React from 'react';

export function ProgressBar({ step }: { step: number }) {
return (
  <div className="flex glass rounded-2xl justify-center mb-8 mt-2">

    <div className="flex items-center gap-5 px-4 py-3 ">

      {/* STEP 1 */}
      <div className="flex items-center gap-2">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
            transition-all duration-300

            ${
              step >= 1
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          1
        </div>

        <span
          className={`
            text-xs font-medium
            ${
              step >= 1 ? "text-foreground" : "text-muted-foreground"
            }
          `}
        >
          Username
        </span>
      </div>

      {/* LINE */}
      <div className="relative w-10 h-[2px] bg-foreground/10 rounded-full overflow-hidden">
        <div
          className={`
            absolute inset-0 bg-primary transition-all duration-500
            ${step >= 2 ? "w-full" : "w-0"}
          `}
        />
      </div>

      {/* STEP 2 */}
      <div className="flex items-center gap-2">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
            transition-all duration-300

            ${
              step >= 2
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          2
        </div>

        <span
          className={`
            text-xs font-medium
            ${
              step >= 2 ? "text-foreground" : "text-muted-foreground"
            }
          `}
        >
          Profiles
        </span>
      </div>

      {/* LINE */}
      <div className="relative w-10 h-[2px] bg-foreground/10 rounded-full overflow-hidden">
        <div
          className={`
            absolute inset-0 bg-primary transition-all duration-500
            ${step >= 3 ? "w-full" : "w-0"}
          `}
        />
      </div>

      {/* STEP 3 */}
      <div className="flex items-center gap-2">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
            transition-all duration-300

            ${
              step >= 3
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          3
        </div>

        <span
          className={`
            text-xs font-medium
            ${
              step >= 3 ? "text-foreground" : "text-muted-foreground"
            }
          `}
        >
          Confirm
        </span>
      </div>

    </div>
  </div>
);
}
