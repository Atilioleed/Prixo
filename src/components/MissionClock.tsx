"use client";

import { useEffect, useState } from "react";

export default function MissionClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("es-CL", { hour12: false })
    : "--:--:--";

  return (
    <div className={`flex items-center gap-2 tabular ${className ?? ""}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
      <span className="text-[11px] text-text-faint">{time}</span>
    </div>
  );
}
