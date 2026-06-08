"use client";

import { useState } from "react";
import PhoneInputField from "@/components/forms/PhoneInputField";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SINGER_CLOSING_CTA } from "@/lib/data/singer-amplification-page";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

type SingerClosingLeadSectionProps = {
  whatsappHref: string;
};

export default function SingerClosingLeadSection({
  whatsappHref,
}: SingerClosingLeadSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "singer_amplification_callback",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrs = attemptSubmit(
      () =>
        validateBookingLead({
          name,
          phone,
          date: "",
          time: "",
          location: "",
          notes,
          requireLocation: false,
          requireDate: false,
          requireTime: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : phone.trim();
        const body = [
          "שלום, מעוניין/ת בייעוץ על הגברה לזמר/ה:",
          `שם: ${sanitizeLeadText(name, 60)}`,
          `טלפון: ${displayPhone}`,
          notes.trim()
            ? `פרטים: ${sanitizeLeadText(notes, 500)}`
            : null,
        ]
          .filter(Boolean)
          .join("\n");
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "singer_amplification_closing_form",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "singer_amplification_callback",
          subject: "פנייה מעמוד הגברה לזמרים",
          body,
          name,
          phone: displayPhone,
        });
        setSubmitted(true);
      },
    );
    setErrors(fieldErrs ?? {});
  };

  return (
    <section
      className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-10 sm:px-10"
      aria-labelledby="singer-closing-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="singer-closing-heading"
          className="text-xl font-semibold text-foreground sm:text-2xl"
        >
          {SINGER_CLOSING_CTA.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {SINGER_CLOSING_CTA.body}
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">
            הכי מהיר - שיחת ייעוץ ללא התחייבות
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            בדיקת התאמה מהירה בוואטסאפ
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-background p-6"
          noValidate
        >
          <p className="mb-4 text-sm font-semibold text-foreground">
            או השאירו פרטים - נחזור אליכם
          </p>
          {submitted ? (
            <p className="text-sm text-brand-red">
              תודה! נפתח וואטסאפ - אם לא, ניצור קשר בקרוב.
            </p>
          ) : (
            <>
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <LeadFormAlert message={globalError} />
              <div className="space-y-3">
                <div>
                  <label htmlFor="sg-cb-name" className="mb-1 block text-xs font-semibold">
                    שם *
                  </label>
                  <input
                    id="sg-cb-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(inputClass, errors.name && "border-red-400")}
                  />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  ) : null}
                </div>
                <PhoneInputField
                  id="sg-cb-phone"
                  value={phone}
                  onChange={setPhone}
                  error={errors.phone}
                />
                <div>
                  <label htmlFor="sg-cb-notes" className="mb-1 block text-xs font-semibold">
                    סוג אירוע / תאריך (אופציונלי)
                  </label>
                  <textarea
                    id="sg-cb-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={cn(inputClass, "resize-none")}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  שליחה ופתיחת וואטסאפ
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
