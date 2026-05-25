"use client";

import { useMemo, useState } from "react";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   ProductionCalculator
   ─────────────────────────────────────────────────────────────────────────────
   Converts an event date into a backward-calculated 5-day production path so
   the client knows exactly when to arrive at the studio.

   Logic (offsets from event date):
     Day 1 (recording)  → event − 5
     Day 2 (editing)    → event − 4
     Day 3 (editing)    → event − 3
     Day 4 (mix)        → event − 2
     Day 5 (delivery)   → event − 1
     Event              → 0

   "Urgent" state: event < 5 days out - too short for the standard path.
   "Past" state:   selected date has already passed.
   "Valid" state:  event ≥ 5 days away - render the full timeline.

   All text follows De-Robotized copy rules:
   no long dashes, no robotic list markers, no "חשוב לציין" or boilerplate.
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── Helpers ────────────────────────────────────────────────────────────────*/

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDate(str: string): Date | null {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const he = new Intl.DateTimeFormat("he-IL", {
  weekday: "short",
  day: "numeric",
  month: "long",
});

const heLong = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function fmt(d: Date) { return he.format(d); }
function fmtLong(d: Date) { return heLong.format(d); }

/* ─── Step definitions ───────────────────────────────────────────────────────*/

type StepDef = {
  key: string;
  dayLabel: string;
  title: string;
  note: string | null;
  startOffset: number;
  endOffset?: number;
  accent: "gold" | "neutral" | "delivery";
};

const STEP_DEFS: StepDef[] = [
  {
    key: "recording",
    dayLabel: "יום 1",
    title: "סשן הקלטה חווייתי באולפן",
    note: "בלי לחץ ובקצב שלכם",
    startOffset: -5,
    accent: "gold",
  },
  {
    key: "editing",
    dayLabel: "ימים 2-3",
    title: "ניקוי רעשי רקע, עריכה דיגיטלית ויישור זיופים",
    note: null,
    startOffset: -4,
    endOffset: -3,
    accent: "neutral",
  },
  {
    key: "mix",
    dayLabel: "יום 4",
    title: "מיקס ומאסטרינג קפדני לסאונד עשיר ונוכח",
    note: null,
    startOffset: -2,
    accent: "neutral",
  },
  {
    key: "delivery",
    dayLabel: "יום 5",
    title: "קובץ המאסטר הסופי אצלכם בנייד",
    note: null,
    startOffset: -1,
    accent: "delivery",
  },
];

type ComputedStep = StepDef & { startDate: Date; endDate?: Date };

function buildTimeline(eventDate: Date): ComputedStep[] {
  return STEP_DEFS.map((def) => ({
    ...def,
    startDate: addDays(eventDate, def.startOffset),
    endDate: def.endOffset !== undefined ? addDays(eventDate, def.endOffset) : undefined,
  }));
}

/* ─── WhatsApp icon (inline - keeps this a self-contained client component) ──*/

function WaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── TimelineStep sub-component ─────────────────────────────────────────────*/

type TimelineStepProps = {
  step: ComputedStep;
  isLast: boolean;
};

const BADGE_STYLES: Record<StepDef["accent"], string> = {
  gold: "bg-foreground text-brand-red ring-1 ring-brand-red/40 shadow-[0_0_16px_rgba(212,43,43,0.2)]",
  neutral: "bg-surface border border-border text-foreground",
  delivery: "border-2 border-brand-red text-brand-red bg-background",
};

function TimelineStep({ step, isLast }: TimelineStepProps) {
  const dateStr =
    step.endDate
      ? `${fmt(step.startDate)} עד ${fmt(step.endDate)}`
      : fmt(step.startDate);

  return (
    <div className="relative flex items-start gap-5 pb-8 last:pb-0">
      {/* Badge column */}
      <div className="relative flex shrink-0 flex-col items-center">
        {/* Day number badge */}
        <div
          className={cn(
            "relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold leading-none",
            BADGE_STYLES[step.accent],
          )}
          aria-hidden="true"
        >
          {step.dayLabel}
        </div>

        {/* Dashed connector to next step */}
        {!isLast && (
          <div
            className="mt-1 flex-1"
            style={{
              width: 0,
              height: "2rem",
              borderInlineStartWidth: "2px",
              borderInlineStartStyle: "dashed",
              borderInlineStartColor: "rgba(212,43,43,0.3)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Step content */}
      <div className="min-w-0 flex-1 pt-1">
        {step.accent === "gold" && (
          <span className="mb-1.5 inline-block rounded-full bg-brand-red/15 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-brand-red">
            נקודת ההתחלה
          </span>
        )}
        <p className="text-xs font-medium text-muted-foreground">{dateStr}</p>
        <p
          className={cn(
            "mt-0.5 text-sm font-semibold leading-snug",
            step.accent === "gold" ? "text-foreground" : "text-foreground",
          )}
        >
          {step.title}
        </p>
        {step.note && (
          <p className="mt-0.5 text-xs text-muted-foreground">{step.note}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────────*/

export type ProductionCalculatorProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  className?: string;
};

export default function ProductionCalculator({
  eyebrow = "5 ימים מהמיקרופון לאירוע",
  heading = "מה תאריך האירוע שלכם?",
  description = "בחרו תאריך ותראו בדיוק מתי להגיע לאולפן. אנחנו דואגים לכל השאר.",
  className,
}: ProductionCalculatorProps) {
  const [rawDate, setRawDate] = useState<string>("");

  /* Compute stable values without SSR/client mismatch risk. */
  const minDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toLocalDateStr(d);
  }, []);

  const todayMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* Derive state from the raw input string. */
  const eventDate = useMemo(() => parseLocalDate(rawDate), [rawDate]);

  const daysUntil = useMemo<number | null>(() => {
    if (!eventDate) return null;
    return Math.floor(
      (eventDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [eventDate, todayMidnight]);

  type Status = "empty" | "past" | "urgent" | "valid";
  const status = useMemo<Status>(() => {
    if (daysUntil === null) return "empty";
    if (daysUntil < 0) return "past";
    if (daysUntil < 5) return "urgent";
    return "valid";
  }, [daysUntil]);

  const timeline = useMemo<ComputedStep[] | null>(() => {
    if (status !== "valid" || !eventDate) return null;
    return buildTimeline(eventDate);
  }, [status, eventDate]);

  const recordingDate = timeline?.[0]?.startDate ?? null;

  /* Pre-fill the WhatsApp message with the computed dates. */
  const whatsappHref = useMemo<string | null>(() => {
    if (!timeline || !eventDate || !recordingDate) return null;
    const text =
      `${buildServiceWhatsAppText("הקלטת שיר או ברכה באולפן")}. ` +
      `האירוע שלנו ב${fmtLong(eventDate)}. ` +
      `לפי המחשבון, יום ההקלטה ב${fmtLong(recordingDate)}. כדאי לשריין?`;
    return buildWhatsAppHref({
      text,
      utm_source: "calculator",
      utm_campaign: "production_timeline",
    });
  }, [timeline, eventDate, recordingDate]);

  const urgentHref = useMemo<string | null>(() => {
    if (status !== "urgent" || !eventDate || daysUntil === null) return null;
    const text =
      `${buildServiceWhatsAppText("הקלטת שיר או ברכה באולפן")}. ` +
      `האירוע ב${fmtLong(eventDate)}, בעוד ${daysUntil} ימים. יש אפשרות לסדר בזמן הקצר?`;
    return buildWhatsAppHref({
      text,
      utm_source: "calculator",
      utm_campaign: "production_timeline_urgent",
    });
  }, [status, eventDate, daysUntil]);

  return (
    <section
      className={cn("bg-background py-16 sm:py-20 lg:py-24", className)}
      aria-labelledby="calc-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {eyebrow}
          </p>
          <h2
            id="calc-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </header>

        {/* ── Date picker card ── */}
        <div className="mx-auto mt-10 max-w-lg">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <label
              htmlFor="event-date"
              className="block text-sm font-semibold text-foreground"
            >
              תאריך האירוע שלכם
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              חתונה, בר מצווה, אירוע חברה - הזינו את התאריך המדויק
            </p>

            <input
              id="event-date"
              type="date"
              value={rawDate}
              min={minDateStr}
              onChange={(e) => setRawDate(e.target.value)}
              dir="ltr"
              className={cn(
                "mt-4 w-full rounded-xl border border-border bg-background",
                "px-4 py-3 text-sm text-foreground [color-scheme:light]",
                "transition-[border-color,box-shadow] duration-fast ease-luxury",
                "focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/40",
              )}
              aria-label="תאריך האירוע"
            />

            {/* Empty hint */}
            {status === "empty" && (
              <p className="mt-3 text-xs text-muted-foreground">
                התהליך כולו לוקח 5 ימי עבודה לפני האירוע, מהמיקרופון עד הקובץ
                בנייד.
              </p>
            )}
          </div>
        </div>

        {/* ── Past date ── */}
        {status === "past" && (
          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              נראה שהתאריך הזה כבר עבר
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              יש לכם אירוע חדש בתכנון? כתבו לנו ונתאם הכל.
            </p>
            <a
              href={buildWhatsAppHref({
                text: buildServiceWhatsAppText("הקלטת שיר או ברכה באולפן"),
                utm_source: "calculator",
                utm_campaign: "past_date",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors duration-fast ease-luxury hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              <WaIcon />
              ספרו לנו על הפרויקט הבא
            </a>
          </div>
        )}

        {/* ── Urgent (< 5 days) ── */}
        {status === "urgent" && daysUntil !== null && urgentHref && (
          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6">
            <p className="font-semibold text-foreground">
              {daysUntil === 0
                ? "האירוע הוא היום"
                : daysUntil === 1
                  ? "האירוע מחר"
                  : `${daysUntil} ימים לאירוע`}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              זה קצר מידי לתהליך הרגיל, אבל לא בלתי אפשרי. כתבו לנו עכשיו
              ונראה מה אפשר להכין בזמן הקצר הזה.
            </p>
            <a
              href={urgentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,box-shadow] duration-fast ease-luxury hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label={`יצירת קשר בוואטסאפ לאירוע דחוף בעוד ${daysUntil} ימים`}
            >
              <WaIcon className="h-4 w-4" />
              כתבו לנו עכשיו
            </a>
          </div>
        )}

        {/* ── Valid timeline ── */}
        {status === "valid" && timeline && eventDate && recordingDate && whatsappHref && (
          <div className="mx-auto mt-10 max-w-lg">
            {/* Summary highlight - the key takeaway */}
            <div className="mb-8 rounded-2xl border border-brand-red/40 bg-brand-red/8 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                הגיעו לאולפן ב
              </p>
              <p className="mt-1.5 font-serif text-2xl font-semibold text-foreground">
                {fmtLong(recordingDate)}
              </p>
              <p className="mt-1 text-xs font-medium text-brand-red">
                כדאי לשריין מקום עוד היום, הזמנים מתמלאים
              </p>
            </div>

            {/* Timeline steps */}
            <div
              aria-label={`מסלול הפקה לאירוע ב-${fmtLong(eventDate)}`}
              role="list"
            >
              {timeline.map((step, i) => (
                <div key={step.key} role="listitem">
                  <TimelineStep step={step} isLast={i === timeline.length - 1} />
                </div>
              ))}

              {/* Event day - final marker */}
              <div
                role="listitem"
                className="relative flex items-start gap-5 pt-2"
              >
                <div className="flex shrink-0 flex-col items-center">
                  {/* Event marker */}
                  <div
                    className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-lg font-bold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)]"
                    aria-hidden="true"
                  >
                    ✨
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {fmtLong(eventDate)}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    האירוע שלכם
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    קובץ הסאונד כבר אצלכם יום לפני
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-10 text-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2.5 rounded-xl",
                  "bg-brand-red px-7 py-3.5 text-sm font-semibold text-white",
                  "shadow-[0_0_24px_rgba(212,43,43,0.35)]",
                  "transition-[background-color,box-shadow,transform] duration-normal ease-luxury",
                  "hover:bg-brand-red-light hover:shadow-[0_0_36px_rgba(212,43,43,0.5)]",
                  "active:scale-[0.97]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                )}
                aria-label={`שריינו את יום ההקלטה ב-${fmtLong(recordingDate)}, פתיחת שיחת וואטסאפ`}
              >
                <WaIcon />
                שריינו את יום ההקלטה ב-{fmt(recordingDate)}
                <span aria-hidden="true" className="text-xs opacity-70">
                  ←
                </span>
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                מענה אישי, בדרך כלל תוך שעה
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
