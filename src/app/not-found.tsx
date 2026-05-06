"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden">
      {mounted && (
        <div className="w-[75vmin] h-[75vmin]">
          <DotLottieReact
            src="/404erroranimation.json"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
