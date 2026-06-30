"use client";

import { useMemo, useState } from "react";
import HubDualCta from "@/components/marketing/HubDualCta";
import { hubBookCtaLabel, SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import {
  calcAcademyMistakeSavings,
  calcPodcastMonthlySavings,
} from "@/lib/data/time-saver-roi";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type TimeSaverRoiSliderProps = {
  variant: "podcast" | "academy";
  className?: string;
};

export default function TimeSaverRoiSlider({
  variant,
  className,
}: TimeSaverRoiSliderProps) {
  const [value, setValue] = useState(variant === "podcast" ? 2 : 3);

  const podcastStats = useMemo(
    () => (variant === "podcast" ? calcPodcastMonthlySavings(value) : null),
    [variant, value],
  );
  const academyStats = useMemo(
    () => (variant === "academy" ? calcAcademyMistakeSavings(value) : null),
    [variant, value],
  );

  const bookCta =
    variant === "podcast"
      ? resolveServiceBookCta("podcast")
      : resolveServiceBookCta("academy");

  const whatsappHref = buildWhatsAppHref({
    text:
      variant === "podcast"
        ? "שלום, השתמשתי במחשבון חיסכון הזמן לפודקאסט — אשמח לבדוק מחיר ותאריך."
        : "שלום, השתמשתי במחשבון חיסכון הזמן באקדמיה — אשמח לפרטים על שיעור.",
    utm_source: variant,
    utm_campaign: `time_saver_roi_${variant}`,
  });

  const min = 1;
  const max = variant === "podcast" ? 8 : 12;
  const label =
    variant === "podcast"
      ? `פרקים בחודש: ${value}`
      : `חודשי לימוד: ${value}`;

  return (
    <section
      className={cn("rounded-2xl border border-border bg-surface p-6", className)}
      aria-labelledby="time-saver-roi-heading"
    >
      <h2 id="time-saver-roi-heading" className="text-xl font-semibold text-foreground">
        כמה זמן זה חוסך לכם בחודש?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {variant === "podcast"
          ? "השוואה להקלטה + עריכה עצמית — הערכה בלבד."
          : "השוואה לטעויות ציוד וזמן עריכה — הערכה בלבד."}
      </p>

      <div className="mt-6">
        <label htmlFor="time-saver-range" className="mb-2 block text-sm font-medium">
          {label}
        </label>
        <input
          id="time-saver-range"
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-brand-red"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {podcastStats ? (
          <>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-2xl font-bold text-brand-red">
                {podcastStats.hoursSaved} שעות
              </p>
              <p className="text-xs text-muted-foreground">עריכה וטכני שאתם לא עושים</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-2xl font-bold text-foreground">
                ~{podcastStats.workDaysSaved} ימי עבודה
              </p>
              <p className="text-xs text-muted-foreground">
                ערך זמן משוער: {podcastStats.diyCostEstimate.toLocaleString("he-IL")} ₪
              </p>
            </div>
          </>
        ) : null}
        {academyStats ? (
          <>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-2xl font-bold text-brand-red">
                {academyStats.mistakesAvoided.toLocaleString("he-IL")} ₪
              </p>
              <p className="text-xs text-muted-foreground">טעויות וזמן שנחסכים (הערכה)</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-2xl font-bold text-foreground">
                {academyStats.lessonsEquivalent} שיעורים
              </p>
              <p className="text-xs text-muted-foreground">שווי לימוד מול אותו תקציב</p>
            </div>
          </>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{SKEPTICISM_CTA}</p>

      {bookCta ? (
        <HubDualCta
          className="mt-6"
          whatsappHref={whatsappHref}
          whatsappLabel="שאלו בוואטסאפ"
          bookHref={bookCta.bookHref}
          bookLabel={bookCta.bookLabel ?? hubBookCtaLabel(990)}
        />
      ) : null}
    </section>
  );
}
