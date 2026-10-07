"use client";

import { useId, useState, type FormEvent } from "react";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import FieldError, { FocusedStatus } from "@/components/forms/FieldError";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import Button from "@/components/ui/Button";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import LeadSubmitFallback from "@/components/forms/LeadSubmitFallback";
import { formatPhoneForDisplay, validateBookingLead } from "@/lib/form-validation";
import { describedBy, fieldErrorId } from "@/lib/field-error";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import { CALLBACK_SUCCESS_COPY } from "@/lib/data/conversion-copy";
import {
  buildCallbackLead,
  CALLBACK_DEFAULT_SERVICE_OPTIONS,
  CALLBACK_LEAD_FORM_ID,
  type CallbackPageContext,
  type CallbackServiceOption,
} from "@/lib/leads/callback-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red";

export type CallbackLeadFormProps = {
  heading?: string;
  description?: string;
  successHeading?: string;
  successDescription?: string;
  utmCampaign?: string;
  /** כל אפשרות נושאת קטגוריה, כדי שהליד יגיע לבעלים עם השירות שנבחר */
  serviceOptions?: readonly CallbackServiceOption[];
  /** על מה העמוד: לנושא המייל, וכשהלקוח לא בחר שירות */
  serviceContext?: CallbackPageContext;
  formLabel?: string;
  formId?: string;
  className?: string;
  /** בלי ערך: הנתיב של העמוד שבו הטופס נשלח */
  source?: string;
};

export default function CallbackLeadForm({
  heading = "מעדיפים שנחזור אליכם?",
  description = "השאירו פרטים ונחזור אליכם בשעות הפעילות. מענה אנושי, ללא התחייבות.",
  successHeading = CALLBACK_SUCCESS_COPY.title,
  successDescription = CALLBACK_SUCCESS_COPY.body,
  utmCampaign = "callback_lead_form",
  serviceOptions = CALLBACK_DEFAULT_SERVICE_OPTIONS,
  serviceContext,
  formLabel = "טופס יצירת קשר",
  formId = CALLBACK_LEAD_FORM_ID,
  className = "",
  source,
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
  const {
    submitLead,
    isSuccess,
    isSubmitting,
    successWaHref,
    submit: leadSubmit,
    retry: retryLead,
  } = useLeadSubmit();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

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
        /* קודם: service=recording, מקור "/contact" ונושא קבוע בכל עמוד ובכל
           בחירה, והבעלים לא ידע מה הלקוח רוצה. עכשיו השירות שנבחר והנתיב
           האמיתי. lib/leads/callback-lead.ts */
        const lead = buildCallbackLead({
          formId,
          name,
          phone: displayPhone,
          selectedService: service,
          customerNeed,
          options: serviceOptions,
          context: serviceContext,
          sourcePath: source ?? window.location.pathname,
          honeypot,
        });
        const href = buildWhatsAppHref({
          text: lead.body,
          utm_source: "website",
          utm_campaign: utmCampaign,
        });
        void submitLead(
          lead.payload,
          href,
          "continue_chat",
          /* "נחזור אליכם" לא פותח וואטסאפ. קודם הטופס דחף את הגולש לשלוח
             הודעה בעצמו, בניגוד למה שהבטיח. הקישור נשאר כאפשרות במסך ההצלחה. LF-11 */
          { whatsapp: "none" },
        );
      },
    );

    setFieldErrors(errs ?? {});
    /* פוקוס לשדה השגוי הראשון, והשגיאה מוקראת דרך aria-describedby (F-11) */
    if (errs && Object.keys(errs).length > 0) scrollAndHighlightFirstError(formEl);
  }

  if (isSuccess) {
    return (
      <FocusedStatus
        className={`rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center ${className}`.trim()}
      >
        <p className="text-lg font-semibold text-foreground">{successHeading}</p>
        <p className="mt-2 text-sm text-muted-foreground">{successDescription}</p>
        {successWaHref ? (
          <a
            href={successWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {CALLBACK_SUCCESS_COPY.whatsappOptional}
          </a>
        ) : null}
      </FocusedStatus>
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
      {leadSubmit.status === "failed" ? (
        <LeadSubmitFallback
          waHref={leadSubmit.waHref}
          onRetry={() => void retryLead()}
          className="mt-4"
        />
      ) : null}

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
            aria-describedby={describedBy(fieldErrors.name && fieldErrorId(nameId))}
            aria-required="true"
          />
          <FieldError id={fieldErrorId(nameId)} message={fieldErrors.name} />
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
            aria-describedby={describedBy(`${phoneId}-hint`, fieldErrors.phone && fieldErrorId(phoneId))}
            aria-required="true"
          />
          <p id={`${phoneId}-hint`} className="mt-1 text-xs text-muted-foreground">
            {FORM_MICROCOPY.phoneHint}
          </p>
          <FieldError id={fieldErrorId(phoneId)} message={fieldErrors.phone} />
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
                <option key={opt.label} value={opt.label}>
                  {opt.label}
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
            errorId={fieldErrors.notes ? fieldErrorId(`${fieldIds}-need`) : undefined}
          />
          <FieldError id={fieldErrorId(`${fieldIds}-need`)} message={fieldErrors.notes} />
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
