"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTipForPath } from "@/lib/data/greeting-tips";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 11) return "בוקר טוב ☀️";
  if (hour >= 11 && hour < 17) return "שלום 👋";
  if (hour >= 17 && hour < 21) return "ערב טוב 🌆";
  return "לילה טוב 🌙";
}

export default function TimeGreeting() {
  const pathname = usePathname();
  const [greeting, setGreeting] = useState<string | null>(null);
  const tip = getTipForPath(pathname);

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  if (!greeting) return null;

  return (
    <div className="flex items-center gap-3 py-1.5 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{greeting}</span>
      <span aria-hidden className="text-border">·</span>
      <span>{tip}</span>
    </div>
  );
}
