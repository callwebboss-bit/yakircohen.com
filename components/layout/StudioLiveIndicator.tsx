"use client";

import { useEffect, useState } from "react";

function isStudioLive(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 6=Sat
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

  if (!live) return null;

  return (
    <span
      className="group absolute -end-1 -top-1 flex h-3 w-3"
      aria-label="האולפן פעיל עכשיו"
      title="האולפן פעיל · מקליטים עכשיו 🎙️"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-60" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-red" />
    </span>
  );
}
