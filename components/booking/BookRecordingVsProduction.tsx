"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const BASIC_SAMPLE_SRC = "/audio/recording-raw-sample.mp3";

type BookRecordingVsProductionProps = {
  className?: string;
};

export default function BookRecordingVsProduction({
  className,
}: BookRecordingVsProductionProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          הקלטה בלבד
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>קול מוקלט ומעובד בסיסית</li>
          <li>מיקס ומאסטרינג</li>
          <li>מתאים לתקציב נוח</li>
        </ul>
        <div className="mt-3 rounded-lg border border-border/70 bg-surface/60 p-2.5">
          <p className="mb-2 text-[0.65rem] font-semibold text-muted-foreground">
            דוגמה: לפני עיבוד מלא
          </p>
          <audio
            ref={audioRef}
            controls
            preload="none"
            className="h-9 w-full"
            aria-label="דוגמת הקלטה גולמית לפני עיבוד מלא"
          >
            <source src={BASIC_SAMPLE_SRC} type="audio/mpeg" />
          </audio>
        </div>
      </div>
      <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-red">
          הפקה מלאה + שיפור AI
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground">
          <li>תיקון זיופים (Melodyne)</li>
          <li>מיקס מקצועי + מאסטרינג</li>
          <li>נשמע כמו ברדיו - ביטחון מלא</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          כל המסלולים כאן כוללים עיבוד מלא - לא רק הקלטה גולמית.
        </p>
      </div>
    </div>
  );
}
