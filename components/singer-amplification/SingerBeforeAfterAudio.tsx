"use client";

import { useRef } from "react";
import { SINGER_AUDIO_BEFORE_AFTER } from "@/lib/data/singer-amplification-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const whatsappHref = buildWhatsAppHref({
  text: "שלום, שמעתי את ההדגמה לפני/אחרי באתר - אשמח לייעוץ על הגברה לזמר/ה.",
  utm_source: "website",
  utm_campaign: "singer_amplification_before_after",
});

export default function SingerBeforeAfterAudio() {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);

  function pauseOther(playing: "before" | "after") {
    if (playing === "before") afterRef.current?.pause();
    else beforeRef.current?.pause();
  }

  const { heading, before, after } = SINGER_AUDIO_BEFORE_AFTER;

  return (
    <section aria-labelledby="before-after-heading">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="before-after-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          שימו אוזניות - ההבדל הוא כיוון מערכת, לא רק &quot;רמקולים חזקים יותר&quot;
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {before.badge}
              </span>
              <p className="text-sm font-semibold text-foreground">{before.title}</p>
            </div>
            <audio
              ref={beforeRef}
              controls
              preload="metadata"
              className="mt-4 w-full"
              onPlay={() => pauseOther("before")}
              aria-label={before.title}
            >
              <source src={before.src} type="audio/mpeg" />
            </audio>
          </div>

          <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-red/15 px-2.5 py-0.5 text-xs font-semibold text-brand-red">
                {after.badge}
              </span>
              <p className="text-sm font-semibold text-foreground">{after.title}</p>
            </div>
            <audio
              ref={afterRef}
              controls
              preload="metadata"
              className="mt-4 w-full"
              onPlay={() => pauseOther("after")}
              aria-label={after.title}
            >
              <source src={after.src} type="audio/mpeg" />
            </audio>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          קבצי ההדגמה יועלו בקרוב. בינתיים -{" "}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-red hover:underline"
          >
            בקשו דוגמה בוואטסאפ
          </a>
        </p>
      </div>
    </section>
  );
}
