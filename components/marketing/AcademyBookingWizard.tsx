"use client";

import { useCallback, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import BookingPhoneInput from "@/components/booking/BookingPhoneInput";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookPriceDual from "@/components/booking/BookPriceDual";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { bookFieldClass } from "@/lib/book-form-ui";
import { buildBookingWhatsAppBody, readUtmSource } from "@/lib/booking-messages";
import { PRIVATE_SESSION_PLANS } from "@/lib/data/academy-private-sessions";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const TOPICS = [
  "פיתוח קול",
  "תקליטנות (DJ)",
  "הפקה מוזיקלית",
  "פסנתר",
  "גיטרה",
  "אחר",
] as const;

type AcademyBookingWizardProps = {
  initialEmotionalLabel?: string | null;
  routeId?: string | null;
};

export default function AcademyBookingWizard({
  initialEmotionalLabel,
  routeId = null,
}: AcademyBookingWizardProps) {
  const [planId, setPlanId] = useState(PRIVATE_SESSION_PLANS[1]?.id ?? PRIVATE_SESSION_PLANS[0].id);
  const [topic, setTopic] = useState(initialEmotionalLabel ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const guard = useLeadFormGuard({ formId: "academy_booking" });
  const { honeypot, setHoneypot, globalError, attemptSubmit, resetGuardClock } = guard;

  const {
    submitLead,
    resetSubmit,
    isSuccess,
    isSubmitting,
    successWaHref,
    successIntent,
  } = useLeadSubmit();

  const plan = PRIVATE_SESSION_PLANS.find((p) => p.id === planId) ?? PRIVATE_SESSION_PLANS[0];

  const messageBody = buildBookingWhatsAppBody({
    intent: "continue_chat",
    serviceLabel: `שיעור פרטי - ${plan.name}`,
    summaryLines: [
      { label: "משך", value: plan.duration },
      ...(topic ? [{ label: "תחום", value: sanitizeLeadText(topic, 80) }] : []),
    ],
    contact: {
      name: sanitizeLeadText(name, 60) || "[שם]",
      phone: phone ? formatPhoneForDisplay(phone) : "[טלפון]",
    },
    priceExVat: plan.price,
    totalEstimate: withVat(plan.price),
    utmSource: readUtmSource(),
    bookCategory: "academy",
    includeTrustFooter: true,
    ycForm: "academy_booking",
  });

  const scrollToFirstError = useCallback((errs: Record<string, string>) => {
    if (Object.keys(errs).length === 0) return;
    setTimeout(() => {
      document
        .querySelector("[data-field-error]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  const mergeErrors = useCallback(
    (patch: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
      setErrors((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch }));
    },
    [],
  );

  const handleAction = useCallback(
    (intent: "continue_chat" | "start_now") => {
      if (!termsAccepted) {
        const termsErr = { terms: "יש לאשר את התנאים לפני שליחה" };
        setErrors(termsErr);
        scrollToFirstError(termsErr);
        return;
      }

      const fieldErrs = attemptSubmit(
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
          const body = buildBookingWhatsAppBody({
            intent,
            serviceLabel: `שיעור פרטי - ${plan.name}`,
            summaryLines: [
              { label: "משך", value: plan.duration },
              ...(topic ? [{ label: "תחום", value: sanitizeLeadText(topic, 80) }] : []),
            ],
            contact: { name: sanitizeLeadText(name, 60), phone: displayPhone },
            priceExVat: plan.price,
            totalEstimate: withVat(plan.price),
            utmSource: readUtmSource(),
            bookCategory: "academy",
            includeTrustFooter: true,
            ycForm: "academy_booking",
          });
          const href = buildWhatsAppHref({
            text: body,
            utm_source: "website",
            utm_campaign: plan.utmCampaign,
          });

          void submitLead(
            {
              formId: "academy_booking",
              subject: "ליד חדש - שיעור פרטי באקדמיה",
              body,
              name: sanitizeLeadText(name, 60),
              phone: displayPhone,
              crossSell: { bookCategory: "academy", routeId },
            },
            href,
            intent,
            { leadCategory: "academy" },
          );
        },
      );

      const errs = fieldErrs ?? {};
      setErrors(errs);
      scrollToFirstError(errs);
    },
    [
      attemptSubmit,
      name,
      phone,
      plan,
      routeId,
      scrollToFirstError,
      submitLead,
      termsAccepted,
      topic,
    ],
  );

  const handleNewBooking = useCallback(() => {
    resetSubmit();
    resetGuardClock();
    setName("");
    setPhone("");
    setErrors({});
  }, [resetGuardClock, resetSubmit]);

  if (isSuccess && successWaHref) {
    return (
      <BookingSuccessPanel
        intent={successIntent}
        whatsappHref={successWaHref}
        bookCategory="academy"
        routeId={routeId}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {PRIVATE_SESSION_PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlanId(p.id)}
            className={cn(
              "rounded-xl border p-4 text-start transition-colors",
              planId === p.id
                ? "border-brand-red bg-brand-red/5"
                : "border-border/60 hover:border-brand-red/30",
            )}
            aria-pressed={planId === p.id}
          >
            <p className="text-sm font-semibold">{p.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
            <div className="mt-2">
              <BookPriceDual exVat={p.price} size="sm" />
            </div>
          </button>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">במה תרצו להתמקד?</label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                topic === t ? "border-brand-red bg-brand-red/10 text-brand-red" : "border-border/60",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <BookWhatHappensNext />
      <BookTrustBadges badges={[{ icon: "🅿️", label: "חנייה חופשית" }, { icon: "🌙", label: "שעות ערב גמישות" }]} />

      <div className="space-y-3">
        <div>
          <label htmlFor="academy-name" className="mb-1.5 block text-xs font-semibold">
            שם מלא *
          </label>
          <input
            id="academy-name"
            autoComplete="name"
            className={cn(bookFieldClass, errors.name && "border-red-400")}
            placeholder="שם מלא"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) mergeErrors({ name: "" });
            }}
            aria-invalid={!!errors.name}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-500" data-field-error="">
              {errors.name}
            </p>
          ) : null}
        </div>
        <BookingPhoneInput
          id="academy-phone"
          value={phone}
          required
          error={errors.phone}
          onChange={(value) => {
            setPhone(value);
            if (errors.phone) mergeErrors({ phone: "" });
          }}
          onBlurValidate={(msg) => {
            mergeErrors((p) => {
              const next = { ...p };
              if (msg) next.phone = msg;
              else delete next.phone;
              return next;
            });
          }}
        />
        <p className="text-xs text-muted-foreground">
          נשלח טיפים קלים לחזרות בבית כדי שתגיעו מוכנים ורגועים
        </p>
      </div>

      <BookingWhatsAppPreview messageBody={messageBody} />

      <BookingApprovals
        variant="light"
        termsAccepted={termsAccepted}
        onTermsChange={(v) => {
          setTermsAccepted(v);
          if (v && errors.terms) mergeErrors({ terms: "" });
        }}
        termsError={errors.terms}
      />

      <LeadFormAlert message={globalError} />
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <BookingSummaryActions
        continueWhatsApp={{ onClick: () => handleAction("continue_chat"), label: "נמשיך בוואטסאפ" }}
        startNow={{ onClick: () => handleAction("start_now"), label: "התחל תהליך והזמן עכשיו" }}
        disabled={!termsAccepted || isSubmitting}
      />
    </div>
  );
}
