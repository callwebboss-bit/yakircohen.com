"use client";

import { useState, type FormEvent } from "react";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import { getExVat } from "@/lib/data/pricing-catalog";
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

export default function RecordingSongInquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [customerNeed, setCustomerNeed] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const summaryLines = eventType
      ? [{ label: "סוג אירוע", value: eventType }]
      : [];

    const lines = buildSimpleLeadMessage({
      contact: { name: name.trim(), phone: phone.trim() },
      serviceLabel: "הקלטת שיר באולפן",
      customerNeed: customerNeed.trim() || null,
      priceExVat: getExVat("song_package"),
      summaryLines,
      source: "/studio/recording-song-modiin",
      closerServiceId: "recording",
      ycForm: "recording_song_inquiry_form",
    });

    const href = buildWhatsAppHref({
      text: lines,
      utm_source: "website",
      utm_campaign: "recording_song_inquiry_form",
    });

    window.open(href, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
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
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ישראל ישראלי"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
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
            required
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-0000000"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
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
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light sm:w-auto"
      >
        שלחו בוואטסאפ
      </button>
    </form>
  );
}
