"use client";

import { useRef, useState } from "react";
import FieldError, { FocusedStatus } from "@/components/forms/FieldError";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import LeadSubmitFallback from "@/components/forms/LeadSubmitFallback";
import { describedBy, fieldErrorId } from "@/lib/field-error";
import { sanitizeLeadText, type ValidationResult } from "@/lib/form-validation";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import { buildClosingMessage } from "@/lib/whatsapp-closing";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HEBREW_LEVEL_OPTIONS = [
  { value: "beginner", label: "מתחיל" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדם" },
] as const;

const LOCATION_OPTIONS = [
  { value: "modiin", label: "מודיעין-מכבים-רעות (פרונטלי)" },
  { value: "client_home", label: "בבית הלקוח - מרכז" },
  { value: "zoom", label: "זום / אונליין" },
] as const;

const TIME_SLOT_OPTIONS = [
  { value: "morning", label: "בוקר" },
  { value: "afternoon", label: "צהריים" },
  { value: "evening", label: "ערב" },
] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  hebrewLevel: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  goal: string;
  additionalInfo: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  hebrewLevel: "",
  preferredDate: "",
  preferredTime: "",
  location: "",
  goal: "",
  additionalInfo: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

const selectClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

const textareaClass =
  "w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-foreground">
      {children}
      {required && (
        <span className="me-1 text-brand-red" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

export default function AcademyTrialForm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "academy_trial_lesson",
  });
  const { submitLead, isSubmitting, isSuccess, submit: leadSubmit, retry: retryLead } = useLeadSubmit();

  const today = new Date().toISOString().split("T")[0];

  const validate = (): ValidationResult => {
    const errs: Record<string, string> = {};

    const name = form.name.trim();
    if (name.length < 2) errs.name = "שם חייב להכיל לפחות 2 תווים";
    else if (name.length > 60) errs.name = "שם ארוך מדי";

    const phone = form.phone.replace(/[\s\-().]/g, "");
    if (!phone) errs.phone = "יש להזין מספר טלפון";
    else if (!/^0\d{8,9}$/.test(phone)) errs.phone = "מספר טלפון לא תקין (לדוגמה: 054-1234567)";

    const email = form.email.trim();
    if (!email) errs.email = "יש להזין כתובת אימייל";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = "כתובת אימייל לא תקינה";

    if (!form.hebrewLevel) errs.hebrewLevel = "יש לבחור רמת עברית";
    if (!form.preferredDate) errs.preferredDate = "יש לבחור תאריך מועדף";
    else if (form.preferredDate < today) errs.preferredDate = "יש לבחור תאריך עתידי";
    if (!form.preferredTime) errs.preferredTime = "יש לבחור שעות שנוח";
    if (!form.location) errs.location = "יש לבחור מיקום פגישה";

    if (Object.keys(errs).length > 0) return { ok: false, errors: errs };
    return { ok: true };
  };

  const handleSubmit = () => {
    const fieldErrs = attemptSubmit(validate, () => {
      const levelLabel =
        HEBREW_LEVEL_OPTIONS.find((o) => o.value === form.hebrewLevel)?.label ?? form.hebrewLevel;
      const locationLabel =
        LOCATION_OPTIONS.find((o) => o.value === form.location)?.label ?? form.location;
      const timeSlotLabel =
        TIME_SLOT_OPTIONS.find((o) => o.value === form.preferredTime)?.label ??
        form.preferredTime;

      const message = buildClosingMessage({
        serviceLabel: "שיעור ניסיון עברית פרטי",
        packageLabel: "שיעור ניסיון",
        contact: {
          name: sanitizeLeadText(form.name.trim(), 60),
          phone: form.phone.trim(),
        },
        intent: "start_now",
        priceExVat: 500,
        summaryLines: [
          { label: "אימייל", value: form.email.trim() },
          { label: "רמת עברית", value: levelLabel },
          {
            label: "מועד מועדף",
            value: `${form.preferredDate}, שעות שנוח: ${timeSlotLabel}`,
          },
          { label: "מיקום", value: locationLabel },
          ...(form.goal.trim()
            ? [
                {
                  label: "מטרת הלמוד",
                  value: sanitizeLeadText(form.goal.trim(), 300),
                },
              ]
            : []),
          ...(form.additionalInfo.trim()
            ? [
                {
                  label: "מידע נוסף",
                  value: sanitizeLeadText(form.additionalInfo.trim(), 300),
                },
              ]
            : []),
          ...(form.notes.trim()
            ? [{ label: "הערות", value: sanitizeLeadText(form.notes.trim(), 300) }]
            : []),
        ],
        source: "/academy/ulpan",
        closerServiceId: "academy",
        ycForm: "academy_trial_lesson",
        ycIntent: "start_now",
      });

      const href = buildWhatsAppHref({
        text: message,
        utm_source: "website",
        utm_campaign: "academy_trial_lesson",
      });
      void submitLead(
        {
          formId: "academy_trial_lesson",
          subject: `בקשה לשיעור ניסיון עברית - ${form.name.trim()}`,
          body: message,
          website_verification: honeypot,
          name: form.name.trim(),
          phone: form.phone.trim(),
          crossSell: { bookCategory: "academy" },
        },
        href,
        "start_now",
        { leadCategory: "academy" },
      );
    });

    setErrors(fieldErrs ?? {});
    /* פוקוס לשדה השגוי הראשון (והגלילה אליו כמו קודם), והשגיאה מוקראת דרך
       aria-describedby. לכן אין role="alert" בהודעות (F-11, 7.10.2026) */
    if (fieldErrs && Object.keys(fieldErrs).length > 0) {
      scrollAndHighlightFirstError(rootRef.current);
    }
  };

  if (isSuccess) {
    return (
      <FocusedStatus className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">תודה על הפנייה</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {`נצור איתך קשר בהקדם כדי לאשר את המועד ולשלוח פרטי תשלום לשיעור הניסיון ב-500 ש"ח.`}
        </p>
      </FocusedStatus>
    );
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <LeadFormAlert message={globalError} />
      {leadSubmit.status === "failed" ? (
        <LeadSubmitFallback
          waHref={leadSubmit.waHref}
          onRetry={() => void retryLead()}
          className="mt-3"
        />
      ) : null}
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      {/* Required fields - grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="trial-name" required>
            {FORM_MICROCOPY.nameLabel}
          </Label>
          <input
            id="trial-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder={FORM_MICROCOPY.namePlaceholder}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy(errors.name && fieldErrorId("trial-name"))}
            className={cn(inputClass, errors.name && "border-red-400")}
          />
          <FieldError id={fieldErrorId("trial-name")} message={errors.name} />
        </div>

        <div>
          <Label htmlFor="trial-phone" required>
            {FORM_MICROCOPY.phoneLabel}
          </Label>
          <input
            id="trial-phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder={FORM_MICROCOPY.phonePlaceholder}
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(
              "trial-phone-hint",
              errors.phone && fieldErrorId("trial-phone"),
            )}
            className={cn(inputClass, errors.phone && "border-red-400")}
          />
          <p id="trial-phone-hint" className="mt-1 text-xs text-muted-foreground">
            {FORM_MICROCOPY.phoneHint}
          </p>
          <FieldError id={fieldErrorId("trial-phone")} message={errors.phone} />
        </div>

        <div>
          <Label htmlFor="trial-email" required>
            אימייל
          </Label>
          <input
            id="trial-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(errors.email && fieldErrorId("trial-email"))}
            className={cn(inputClass, errors.email && "border-red-400")}
          />
          <FieldError id={fieldErrorId("trial-email")} message={errors.email} />
        </div>

        <div>
          <Label htmlFor="trial-level" required>
            רמת עברית נוכחית
          </Label>
          <select
            id="trial-level"
            value={form.hebrewLevel}
            onChange={(e) => setForm((p) => ({ ...p, hebrewLevel: e.target.value }))}
            aria-required="true"
            aria-invalid={Boolean(errors.hebrewLevel)}
            aria-describedby={describedBy(errors.hebrewLevel && fieldErrorId("trial-level"))}
            className={cn(selectClass, errors.hebrewLevel && "border-red-400")}
          >
            <option value="">בחרו רמה...</option>
            {HEBREW_LEVEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError id={fieldErrorId("trial-level")} message={errors.hebrewLevel} />
        </div>

        <div>
          <Label htmlFor="trial-date" required>
            תאריך מועדף לשיעור
          </Label>
          <input
            id="trial-date"
            type="date"
            min={today}
            value={form.preferredDate}
            onChange={(e) => setForm((p) => ({ ...p, preferredDate: e.target.value }))}
            aria-required="true"
            aria-invalid={Boolean(errors.preferredDate)}
            aria-describedby={describedBy(errors.preferredDate && fieldErrorId("trial-date"))}
            className={cn(inputClass, errors.preferredDate && "border-red-400")}
          />
          <FieldError id={fieldErrorId("trial-date")} message={errors.preferredDate} />
        </div>

        <div>
          <Label htmlFor="trial-time" required>
            שעות שנוח
          </Label>
          <select
            id="trial-time"
            value={form.preferredTime}
            onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))}
            aria-required="true"
            aria-invalid={Boolean(errors.preferredTime)}
            aria-describedby={describedBy(errors.preferredTime && fieldErrorId("trial-time"))}
            className={cn(selectClass, errors.preferredTime && "border-red-400")}
          >
            <option value="">בוקר, צהריים, ערב</option>
            {TIME_SLOT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError id={fieldErrorId("trial-time")} message={errors.preferredTime} />
        </div>
      </div>

      <div>
        <Label htmlFor="trial-location" required>
          מיקום פגישה מועדף
        </Label>
        <select
          id="trial-location"
          value={form.location}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          aria-required="true"
          aria-invalid={Boolean(errors.location)}
          aria-describedby={describedBy(errors.location && fieldErrorId("trial-location"))}
          className={cn(selectClass, errors.location && "border-red-400")}
        >
          <option value="">בחרו מיקום...</option>
          {LOCATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError id={fieldErrorId("trial-location")} message={errors.location} />
      </div>

      {/* Optional fields */}
      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">השדות הבאים אופציונליים - ניתן לדלג</p>

        <div>
          <Label htmlFor="trial-goal">מה המטרה שלך מלימוד עברית</Label>
          <textarea
            id="trial-goal"
            rows={3}
            value={form.goal}
            onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}
            placeholder="לדוגמה: דיבור יומיומי, עבודה, לימודים, הכנה לבגרות, קהילה..."
            className={textareaClass}
          />
        </div>

        <div>
          <Label htmlFor="trial-additional">האם יש משהו נוסף שכדאי לנו לדעת לפני השיעור</Label>
          <textarea
            id="trial-additional"
            rows={3}
            value={form.additionalInfo}
            onChange={(e) => setForm((p) => ({ ...p, additionalInfo: e.target.value }))}
            placeholder="כל מידע שיעזור לנו להכין שיעור מותאם עבורך..."
            className={textareaClass}
          />
        </div>

        <div>
          <Label htmlFor="trial-notes">הערות נוספות</Label>
          <textarea
            id="trial-notes"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className={textareaClass}
          />
        </div>
      </div>

      <p className="rounded-xl bg-muted-foreground/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        עצם מילוי הטופס אינו מהווה הרשמה סופית. לאחר השלמה, ניצור איתך קשר כדי לאשר את המועד
        ולשלוח פרטי תשלום.
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        {isSubmitting ? "שולח..." : `שלח בקשה לשיעור ניסיון`}
      </button>
    </div>
  );
}
