"use client";

import dynamic from "next/dynamic";
import { FULL_PRODUCTION_AUDIO } from "@/lib/data/full-production-showcase";

const PremiumCrossfadePlayer = dynamic(
  () => import("@/components/ui/PremiumCrossfadePlayer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] animate-pulse rounded-2xl border border-border bg-surface" />
    ),
  },
);

type Props = {
  playerNote: string;
};

export default function FullProductionBeforeAfter({ playerNote }: Props) {
  return (
    <figure
      className="space-y-4"
      aria-label="הדגמת הפקה מלאה מווקאל יבש — לפני ואחרי"
    >
      <PremiumCrossfadePlayer
        beforeSrc={FULL_PRODUCTION_AUDIO.beforeSrc}
        afterSrc={FULL_PRODUCTION_AUDIO.afterSrc}
        beforeLabel={FULL_PRODUCTION_AUDIO.beforeLabel}
        afterLabel={FULL_PRODUCTION_AUDIO.afterLabel}
        storageKey="full-production"
      />

      <figcaption>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {playerNote}
        </p>
      </figcaption>
    </figure>
  );
}
