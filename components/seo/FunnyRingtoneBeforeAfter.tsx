"use client";

import dynamic from "next/dynamic";
import { RINGTONE_AUDIO } from "@/lib/data/funny-ringtone-page";

const PremiumCrossfadePlayer = dynamic(
  () => import("@/components/ui/PremiumCrossfadePlayer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] animate-pulse rounded-2xl border border-border bg-surface" />
    ),
  },
);

export default function FunnyRingtoneBeforeAfter() {
  return (
    <figure className="space-y-4" aria-label="הדגמת רינגטון מצחיק - לפני ואחרי">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
          שמעו את ההבדל
        </p>
        <p className="text-xs text-muted-foreground">
          חברו אוזניות כדי לשמוע את ההבדל בין ההקלטה הגולמית לרינגטון המוכן
        </p>
      </header>

      <PremiumCrossfadePlayer
        beforeSrc={RINGTONE_AUDIO.beforeSrc}
        afterSrc={RINGTONE_AUDIO.afterSrc}
        beforeLabel={RINGTONE_AUDIO.beforeLabel}
        afterLabel={RINGTONE_AUDIO.afterLabel}
        storageKey="funny-ringtone"
      />

      <figcaption>
        <p className="text-sm leading-relaxed text-muted-foreground">
          גררו את הסליידר - שמאל: הקלטה גולמית. ימין: רינגטון מעובד, מצחיק
          ומוכן להתקנה.
        </p>
      </figcaption>
    </figure>
  );
}
