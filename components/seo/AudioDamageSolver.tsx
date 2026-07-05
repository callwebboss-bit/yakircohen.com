"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PremiumCrossfadePlayer = dynamic(
  () => import("@/components/ui/PremiumCrossfadePlayer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] animate-pulse rounded-2xl border border-border bg-surface" />
    ),
  },
);

type DamageCard = {
  id: string;
  icon: string;
  label: string;
  description: string;
} & (
  | {
      hasDemo: true;
      beforeSrc: string;
      afterSrc: string;
      beforeLabel: string;
      afterLabel: string;
      storageKey: string;
    }
  | { hasDemo: false }
);

const DAMAGE_CARDS: DamageCard[] = [
  {
    id: "room-echo",
    icon: "🏠",
    label: "הד חזק מהקירות",
    description: "הקלטה בחדר לא מוכן - הקול חוזר ומתפזר",
    hasDemo: true,
    beforeSrc: "/audio/weber-before_01.mp3",
    afterSrc: "/audio/weber-AFTER_01.mp3",
    beforeLabel: "עם הד (מקור פגום)",
    afterLabel: "אחרי שחזור",
    storageKey: "damage-echo",
  },
  {
    id: "ac-noise",
    icon: "❄️",
    label: "רעש מזגן / המהום",
    description: "רעש רקע קבוע - מזגן, מחשב, רחוב",
    hasDemo: true,
    beforeSrc: "/audio/podcast-raw-sample.mp3",
    afterSrc: "/audio/podcast-clean-sample.mp3",
    beforeLabel: "עם רעשי רקע",
    afterLabel: "אחרי ניקוי",
    storageKey: "damage-ac-noise",
  },
  {
    id: "wind",
    icon: "💨",
    label: "רוח בצילום חוץ",
    description: "רוח מכסה את הקול - צילומי חוץ, אירועים",
    hasDemo: false,
  },
  {
    id: "weak-voice",
    icon: "🔇",
    label: "קול חלש ומרוחק",
    description: "מיקרופון רחוק מדי - קול שטוח ולא נשמע",
    hasDemo: false,
  },
];

export default function AudioDamageSolver() {
  const [selected, setSelected] = useState<string | null>(null);

  const activeCard = DAMAGE_CARDS.find((c) => c.id === selected) ?? null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DAMAGE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(selected === card.id ? null : card.id)}
            aria-pressed={selected === card.id}
            className={cn(
              "rounded-2xl border p-4 text-start transition-all",
              selected === card.id
                ? "border-brand-red bg-brand-red/5 shadow-sm"
                : "border-border bg-background hover:border-brand-red/40",
            )}
          >
            <span className="text-2xl" aria-hidden>
              {card.icon}
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground leading-tight">
              {card.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              {card.description}
            </p>
          </button>
        ))}
      </div>

      {activeCard && (
        <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
          {activeCard.hasDemo ? (
            <>
              <p className="mb-4 text-sm font-semibold text-foreground">
                {activeCard.icon} {activeCard.label} - הקשיבו להבדל
              </p>
              <PremiumCrossfadePlayer
                beforeSrc={activeCard.beforeSrc}
                afterSrc={activeCard.afterSrc}
                beforeLabel={activeCard.beforeLabel}
                afterLabel={activeCard.afterLabel}
                storageKey={activeCard.storageKey}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                הזיזו את הסליידר לשמיעת לפני ואחרי. מומלץ עם אוזניות.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-2xl" aria-hidden>
                {activeCard.icon}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {activeCard.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                דגימת שמע לסוג נזק זה תהיה זמינה בקרוב.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                בינתיים - שלחו קובץ לבדיקה חינם בוואטסאפ.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
