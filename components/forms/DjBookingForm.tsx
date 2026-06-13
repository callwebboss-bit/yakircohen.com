"use client";

import { useId, useState } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  validatePersonName,
  validateIsraeliMobile,
  validateEmailOptional,
  validateEventDate,
  validateEventTime,
  validateVenue,
  validateGuestCountOptional,
  validateFreeTextOptional,
} from "@/lib/form-validation";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { buildClosingMessage } from "@/lib/whatsapp-closing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { cn } from "@/lib/utils";

/* ─── Options ──────────────────────────────────────────────────────────────── */

const EVENT_TYPES = [
  "חתונה",
  "בר / בת מצווה",
  "אירוע חברה",
  "יום הולדת",
  "מסיבה פרטית",
  "אחר",
] as const;

const EVENT_PARTS = ["חופה", "ריקודים", "סלואו", "ברכות", "עוגה"] as const;

const MUSIC_STYLE_OPTIONS = [
  "מזרחי",
  "אנגלי / בינלאומי",
  "מעורב",
  "חסידי / מסורתי",
  "ים תיכוני",
  "פופ ישראלי",
] as const;

const EXTRAS = [
  "הגברה עצמאית",
  "תאורה מתקדמת",
  "אטרקציות (עשן, זיקוקים, קונפטי)",
  "הנחיה מקצועית",
  "אחר",
] as const;

const BUDGET_OPTIONS = [
  "עד 4,000 ₪",
  "4,000 - 6,000 ₪",
  "6,000 - 10,000 ₪",
  "10,000 ₪ ומעלה",
  "חבילת הכל כלול (15,000+ ₪)",
  "עדיין לא בטוח/ה",
] as const;

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-red-500">
      {msg}
    </p>
  );
}

function SectionTitle({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
        {step}
      </span>
      <h3 className="text-base font-semibold text-foreground">{children}</h3>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

const INPUT_CLS =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red";

const CHECKBOX_LABEL_CLS =
  "flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-brand-red/40 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/5";

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function DjBookingForm({ className }: { className?: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  /* Contact */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  /* Event */
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [guestCount, setGuestCount] = useState("");

  /* Preferences */
  const [eventParts, setEventParts] = useState<Set<string>>(new Set());
  const [musicStyles, setMusicStyles] = useState<Set<string>>(new Set());
  const [musicNotes, setMusicNotes] = useState("");
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { submitLead } = useLeadSubmit();
  const { honeypot, setHoneypot, globalError, setGlobalError, attemptSubmit } =
    useLeadFormGuard({ formId: "dj_booking_form" });

  function toggleSet(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = attemptSubmit(
      () => {
        const nameR = validatePersonName(name);
        const phoneR = validateIsraeliMobile(phone);
        const emailR = validateEmailOptional(email);
        const dateR = validateEventDate(eventDate);
        const startR = validateEventTime(startTime);
        const venueR = validateVenue(venue);
        const guestR = validateGuestCountOptional(guestCount);
        const notesR = validateFreeTextOptional(musicNotes, {
          field: "musicNotes",
          label: "העדפות מוזיקה",
          maxLength: 500,
        });

        const allErrors: Record<string, string> = {};
        if (!nameR.ok) Object.assign(allErrors, nameR.errors);
        if (!phoneR.ok) Object.assign(allErrors, phoneR.errors);
        if (!emailR.ok) Object.assign(allErrors, emailR.errors);
        if (!dateR.ok) Object.assign(allErrors, dateR.errors);
        if (!startR.ok) Object.assign(allErrors, startR.errors);
        if (!venueR.ok) Object.assign(allErrors, venueR.errors);
        if (!guestR.ok) Object.assign(allErrors, guestR.errors);
        if (!notesR.ok) Object.assign(allErrors, notesR.errors);

        if (!eventType) allErrors["eventType"] = "נא לבחור סוג אירוע";

        if (Object.keys(allErrors).length > 0) return { ok: false as const, errors: allErrors };
        const normalizedPhone = phoneR.ok ? phoneR.normalizedPhone : undefined;
        return { ok: true as const, normalizedPhone };
      },
      () => {
        const summaryLines = [
          { label: "סוג אירוע", value: eventType },
          { label: "תאריך", value: eventDate },
          { label: "שעות", value: `${startTime}${endTime ? ` - ${endTime}` : ""}` },
          { label: "מיקום", value: venue.trim() },
          ...(guestCount.trim()
            ? [{ label: "מוזמנים", value: `~${guestCount.trim()}` }]
            : []),
          ...(eventParts.size > 0
            ? [{ label: "חלקי אירוע", value: [...eventParts].join(", ") }]
            : []),
          ...(musicStyles.size > 0
            ? [{ label: "סגנון מוזיקלי", value: [...musicStyles].join(", ") }]
            : []),
          ...(musicNotes.trim()
            ? [{ label: "הערות מוזיקה", value: musicNotes.trim() }]
            : []),
          ...(extras.size > 0
            ? [{ label: "תוספות", value: [...extras].join(", ") }]
            : []),
          ...(budget ? [{ label: "תקציב", value: budget }] : []),
          ...(email.trim() ? [{ label: "אימייל", value: email.trim() }] : []),
        ];

        const text = buildClosingMessage({
          serviceLabel: "DJ לאירוע",
          contact: { name: name.trim(), phone: phone.trim() },
          intent: "continue_chat",
          summaryLines,
          source: "/events/dj-events",
          closerServiceId: "dj",
          ycForm: "dj_booking_form",
        });
        const href = buildWhatsAppHref({
          text,
          utm_source: "website",
          utm_campaign: "dj_booking_form",
        });

        void submitLead(
          {
            formId: "dj_booking_form",
            subject: `בקשת DJ - ${eventType} - ${eventDate}`,
            body: text,
            website_verification: honeypot,
            name: name.trim(),
            phone: phone.trim(),
            crossSell: { bookCategory: "dj" },
          },
          href,
          "continue_chat",
          { leadCategory: "dj" },
        );
        setSubmitted(true);
      },
    );

    if (errors) setFieldErrors(errors);
    else setFieldErrors({});
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-brand-red/30 bg-brand-red/5 px-8 py-12 text-center",
          className,
        )}
      >
        <p className="text-2xl">✅</p>
        <p className="mt-3 text-lg font-semibold text-foreground">
          הפרטים נשלחו - פתחנו שיח בוואטסאפ
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          חוזרים אליכם תוך שעה בשעות הפעילות לאישור הפרטים ושריון התאריך.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="טופס שריון תאריך ובקשת הצעת מחיר לתקליטן"
      className={cn(
        "rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10",
        className,
      )}
    >
      {/* Hero copy */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
          שריון תאריך - הצעת מחיר מדויקת
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
          מלאו את הפרטים - נחזור עם הצעה תוך שעה
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          הטופס מיועד למי שרוצה לשריין תאריך ולקבל הצעת מחיר אישית ומהירה.
          כל פרט שתמלאו מאפשר לנו להתאים הצעה מדויקת לאירוע שלכם - ללא בזבוז זמן משני הצדדים.
        </p>
      </div>

      {globalError ? (
        <LeadFormAlert message={globalError} className="mb-6" />
      ) : null}

      <div className="space-y-8">
        {/* ─── שלב 1: פרטי קשר ──────────────────────────────────────────── */}
        <fieldset>
          <legend className="mb-4 w-full">
            <SectionTitle step="1">פרטי קשר</SectionTitle>
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("name")} className="block text-sm font-medium text-foreground">
                {FORM_MICROCOPY.nameLabel} <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <input
                id={id("name")}
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={FORM_MICROCOPY.namePlaceholder}
                className={cn(INPUT_CLS, fieldErrors.name && "border-red-400")}
              />
              <FieldError msg={fieldErrors.name} />
            </div>

            <div>
              <label htmlFor={id("phone")} className="block text-sm font-medium text-foreground">
                {FORM_MICROCOPY.phoneLabel} <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <input
                id={id("phone")}
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={FORM_MICROCOPY.phonePlaceholder}
                aria-describedby={`${id("phone")}-hint`}
                className={cn(INPUT_CLS, fieldErrors.phone && "border-red-400")}
              />
              <FieldError msg={fieldErrors.phone} />
              {!fieldErrors.phone ? (
                <p id={`${id("phone")}-hint`} className="mt-1 text-xs text-muted-foreground">
                  {FORM_MICROCOPY.phoneHint}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={id("email")} className="block text-sm font-medium text-foreground">
                אימייל{" "}
                <span className="text-xs font-normal text-muted-foreground">(אופציונלי)</span>
              </label>
              <input
                id={id("email")}
                type="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={cn(INPUT_CLS, fieldErrors.email && "border-red-400")}
              />
              <FieldError msg={fieldErrors.email} />
            </div>
          </div>
        </fieldset>

        {/* ─── שלב 2: פרטי האירוע ───────────────────────────────────────── */}
        <fieldset>
          <legend className="mb-4 w-full">
            <SectionTitle step="2">פרטי האירוע</SectionTitle>
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("eventType")} className="block text-sm font-medium text-foreground">
                סוג האירוע <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <select
                id={id("eventType")}
                required
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className={cn(INPUT_CLS, fieldErrors.eventType && "border-red-400")}
              >
                <option value="">בחרו סוג אירוע</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError msg={fieldErrors.eventType} />
            </div>

            <div>
              <label htmlFor={id("eventDate")} className="block text-sm font-medium text-foreground">
                תאריך האירוע <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <input
                id={id("eventDate")}
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={cn(INPUT_CLS, fieldErrors.eventDate && "border-red-400")}
              />
              <FieldError msg={fieldErrors.eventDate} />
            </div>

            <div>
              <label htmlFor={id("startTime")} className="block text-sm font-medium text-foreground">
                שעת התחלה <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <input
                id={id("startTime")}
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={cn(INPUT_CLS, fieldErrors.eventTime && "border-red-400")}
              />
              <FieldError msg={fieldErrors.eventTime} />
            </div>

            <div>
              <label htmlFor={id("endTime")} className="block text-sm font-medium text-foreground">
                שעת סיום משוערת{" "}
                <span className="text-xs font-normal text-muted-foreground">(אופציונלי)</span>
              </label>
              <input
                id={id("endTime")}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={id("venue")} className="block text-sm font-medium text-foreground">
                מיקום האירוע / שם האולם <span className="text-brand-red" aria-hidden>*</span>
              </label>
              <input
                id={id("venue")}
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="אולם שושנה, מודיעין"
                className={cn(INPUT_CLS, fieldErrors.venue && "border-red-400")}
              />
              <FieldError msg={fieldErrors.venue} />
            </div>

            <div>
              <label htmlFor={id("guests")} className="block text-sm font-medium text-foreground">
                מספר מוזמנים מוערך{" "}
                <span className="text-xs font-normal text-muted-foreground">(אופציונלי)</span>
              </label>
              <input
                id={id("guests")}
                type="number"
                min={1}
                max={5000}
                inputMode="numeric"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="150"
                className={cn(INPUT_CLS, fieldErrors.guestCount && "border-red-400")}
              />
              <FieldError msg={fieldErrors.guestCount} />
            </div>
          </div>
        </fieldset>

        {/* ─── שלב 3: העדפות מוזיקה ותוספות ───────────────────────────── */}
        <fieldset>
          <legend className="mb-4 w-full">
            <SectionTitle step="3">העדפות מוזיקה ותוספות</SectionTitle>
          </legend>
          <div className="space-y-5">
            {/* חלקי האירוע */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                חלקי האירוע שדורשים DJ
              </p>
              <div className="flex flex-wrap gap-2">
                {EVENT_PARTS.map((part) => (
                  <label key={part} className={CHECKBOX_LABEL_CLS}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={eventParts.has(part)}
                      onChange={() => toggleSet(setEventParts, part)}
                    />
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        eventParts.has(part)
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-muted-foreground/40",
                      )}
                      aria-hidden
                    >
                      {eventParts.has(part) ? "✓" : ""}
                    </span>
                    {part}
                  </label>
                ))}
              </div>
            </div>

            {/* סגנון מוזיקלי */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                סגנון מוזיקלי מועדף{" "}
                <span className="text-xs font-normal text-muted-foreground">(ניתן לבחור כמה)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {MUSIC_STYLE_OPTIONS.map((style) => (
                  <label key={style} className={CHECKBOX_LABEL_CLS}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={musicStyles.has(style)}
                      onChange={() => toggleSet(setMusicStyles, style)}
                    />
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        musicStyles.has(style)
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-muted-foreground/40",
                      )}
                      aria-hidden
                    >
                      {musicStyles.has(style) ? "✓" : ""}
                    </span>
                    {style}
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor={id("musicNotes")} className="sr-only">
                  הערות נוספות לגבי מוזיקה
                </label>
                <textarea
                  id={id("musicNotes")}
                  rows={2}
                  value={musicNotes}
                  onChange={(e) => setMusicNotes(e.target.value)}
                  placeholder="שיר כניסה, שירים אסורים, בקשות מיוחדות..."
                  className={cn(INPUT_CLS, "resize-none", fieldErrors.musicNotes && "border-red-400")}
                />
                <FieldError msg={fieldErrors.musicNotes} />
              </div>
            </div>

            {/* תוספות */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                תוספות שמעניינות אתכם
              </p>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((extra) => (
                  <label key={extra} className={CHECKBOX_LABEL_CLS}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={extras.has(extra)}
                      onChange={() => toggleSet(setExtras, extra)}
                    />
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        extras.has(extra)
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-muted-foreground/40",
                      )}
                      aria-hidden
                    >
                      {extras.has(extra) ? "✓" : ""}
                    </span>
                    {extra}
                  </label>
                ))}
              </div>
            </div>

            {/* תקציב */}
            <div>
              <label htmlFor={id("budget")} className="block text-sm font-medium text-foreground">
                תקציב משוערך{" "}
                <span className="text-xs font-normal text-muted-foreground">(אופציונלי)</span>
              </label>
              <select
                id={id("budget")}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">בחרו טווח (לא חובה)</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
      </div>

      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <div className="mt-8 border-t border-border pt-6">
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto sm:min-w-[18rem]"
        >
          שלחו פרטים לוואטסאפ ושריינו תאריך ✓
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          הפרטים נשלחים ישירות אלינו בוואטסאפ. לא מאחסנים מידע אישי.
          חוזרים אליכם תוך שעה בשעות הפעילות.
        </p>
      </div>
    </form>
  );
}
