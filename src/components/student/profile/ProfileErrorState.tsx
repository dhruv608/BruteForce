"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface ProfileErrorStateProps {
  error: string;
}

export function ProfileErrorState({ error }: ProfileErrorStateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-[75vmin] h-[75vmin] max-w-[500px] max-h-[500px]">
        {mounted && (
          <DotLottieReact
            src="/404erroranimation.json"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      <p className="text-muted-foreground text-sm mt-4 text-center max-w-md">
        This username profile is not available.
      </p>
    </div>
  );
}
