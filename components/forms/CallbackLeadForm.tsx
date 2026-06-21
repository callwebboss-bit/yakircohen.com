"use client";

import { useId, useState, type FormEvent } from "react";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import Button from "@/components/ui/Button";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red";

export type CallbackLeadFormProps = {
  heading?: string;
  description?: string;
  successHeading?: string;
  successDescription?: string;
  utmCampaign?: string;
  serviceOptions?: readonly string[];
  formLabel?: string;
  formId?: string;
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
  formId = "callback_lead_form",
  className = "",
  source = "/contact",
}: CallbackLeadFormProps) {
  const fieldIds = useId();
  const nameId = `${fieldIds}-name`;
  const phoneId = `${fieldIds}-phone`;
  const serviceId = `${fieldIds}-service`;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [customerNeed, setCustomerNeed] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId,
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
        const body = buildSimpleLeadMessage({
          contact: {
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
          },
          serviceLabel: service || "פנייה מהאתר",
          customerNeed: customerNeed.trim()
            ? sanitizeLeadText(customerNeed, 500)
            : null,
          source,
          closerServiceId: "recording",
          ycForm: formId,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: utmCampaign,
        });
        void submitLead(
          {
            formId,
            subject: "ליד חדש - בקשת חזרה",
            body,
            website_verification: honeypot,
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
          },
          href,
        );
      },
    );

    setFieldErrors(errs ?? {});
  }

  if (isSuccess) {
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

      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <LeadFormAlert message={globalError} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
            {FORM_MICROCOPY.nameLabel} <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={FORM_MICROCOPY.namePlaceholder}
            className={fieldClass}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-required="true"
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={phoneId} className="block text-sm font-medium text-foreground">
            {FORM_MICROCOPY.phoneLabel} <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id={phoneId}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            required
            minLength={9}
            maxLength={15}
            pattern="[\d\s\-\+\(\)]+"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={FORM_MICROCOPY.phonePlaceholder}
            className={fieldClass}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={`${phoneId}-hint`}
            aria-required="true"
          />
          <p id={`${phoneId}-hint`} className="mt-1 text-xs text-muted-foreground">
            {FORM_MICROCOPY.phoneHint}
          </p>
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          ) : null}
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
              className={fieldClass}
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
            id={`${fieldIds}-need`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="rounded-xl px-7" disabled={isSubmitting}>
          {isSubmitting ? "שולח..." : "שלחו פרטים"}
        </Button>
        <p className="text-xs text-muted-foreground">
          הפרטים ישמשו אך ורק ליצירת קשר בנוגע לשירות המבוקש.
        </p>
      </div>
    </form>
  );
}
