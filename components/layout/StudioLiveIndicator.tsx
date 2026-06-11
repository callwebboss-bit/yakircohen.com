"use client";

import { useEffect, useState } from "react";

function isStudioLive(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun ... 6=Sat
  const hour = now.getHours();
  if (day === 6) return false; // Saturday closed
  if (day === 5) return hour >= 9 && hour < 14; // Friday 9-14
  return hour >= 9 && hour < 20; // Sun-Thu 9-20
}

export default function StudioLiveIndicator() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(isStudioLive());
  }, []);

  // OPTIMIZED: reserved corner slot — client time (SSG-safe) without layout shift on reveal
  return (
    <span
      className="pointer-events-none absolute -end-1 -top-1 flex h-3 w-3"
      aria-hidden={!live}
      aria-label={live ? "האולפן פעיל עכשיו" : undefined}
      title={live ? "האולפן פעיל · מקליטים עכשיו 🎙️" : undefined}
    >
      {live ? (
        <>
          <span className="absolute inline-flex h-full w-full motion-reduce:animate-none animate-ping rounded-full bg-brand-red opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-red" />
        </>
      ) : null}
    </span>
  );
}
