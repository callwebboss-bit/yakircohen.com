"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { hubBookCtaLabel } from "@/lib/data/conversion-copy";
import { getExVat } from "@/lib/data/pricing-catalog";
import { buildBookHref } from "@/lib/book-url";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

const EVENT_TYPE_OPTIONS = [
  "בר מצווה / בת מצווה",
  "חתונה",
  "כניסה לחופה",
  "הקלטה קבוצתית",
  "מתנה / יום הולדת",
  "אחר",
] as const;

const FORM_ID = "recording_song_final_cta_form";

const whatsappDirectHref = buildWhatsAppHref({
  text: "שלום יקיר, אני מעוניין לשוחח על הקלטת שיר לאירוע שלנו",
  utm_source: "website",
  utm_campaign: "recording_song_final_cta_wa",
});

export default function RecordingSongFinalCTA() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: FORM_ID,
  });
  const { submitLead, isSuccess, isSubmitting } = useLeadSubmit();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errs = attemptSubmit(
      () =>
        validateBookingLead({
          name,
          phone,
          date: "",
          time: "",
          location: "",
          notes: "",
          requireLocation: false,
          requireDate: false,
          requireTime: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : phone.trim();
        const summaryLines = eventType
          ? [{ label: "סוג אירוע", value: eventType }]
          : [];
        const body = buildSimpleLeadMessage({
          contact: {
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
          },
          serviceLabel: "ייעוץ מוזיקלי להקלטת שיר",
          priceExVat: getExVat("song_package"),
          summaryLines,
          source: "/studio/recording-song-modiin",
          closerServiceId: "recording",
          ycForm: FORM_ID,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: FORM_ID,
        });
        void submitLead(
          {
            formId: FORM_ID,
            subject: "ליד חדש - ייעוץ מוזיקלי להקלטת שיר",
            body,
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
            crossSell: { bookCategory: "studio" },
          },
          href,
          "continue_chat",
          { leadCategory: "studio" },
        );
      },
    );

    setFieldErrors(errs ?? {});
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
        עכשיו לייעוץ ראשוני ובדיקת התאמת פלייבק - ללא שום התחייבות.
      </p>

      <div className="mt-8 space-y-3">
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
        <div>
          <Link
            href={buildBookHref("studio")}
            className="inline-flex rounded-xl border border-border px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
          >
            {hubBookCtaLabel(getExVat("blessing_recording"))}
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          אנחנו עובדים אך ורק עם פלייבקים חוקיים ומאושרים לשימוש והקרנה
          באולמות אירועים.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-sm items-center gap-4">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">או</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {isSuccess ? (
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-brand-red/20 bg-background p-6">
          <p className="font-semibold text-foreground">
            תודה! נחזור אליכם בקרוב.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            פתחנו שיח בוואטסאפ - ספרו לנו על השיר שאתם חולמים עליו.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-sm space-y-3 text-right"
          aria-label="טופס בקשה לייעוץ מוזיקלי"
          noValidate
        >
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <LeadFormAlert message={globalError} />
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם מלא *"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? (
            <p className="text-xs text-red-500">{fieldErrors.name}</p>
          ) : null}
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="טלפון *"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? (
            <p className="text-xs text-red-500">{fieldErrors.phone}</p>
          ) : null}
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
            disabled={isSubmitting}
            className="w-full rounded-xl border border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white disabled:opacity-50"
          >
            {isSubmitting ? "שולח..." : "שלח בקשה לייעוץ מוזיקלי ←"}
          </button>
        </form>
      )}
    </section>
  );
}
