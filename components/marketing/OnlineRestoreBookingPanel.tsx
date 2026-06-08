"use client";

import { useState } from "react";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookPriceDual from "@/components/booking/BookPriceDual";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { buildBookingWhatsAppBody, readUtmSource } from "@/lib/booking-messages";
import { getExVat } from "@/lib/data/pricing-catalog";
import { VOCAL_FIX_PROCESS_STEPS } from "@/lib/data/online-vocal-fix-page";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const BASIC_EX_VAT = getExVat("damaged_recording_rescue");

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

type OnlineRestoreBookingPanelProps = {
  initialEmotionalLabel?: string | null;
};

export default function OnlineRestoreBookingPanel({
  initialEmotionalLabel,
}: OnlineRestoreBookingPanelProps) {
  const [issue, setIssue] = useState(initialEmotionalLabel ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [lastHref, setLastHref] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "online_restore_booking",
  });

  const feasibilityHref = buildWhatsAppHref({
    text: "שלום, אשמח לבדיקת היתכנות חינם לשחזור סאונד.\nאצרף קטע של כ-30 שניות מהקובץ.\nמה שחסר לי: לדעת אם אפשר להציל את ההקלטה",
    utm_source: "website",
    utm_campaign: "book_online_feasibility",
  });

  const messageBody = buildBookingWhatsAppBody({
    intent: "continue_chat",
    serviceLabel: "שחזור סאונד / הצלת הקלטה",
    summaryLines: [
      { label: "סוג בעיה", value: issue || "לא צוין" },
      { label: "חבילה", value: "עד 5 דקות — שחזור בסיסי" },
    ],
    contact: {
      name: sanitizeLeadText(name, 60) || "[שם]",
      phone: phone ? formatPhoneForDisplay(phone) : "[טלפון]",
    },
    priceExVat: BASIC_EX_VAT,
    totalEstimate: withVat(BASIC_EX_VAT),
    utmSource: readUtmSource(),
    includeTrustFooter: true,
  });

  function handleAction(intent: "continue_chat" | "start_now") {
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
          serviceLabel: "שחזור סאונד / הצלת הקלטה",
          summaryLines: [
            { label: "סוג בעיה", value: sanitizeLeadText(issue, 120) || "לא צוין" },
            { label: "חבילה", value: "עד 5 דקות — שחזור בסיסי" },
          ],
          contact: { name: sanitizeLeadText(name, 60), phone: displayPhone },
          priceExVat: BASIC_EX_VAT,
          totalEstimate: withVat(BASIC_EX_VAT),
          utmSource: readUtmSource(),
          includeTrustFooter: true,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "book_online_restore",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "online_restore_booking",
          subject: "ליד חדש — שחזור סאונד",
          body,
          name: sanitizeLeadText(name, 60),
          phone: displayPhone,
        });
        setLastHref(href);
        setDone(true);
      },
    );
    setErrors(fieldErrs ?? {});
  }

  if (done) {
    return (
      <BookingSuccessPanel
        whatsappHref={lastHref}
        onNewBooking={() => {
          setDone(false);
          setName("");
          setPhone("");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
        <p className="text-sm font-semibold text-foreground">בדיקת היתכנות חינם</p>
        <p className="mt-1 text-xs text-muted-foreground">
          שלחו קטע של 30 שניות בוואטסאפ — נגיד בכנות מה אפשר להציל, בלי התחייבות.
        </p>
        <button
          type="button"
          onClick={() => openWhatsAppLead(feasibilityHref)}
          className="mt-3 text-sm font-semibold text-brand-red underline-offset-2 hover:underline"
        >
          שלחו קובץ לבדיקה חינם ←
        </button>
      </div>

      <BookPriceDual exVat={BASIC_EX_VAT} />
      <p className="text-xs text-muted-foreground">שחזור מלא לפי מורכבות — נעריך אחרי האזנה לקובץ.</p>

      <BookWhatHappensNext
        steps={VOCAL_FIX_PROCESS_STEPS.slice(0, 3).map((step) => ({
          number: step.number,
          title: step.title,
          body: step.description,
        }))}
      />
      <BookTrustBadges badges={[{ icon: "☁️", label: "גיבוי ענן לכל החיים" }, { icon: "🔄", label: "סבב תיקונים אחד" }]} />

      <div>
        <label className="mb-2 block text-sm font-medium">מה הבעיה בסאונד?</label>
        <input
          className={inputClass}
          placeholder="למשל: רעשי רקע, הקלטת זום, קלטת ישנה..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <input
          className={inputClass}
          placeholder="שם מלא"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          dir="ltr"
        />
      </div>

      <BookingWhatsAppPreview messageBody={messageBody} />

      <LeadFormAlert message={globalError} />
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <BookingSummaryActions
        continueWhatsApp={{ onClick: () => handleAction("continue_chat"), label: "נמשיך בוואטסאפ" }}
        startNow={{ onClick: () => handleAction("start_now"), label: "התחל תהליך והזמן עכשיו" }}
        disabled={!name.trim() || !phone.trim()}
      />
    </div>
  );
}
