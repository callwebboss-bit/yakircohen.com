"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SizePreset = "small" | "medium" | "large";

type Preset = {
  id: SizePreset;
  label: string;
  sub: string;
  guestCount: number;
};

const PRESETS: Preset[] = [
  { id: "small", label: "קטן", sub: "עד 150 אורחים", guestCount: 100 },
  { id: "medium", label: "בינוני", sub: "150-300 אורחים", guestCount: 225 },
  { id: "large", label: "גדול", sub: "300+ אורחים", guestCount: 400 },
];

type Recommendation = {
  headline: string;
  detail: string;
};

function getRecommendation(count: number): Recommendation {
  if (count <= 150) {
    return {
      headline: "תותח אחד יכסה את הרחבה בשלמותה",
      detail: `עבור ${count} אורחים, תותח CO₂ אחד נותן גשם קונפטי מלא לכל הרחבה. מפעיל מקצועי ידאג לתזמון המדויק.`,
    };
  }
  if (count <= 300) {
    return {
      headline: "2 תותחים לכיסוי מלא מ-2 כיוונים",
      detail: `עבור ${count} אורחים, 2 תותחים יורים בו-זמנית - אפקט כפול, קונפטי מכל עבר, כולם מוקפים ברגע אחד.`,
    };
  }
  return {
    headline: "2-3 תותחים לאפקט מלא ברחבה גדולה",
    detail: `עבור ${count}+ אורחים, השילוב האידיאלי הוא 2-3 תותחים - נוצר רגע שכולם יצלמו ויישמרו לתמיד.`,
  };
}

export default function VenueSizeCalculator() {
  const [preset, setPreset] = useState<SizePreset | null>(null);
  const [guestInput, setGuestInput] = useState<string>("");

  const effectiveCount = guestInput !== "" ? Number(guestInput) : preset ? PRESETS.find((p) => p.id === preset)!.guestCount : null;
  const rec = effectiveCount && effectiveCount > 0 ? getRecommendation(effectiveCount) : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="grid grid-cols-3 gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPreset(p.id);
              setGuestInput("");
            }}
            className={cn(
              "rounded-xl border p-4 text-start transition-colors",
              preset === p.id && guestInput === ""
                ? "border-brand-red bg-brand-red/5"
                : "border-border bg-surface hover:border-brand-red/40",
            )}
          >
            <span className="block text-sm font-semibold text-foreground">{p.label}</span>
            <span className="block text-xs text-muted-foreground">{p.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="guest-count" className="shrink-0 text-sm text-muted-foreground">
          או הזינו מספר אורחים:
        </label>
        <input
          id="guest-count"
          type="number"
          min={1}
          max={2000}
          value={guestInput}
          onChange={(e) => {
            setGuestInput(e.target.value);
            setPreset(null);
          }}
          placeholder="למשל 250"
          className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none"
        />
      </div>

      {rec ? (
        <div className="mt-5 rounded-xl border border-brand-red/30 bg-brand-red/5 p-5 transition-all">
          <p className="font-semibold text-foreground">{rec.headline}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{rec.detail}</p>
          <Link
            href="/book?category=events"
            className="mt-4 inline-flex rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            הזמינו עכשיו
          </Link>
        </div>
      ) : null}
    </div>
  );
}
