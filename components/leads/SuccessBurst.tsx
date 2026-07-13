"use client";

import { useEffect, useState } from "react";

/** Subtle success burst — CSS/Tailwind only, no emoji. */
export default function SuccessBurst({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 1200);
    return () => window.clearTimeout(t);
  }, [active]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <span className="h-16 w-16 animate-ping rounded-full bg-brand-red/30" />
      <span className="absolute h-10 w-10 scale-100 animate-pulse rounded-full bg-brand-red/50" />
    </div>
  );
}
