"use client";

import { useState, type FormEvent } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import {
  RINGTONE_PAGE_PATH,
  RINGTONE_PRICE_NIS,
} from "@/lib/data/funny-ringtone-page";
import { formatNis } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

const CONTEXT_OPTIONS = [
  "יום הולדת",
  "הפתעה לחבר/ה",
  "אירוע מיוחד",
  "מתנה משפחתית",
  "אחר",
] as const;

const FORM_ID = "funny_ringtone_order_form";

export default function FunnyRingtoneOrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
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
          notes: recipient,
          requireLocation: false,
          requireDate: false,
          requireTime: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : phone.trim();
        const summaryLines = [
          ...(recipient.trim()
            ? [{ label: "למי המתנה", value: sanitizeLeadText(recipient, 80) }]
            : []),
          ...(context ? [{ label: "סוג מתנה", value: context }] : []),
          { label: "מחיר מבצע", value: formatNis(RINGTONE_PRICE_NIS) },
        ];
        const body = buildSimpleLeadMessage({
          contact: {
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
          },
          serviceLabel: "רינגטון מצחיק",
          summaryLines,
          source: RINGTONE_PAGE_PATH,
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
            subject: "ליד חדש - רינגטון מצחיק",
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
      <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">
          תודה! מיד נחזור אליכם.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          פתחנו שיח בוואטסאפ - ספרו לנו על מי שמקבל את הרינגטון ואיזה סגנון מצחיק
          מתאים.
        </p>
      </div>
    );
  }

  return (
    <form
      id="ringtone-order-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8"
      aria-label="טופס הזמנת רינגטון מצחיק"
      noValidate
    >
      <h2 className="font-serif text-xl font-semibold text-foreground">
        הזמנת רינגטון - {formatNis(RINGTONE_PRICE_NIS)} מבצע
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        השאירו פרטים ונחזור אליכם תוך שעה. בלי התחייבות - רק כדי להבין את
        הרעיון.
      </p>

      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <LeadFormAlert message={globalError} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ringtone-name"
            className="block text-sm font-medium text-foreground"
          >
            {FORM_MICROCOPY.nameLabel} <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="ringtone-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={FORM_MICROCOPY.namePlaceholder}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="ringtone-phone"
            className="block text-sm font-medium text-foreground"
          >
            {FORM_MICROCOPY.phoneLabel} <span className="text-brand-red" aria-hidden>*</span>
          </label>
          <input
            id="ringtone-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={FORM_MICROCOPY.phonePlaceholder}
            aria-describedby="ringtone-phone-hint"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          ) : (
            <p id="ringtone-phone-hint" className="mt-1 text-xs text-muted-foreground">
              {FORM_MICROCOPY.phoneHint}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ringtone-recipient"
            className="block text-sm font-medium text-foreground"
          >
            למי המתנה?
          </label>
          <input
            id="ringtone-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="שם החבר/ה או בן/בת הזוג"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div>
          <label
            htmlFor="ringtone-context"
            className="block text-sm font-medium text-foreground"
          >
            סוג מתנה
          </label>
          <select
            id="ringtone-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          >
            <option value="">בחרו (אופציונלי)</option>
            {CONTEXT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-50"
        >
          {isSubmitting ? "שולח..." : "שלחו הזמנה ←"}
        </button>
        <p className="text-xs text-muted-foreground">
          הטופס פותח שיח בוואטסאפ - נמשיך משם את כל הפרטים
        </p>
      </div>
    </form>
  );
}
