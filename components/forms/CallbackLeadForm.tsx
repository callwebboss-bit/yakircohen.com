"use client";

import { useId, useState, type FormEvent } from "react";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

export type CallbackLeadFormProps = {
  heading?: string;
  description?: string;
  successHeading?: string;
  successDescription?: string;
  utmCampaign?: string;
  serviceOptions?: readonly string[];
  formLabel?: string;
  className?: string;
  source?: string;
};

const DEFAULT_SERVICE_OPTIONS = [
  "הקלטה באולפן",
  "פודקאסט",
  "אירוע / DJ",
  "קריינות",
  "וידאו / צילום",
  "עדיין לא בטוח/ה",
] as const;

export default function CallbackLeadForm({
  heading = "מעדיפים שנחזור אליכם?",
  description = "השאירו פרטים ונחזור אליכם תוך שעה בשעות הפעילות. ללא התחייבות.",
  successHeading = "תודה! מיד נחזור אליכם.",
  successDescription = "פתחנו שיח בוואטסאפ - אפשר לצרף גם קובץ לדוגמה אם יש.",
  utmCampaign = "callback_lead_form",
  serviceOptions = DEFAULT_SERVICE_OPTIONS,
  formLabel = "טופס יצירת קשר",
  className = "",
  source = "/contact",
}: CallbackLeadFormProps) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const phoneId = `${formId}-phone`;
  const serviceId = `${formId}-service`;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [customerNeed, setCustomerNeed] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const lines = buildSimpleLeadMessage({
      contact: { name: name.trim(), phone: phone.trim() },
      serviceLabel: service || "פנייה מהאתר",
      customerNeed: customerNeed.trim() || null,
      source,
      closerServiceId: "recording",
      ycForm: "callback_lead_form",
    });

    const href = buildWhatsAppHref({
      text: lines,
      utm_source: "website",
      utm_campaign: utmCampaign,
    });

    window.open(href, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className={`rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center ${className}`.trim()}
      >
        <p className="text-lg font-semibold text-foreground">{successHeading}</p>
        <p className="mt-2 text-sm text-muted-foreground">{successDescription}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-border bg-surface p-6 sm:p-8 ${className}`.trim()}
      aria-label={formLabel}
      noValidate
    >
      <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
            שם מלא <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id={nameId}
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
          <label htmlFor={phoneId} className="block text-sm font-medium text-foreground">
            טלפון <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id={phoneId}
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

        {serviceOptions.length > 0 ? (
          <div className="sm:col-span-2">
            <label htmlFor={serviceId} className="block text-sm font-medium text-foreground">
              סוג שירות
            </label>
            <select
              id={serviceId}
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="">בחרו שירות (אופציונלי)</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <NeedsDiscoveryStep
            value={customerNeed}
            onChange={setCustomerNeed}
            id={`${formId}-need`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          שלחו פרטים
        </button>
        <p className="text-xs text-muted-foreground">
          הפרטים ישמשו אך ורק ליצירת קשר בנוגע לשירות המבוקש.
        </p>
      </div>
    </form>
  );
}
