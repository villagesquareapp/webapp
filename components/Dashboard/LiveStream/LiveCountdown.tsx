"use client";

import { useEffect, useState } from "react";

interface LiveCountdownProps {
  onComplete: () => void;
  startFrom?: number;
}

const LiveCountdown = ({ onComplete, startFrom = 3 }: LiveCountdownProps) => {
  const [count, setCount] = useState(startFrom);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      {/* Animated rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute size-[200px] rounded-full border-[3px] border-cyan-400/40 animate-ping"
          style={{ animationDuration: "1.5s" }}
        />
        {/* Middle ring */}
        <div
          className="absolute size-[160px] rounded-full border-[3px] border-cyan-400/60 animate-ping"
          style={{ animationDuration: "1.2s", animationDelay: "0.2s" }}
        />
        {/* Inner ring */}
        <div className="absolute size-[120px] rounded-full border-[3px] border-cyan-400/80 animate-pulse" />
        {/* Center fill */}
        <div className="size-[100px] rounded-full bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white text-5xl font-bold drop-shadow-lg">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveCountdown;
