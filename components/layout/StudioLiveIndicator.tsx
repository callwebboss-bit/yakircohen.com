"use client";

import { useEffect, useState } from "react";
import { isStudioOpen } from "@/lib/studio-hours";

export default function StudioLiveIndicator() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setLive(isStudioOpen()));
  }, []);

  /* נקודת "פתוח עכשיו" לפי שעות הפעילות בשעון ישראל (lib/business-hours).
     לא "מקליטים עכשיו": השעון לא יודע אם מישהו מקליט (FIT-12). בלי
     animate-ping, כדי לא לרמוז על פעילות חיה. */
  // OPTIMIZED: reserved corner slot - client time (SSG-safe) without layout shift on reveal
  return (
    <span
      className="pointer-events-none absolute -end-1 -top-1 flex h-3 w-3"
      aria-hidden={!live}
      aria-label={live ? "עונים עכשיו לפי שעות המענה" : undefined}
      title={live ? "עונים עכשיו לפי שעות המענה" : undefined}
    >
      {live ? (
        <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-red" />
      ) : null}
    </span>
  );
}
