"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const EVENT_TYPE_OPTIONS = [
  "בר מצווה / בת מצווה",
  "חתונה",
  "כניסה לחופה",
  "הקלטה קבוצתית",
  "מתנה / יום הולדת",
  "אחר",
] as const;

const whatsappDirectHref = buildWhatsAppHref({
  text: "שלום יקיר, אני מעוניין לשוחח על הקלטת שיר לאירוע שלנו",
  utm_source: "website",
  utm_campaign: "recording_song_final_cta_wa",
});

export default function RecordingSongFinalCTA() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const lines = [
      "שלום, קיבלתי פנייה לייעוץ מוזיקלי דרך האתר:",
      `שם: ${name.trim()}`,
      `טלפון: ${phone.trim()}`,
      eventType ? `סוג האירוע: ${eventType}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const href = buildWhatsAppHref({
      text: lines,
      utm_source: "website",
      utm_campaign: "recording_song_final_cta_form",
    });

    window.open(href, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <section
      id="final-conversion-cta"
      className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center sm:p-12"
      aria-labelledby="final-cta-heading"
    >
      <h2
        id="final-cta-heading"
        className="text-2xl font-semibold text-foreground sm:text-3xl"
      >
        הרגע הגדול שלכם ראוי לסאונד מושלם.
        <span className="mt-1 block">בואו נתחיל ליצור את הזיכרון שלכם.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        לוח הזמנים באולפן במודיעין מתמלא במהירות לקראת עונת האירועים. צרו קשר
        עכשיו לייעוץ ראשוני ובדיקת התאמת פלייבק — ללא שום התחייבות.
      </p>

      {/* Primary: WhatsApp with pulse */}
      <div className="mt-8">
        <a
          href={whatsappDirectHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-4 text-base font-semibold text-white hover:bg-brand-red-light"
        >
          <span
            className="absolute inset-0 animate-ping rounded-xl bg-brand-red opacity-20"
            aria-hidden
          />
          שיחה מהירה בוואטסאפ עם יקיר ←
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          אנחנו עובדים אך ורק עם פלייבקים חוקיים ומאושרים לשימוש והקרנה
          באולמות אירועים.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto mt-10 flex max-w-sm items-center gap-4">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">או</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Secondary: Mini form */}
      {submitted ? (
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-brand-red/20 bg-background p-6">
          <p className="font-semibold text-foreground">
            תודה! נחזור אליכם בקרוב.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            פתחנו שיח בוואטסאפ — ספרו לנו על השיר שאתם חולמים עליו.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-sm space-y-3 text-right"
          aria-label="טופס בקשה לייעוץ מוזיקלי"
          noValidate
        >
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם מלא *"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
          <input
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="טלפון *"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">סוג האירוע (אופציונלי)</option>
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full rounded-xl border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white"
          >
            שלח בקשה לייעוץ מוזיקלי ←
          </button>
        </form>
      )}
    </section>
  );
}
