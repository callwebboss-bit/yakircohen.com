"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import LeadSubmitFallback from "@/components/forms/LeadSubmitFallback";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import {
  KIDS_BIRTHDAY_FORM_ID,
  KIDS_BIRTHDAY_PATH,
  KIDS_BIRTHDAY_SERVICE_LABEL,
  KIDS_BIRTHDAY_UTM_CAMPAIGN,
  type KidsBirthdayLimits,
} from "@/lib/data/kids-birthday";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { formatPhoneForDisplay, sanitizeLeadText } from "@/lib/form-validation";
import {
  KIDS_BIRTHDAY_FIELD_ORDER,
  buildKidsBirthdayLeadMessage,
  parseChildrenCount,
  validateKidsBirthdayLead,
} from "@/lib/kids-birthday-form";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";

/**
 * טופס הזמנה: תאריך ומספר ילדים (ושם וטלפון, כמו בשאר טפסי האולפן) ->
 * הודעת וואטסאפ מוכנה, ובמקביל ליד למייל הבעלים דרך useLeadSubmit. שם אירוע
 * GA חדש לא נוסף: generate_lead ו-lead_submit_failed נשלחים מ-lib/lead-email-notify.ts.
 *
 * בלי JS: הכפתור נעול עד שהעמוד נטען, כדי שלחיצה לא תשלח את הטופס כבקשה רגילה.
 * הקישור הישיר לוואטסאפ מתחת לטופס עובד גם בלי JS. לשדות אין name בכוונה,
 * כך שגם שליחה רגילה של הדפדפן לא תכניס שם וטלפון לכתובת.
 */

const FIELD_CLASS =
  "mt-1.5 block min-h-12 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red aria-invalid:border-red-600";

const subscribeNoop = () => () => {};

/** false בשרת ובהידרציה, true אחריה */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function limitsHint(limits: KidsBirthdayLimits): string | null {
  const { min, max } = limits;
  if (min !== null && max !== null) return `בין ${min} ל-${max} ילדים`;
  if (min !== null) return `מינימום ${min} ילדים`;
  if (max !== null) return `מקסימום ${max} ילדים`;
  return null;
}

const DIRECT_WHATSAPP_HREF = buildWhatsAppHref({
  text: `שלום, אני מעוניין/ת ב${KIDS_BIRTHDAY_SERVICE_LABEL}.\nתאריך מבוקש: \nמספר ילדים: `,
  utm_source: "website",
  utm_campaign: `${KIDS_BIRTHDAY_UTM_CAMPAIGN}_direct`,
  source: KIDS_BIRTHDAY_PATH,
});

export default function KidsBirthdayOrderForm({
  limits,
}: {
  limits: KidsBirthdayLimits;
}) {
  const uid = useId();
  const hydrated = useHydrated();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [children, setChildren] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: KIDS_BIRTHDAY_FORM_ID,
  });
  const {
    submit: leadSubmit,
    submitLead,
    retry,
    isSubmitting,
    isSuccess,
    successWaHref,
  } = useLeadSubmit();

  const ids = {
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    date: `${uid}-date`,
    children: `${uid}-children`,
  } as const;
  const hint = limitsHint(limits);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = attemptSubmit(
      () => validateKidsBirthdayLead({ name, phone, date, children }, limits),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : phone.trim();
        const cleanName = sanitizeLeadText(name, 60);
        const body = buildKidsBirthdayLeadMessage({
          name: cleanName,
          phone: displayPhone,
          date,
          children: parseChildrenCount(children) ?? 0,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: KIDS_BIRTHDAY_FORM_ID,
        });
        void submitLead(
          {
            formId: KIDS_BIRTHDAY_FORM_ID,
            subject: `ליד חדש - ${KIDS_BIRTHDAY_SERVICE_LABEL}`,
            body,
            website_verification: honeypot,
            name: cleanName,
            phone: displayPhone,
            eventDate: date,
            serviceType: "studio",
          },
          href,
        );
      },
    );

    setFieldErrors(errors ?? {});
    if (errors) {
      const firstInvalid = KIDS_BIRTHDAY_FIELD_ORDER.find((key) => errors[key]);
      if (firstInvalid) document.getElementById(ids[firstInvalid])?.focus();
    }
  }

  if (isSuccess) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-6 text-center sm:p-8"
      >
        <p className="text-lg font-semibold text-foreground">הפנייה נשלחה</p>
        <p className="mt-2 text-sm text-muted-foreground">
          פתחנו וואטסאפ עם הודעה מוכנה, עם התאריך ומספר הילדים.
        </p>
        {successWaHref ? (
          <a
            href={successWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
          >
            וואטסאפ לא נפתח? לחצו כאן
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <form
        onSubmit={handleSubmit}
        aria-label="טופס הזמנת יום הולדת לילדים"
        noValidate
      >
        <HoneypotField value={honeypot} onChange={setHoneypot} />
        <LeadFormAlert message={globalError} className="mb-4" />
        {leadSubmit.status === "failed" ? (
          <LeadSubmitFallback
            waHref={leadSubmit.waHref}
            onRetry={() => void retry()}
            className="mb-4"
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.name} className="block text-sm font-medium text-foreground">
              {FORM_MICROCOPY.nameLabel}
            </label>
            <input
              id={ids.name}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${ids.name}-error` : undefined}
              className={FIELD_CLASS}
            />
            {fieldErrors.name ? (
              <p id={`${ids.name}-error`} className="mt-1 text-sm text-red-700">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.phone} className="block text-sm font-medium text-foreground">
              {FORM_MICROCOPY.phoneLabel}
            </label>
            <input
              id={ids.phone}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={FORM_MICROCOPY.phonePlaceholder}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={
                fieldErrors.phone ? `${ids.phone}-error` : `${ids.phone}-hint`
              }
              className={cn(FIELD_CLASS, "text-start")}
            />
            {fieldErrors.phone ? (
              <p id={`${ids.phone}-error`} className="mt-1 text-sm text-red-700">
                {fieldErrors.phone}
              </p>
            ) : (
              <p id={`${ids.phone}-hint`} className="mt-1 text-sm text-muted-foreground">
                {FORM_MICROCOPY.phoneHint}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={ids.date} className="block text-sm font-medium text-foreground">
              תאריך מבוקש
            </label>
            <input
              id={ids.date}
              type="date"
              min={hydrated ? todayIso() : undefined}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.date)}
              aria-describedby={fieldErrors.date ? `${ids.date}-error` : undefined}
              className={FIELD_CLASS}
            />
            {fieldErrors.date ? (
              <p id={`${ids.date}-error`} className="mt-1 text-sm text-red-700">
                {fieldErrors.date}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.children} className="block text-sm font-medium text-foreground">
              מספר ילדים
            </label>
            <input
              id={ids.children}
              type="number"
              inputMode="numeric"
              min={limits.min ?? 1}
              max={limits.max ?? undefined}
              step={1}
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.children)}
              aria-describedby={
                fieldErrors.children
                  ? `${ids.children}-error`
                  : hint
                    ? `${ids.children}-hint`
                    : undefined
              }
              className={FIELD_CLASS}
            />
            {fieldErrors.children ? (
              <p id={`${ids.children}-error`} className="mt-1 text-sm text-red-700">
                {fieldErrors.children}
              </p>
            ) : hint ? (
              <p id={`${ids.children}-hint`} className="mt-1 text-sm text-muted-foreground">
                {hint}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!hydrated || isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
          >
            {isSubmitting ? "שולחים..." : "שליחה בוואטסאפ"}
          </button>
          <p className="text-sm text-muted-foreground">
            הטופס פותח וואטסאפ עם הודעה מוכנה.
          </p>
        </div>
      </form>

      <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
        אפשר גם לכתוב ישירות:{" "}
        <a
          href={DIRECT_WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center font-semibold text-brand-red hover:underline"
        >
          לפתוח וואטסאפ
        </a>
      </p>
    </div>
  );
}
