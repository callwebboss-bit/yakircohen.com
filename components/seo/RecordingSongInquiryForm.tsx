"use client";

import { useState, type FormEvent } from "react";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { getExVat } from "@/lib/data/pricing-catalog";
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

const FORM_ID = "recording_song_inquiry_form";

export default function RecordingSongInquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [customerNeed, setCustomerNeed] = useState("");
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
          notes: customerNeed,
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
          serviceLabel: "הקלטת שיר באולפן",
          customerNeed: customerNeed.trim()
            ? sanitizeLeadText(customerNeed, 500)
            : null,
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
            subject: "ליד חדש - הקלטת שיר באולפן",
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

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">
          תודה! מיד נחזור אליכם.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          פתחנו שיח בוואטסאפ - ספרו לנו קצת על השיר שאתם חולמים עליו.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8"
      aria-label="טופס יצירת קשר להקלטת שיר"
      noValidate
    >
      <h2 className="text-xl font-semibold text-foreground">
        תיאום ראשוני - ללא התחייבות
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        השאירו פרטים ונחזור אליכם תוך שעה. שאלה אחת, ללא לחץ.
      </p>

      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <LeadFormAlert message={globalError} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="inquiry-name"
            className="block text-sm font-medium text-foreground"
          >
            שם מלא <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="inquiry-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ישראל ישראלי"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="inquiry-phone"
            className="block text-sm font-medium text-foreground"
          >
            טלפון <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-0000000"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="inquiry-event"
            className="block text-sm font-medium text-foreground"
          >
            סוג אירוע
          </label>
          <select
            id="inquiry-event"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">בחרו (אופציונלי)</option>
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <NeedsDiscoveryStep
            value={customerNeed}
            onChange={setCustomerNeed}
            id="inquiry-need"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? "שולח..." : "שלחו בוואטסאפ"}
      </button>
    </form>
  );
}
