"use client";

import { useState } from "react";
import {
  SINGER_EVENT_GUIDE,
  type SingerEventGuideId,
} from "@/lib/data/singer-amplification-page";
import { cn } from "@/lib/utils";

export default function SingerEventGuideTabs() {
  const [activeId, setActiveId] = useState<SingerEventGuideId>(
    SINGER_EVENT_GUIDE[0].id,
  );
  const active = SINGER_EVENT_GUIDE.find((g) => g.id === activeId)!;

  return (
    <section aria-labelledby="event-guide-heading">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="event-guide-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          איזה ציוד הגברה לזמרים באמת צריך להופעה שלכם?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          השכרת הגברה לזמר - לפי סוג האירוע, לא לפי כמות הוואטים
        </p>
      </header>

      <div
        role="tablist"
        aria-label="סוגי אירועים"
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {SINGER_EVENT_GUIDE.map((guide) => {
          const selected = guide.id === activeId;
          return (
            <button
              key={guide.id}
              type="button"
              role="tab"
              id={`guide-tab-${guide.id}`}
              aria-selected={selected}
              aria-controls={`guide-panel-${guide.id}`}
              onClick={() => setActiveId(guide.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-brand-red text-white"
                  : "border border-border bg-surface text-foreground hover:border-brand-red/40",
              )}
            >
              {guide.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`guide-panel-${active.id}`}
        aria-labelledby={`guide-tab-${active.id}`}
        className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <h3 className="text-lg font-semibold text-foreground">{active.headline}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {active.description}
        </p>
        <ul className="mt-5 space-y-2">
          {active.gear.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-brand-red" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm font-medium text-foreground">
          מתאים ל: {active.idealFor}
        </p>
      </div>
    </section>
  );
}
