"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const BEFORE_SRC = "/audio/recording-raw-sample.mp3";
const AFTER_SRC = "/audio/recording-clean-sample.mp3";

const COMPARISON_ROWS = [
  {
    label: "מה מקבלים",
    others: "קול מוקלט ומעובד בסיסית",
    ours: "תיקון זיופים (Melodyne) + שיפור AI",
  },
  {
    label: "מיקס ומאסטרינג",
    others: "מינימלי או ללא",
    ours: "מיקס מקצועי + מאסטרינג",
  },
  {
    label: "למי זה מתאים",
    others: "תקציב נוח / אולפנים אחרים",
    ours: "נשמע כמו ברדיו - ביטחון מלא",
  },
] as const;

type BookRecordingVsProductionProps = {
  className?: string;
  /** גרסה מקוצרת למסלול מהיר — דוגמת שמע בלבד */
  compact?: boolean;
};

export default function BookRecordingVsProduction({
  className,
  compact = false,
}: BookRecordingVsProductionProps) {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);

  function pauseOther(playing: "before" | "after") {
    if (playing === "before") afterRef.current?.pause();
    else beforeRef.current?.pause();
  }

  const audioBlock = (
    <div dir="ltr" className={cn("grid gap-3 sm:grid-cols-2", compact ? "mt-3" : "mt-4")}>
      <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
        <p className="text-xs font-semibold text-muted-foreground">לפני עיבוד מלא</p>
        <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
          כמו שמקבלים באולפנים אחרים
        </p>
        <audio
          ref={beforeRef}
          controls
          preload="metadata"
          className="mt-2 h-9 w-full"
          onPlay={() => pauseOther("before")}
          aria-label="דוגמת הקלטה גולמית לפני עיבוד מלא"
        >
          <source src={BEFORE_SRC} type="audio/mpeg" />
        </audio>
      </div>
      <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-3 sm:p-4">
        <p className="text-xs font-semibold text-brand-red">אחרי עיבוד מלא</p>
        <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
          מה שאנחנו מייצאים מהאולפן
        </p>
        <audio
          ref={afterRef}
          controls
          preload="metadata"
          className="mt-2 h-9 w-full"
          onPlay={() => pauseOther("after")}
          aria-label="דוגמת הקלטה אחרי מיקס, מאסטרינג ותיקון זיופים"
        >
          <source src={AFTER_SRC} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-surface p-4 sm:p-5",
          className,
        )}
      >
        <p className="text-sm font-semibold text-foreground">
          שמעו את ההבדל — אצלנו לעומת אולפנים אחרים
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          כל המסלולים כאן כוללים עיבוד מלא. זו השוואה לסאונד שמקבלים במקומות אחרים.
        </p>
        {audioBlock}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5",
        className,
      )}
    >
      <p className="text-sm font-semibold text-foreground">
        מה ההבדל בסאונד שיוצא מהאולפן שלנו?
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        השוואה בין מה שמקבלים באולפנים אחרים לבין מה שאנחנו מייצאים — לא בין שני
        מסלולי רכישה באתר.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[17rem] text-start text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 pe-2 font-medium" scope="col" />
              <th className="px-2 pb-2 font-semibold text-foreground" scope="col">
                באולפנים אחרים
              </th>
              <th
                className="ps-2 pb-2 font-semibold text-brand-red"
                scope="col"
              >
                באולפן יקיר כהן
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border/60 last:border-0"
              >
                <th
                  scope="row"
                  className="py-2.5 pe-2 text-start font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="px-2 py-2.5 text-muted-foreground">{row.others}</td>
                <td className="ps-2 py-2.5 font-medium text-foreground">
                  {row.ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        כל המסלולים כאן כוללים עיבוד מלא — לא רק הקלטה גולמית.
      </p>

      {audioBlock}

      <p className="mt-3 text-center text-[0.65rem] leading-relaxed text-muted-foreground">
        אותו קול, לפני ואחרי העיבוד המלא שלנו
      </p>
    </div>
  );
}
