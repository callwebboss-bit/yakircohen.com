"use client";

import { useRef } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const BEFORE_SRC = "/audio/recording-raw-sample.mp3";
const AFTER_SRC = "/audio/recording-clean-sample.mp3";

const whatsappHref = buildWhatsAppHref({
  text: "שלום, שמעתי את ההדגמה באתר - אשמח לשמוע עוד על הקלטת שיר באולפן.",
  utm_source: "website",
  utm_campaign: "recording_song_before_after",
});

export default function RecordingSongBeforeAfter() {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);

  function pauseOther(playing: "before" | "after") {
    if (playing === "before") afterRef.current?.pause();
    else beforeRef.current?.pause();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div dir="ltr" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              לפני
            </span>
            <p className="text-sm font-semibold text-foreground">
              הקלטה גולמית באולפן
            </p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            לפני עריכה ותיקון זיופים
          </p>
          <audio
            ref={beforeRef}
            controls
            preload="metadata"
            className="mt-4 w-full"
            onPlay={() => pauseOther("before")}
            aria-label="הקלטת שיר גולמית לפני עריכה ותיקון זיופים"
          >
            <source src={BEFORE_SRC} type="audio/mpeg" />
          </audio>
        </div>

        {/* After */}
        <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-red/15 px-2.5 py-0.5 text-xs font-semibold text-brand-red-dark">
              אחרי
            </span>
            <p className="text-sm font-semibold text-foreground">
              התוצאה הסופית
            </p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            אחרי מיקס, מאסטרינג ופיץ׳ קורקשן
          </p>
          <audio
            ref={afterRef}
            controls
            preload="metadata"
            className="mt-4 w-full"
            onPlay={() => pauseOther("after")}
            aria-label="הקלטת שיר סופית אחרי עריכה, מיקס ומאסטרינג"
          >
            <source src={AFTER_SRC} type="audio/mpeg" />
          </audio>
        </div>
      </div>

      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">
          90% מהלקוחות שלנו אינם זמרים מקצועיים.
        </strong>{" "}
        עיבוד הסאונד הדיגיטלי שלנו הוא תקן בתעשייה - לא הופך אתכם למחשב,
        אלא מוציא את הגרסה הכי טובה, נקייה ומחמיאה של הקול הטבעי שלכם, כדי
        שתוכלו להקשיב לעצמכם בגאווה.
      </p>

      <div className="mt-6 text-center">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו לנו הודעה </a>
        <p className="mt-2 text-xs text-muted-foreground">
          בלי שום התחייבות - נשמח רק לשמוע איזה שיר אתם אוהבים ולעזור לכם
          לבחור את הפלייבק המתאים
        </p>
      </div>
    </div>
  );
}
