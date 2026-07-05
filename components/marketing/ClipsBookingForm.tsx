"use client";

import { useCallback, useMemo, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import { useReportBookWizardLivePrice } from "@/components/booking/BookWizardLivePrice";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import CheckoutTrustMicro from "@/components/legal/CheckoutTrustMicro";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import PriceWithVat from "@/components/booking/PriceWithVat";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import PhoneInputField from "@/components/forms/PhoneInputField";
import { FORM_MICROCOPY } from "@/lib/form-microcopy";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { clearPanelBookingDraft, useBookPanelDraft } from "@/hooks/useBookPanelDraft";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { buildBookingWhatsAppBody, readUtmSource } from "@/lib/booking-messages";
import { SERVICES } from "@/lib/data/booking-calculator-services";
import { withVat } from "@/lib/data/pricing";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateIsraeliMobile,
  validatePersonName,
  type ValidationResult,
} from "@/lib/form-validation";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { scrollAndHighlightFirstError } from "@/lib/scroll-to-error";
import { sendBookingWaCta } from "@/lib/data/conversion-copy";
import { cn } from "@/lib/utils";

type ClipsBookingFormProps = {
  routeId?: string | null;
};

const CLIPS_SERVICES = Object.entries(SERVICES)
  .filter(([, s]) => s.category === "clips" || s.category === "ai")
  .map(([id, s]) => ({ id, ...s }));

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

type ClipsPanelDraft = {
  step: number;
  selected: string[];
  name: string;
  phone: string;
  notes: string;
};

export default function ClipsBookingForm({ routeId = null }: ClipsBookingFormProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const guard = useLeadFormGuard({ formId: "clips_booking" });
  const { honeypot, setHoneypot, globalError, attemptSubmit, resetGuardClock } = guard;

  const {
    submitLead,
    resetSubmit,
    isSuccess,
    isSubmitting,
    successWaHref,
    successIntent,
  } = useLeadSubmit();

  const mergeErrors = useCallback(
    (patch: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
      setErrors((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch }));
    },
    [],
  );

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (errors.services) mergeErrors({ services: "" });
      return next;
    });
  }

  const totalExVat = Array.from(selected).reduce(
    (sum, id) => sum + (SERVICES[id]?.price ?? 0),
    0,
  );

  const livePriceReport = useMemo(() => {
    if (totalExVat <= 0) return null;
    return {
      totalExVat,
      title: "קליפים ודיגיטל",
      ctaLabel: sendBookingWaCta(withVat(totalExVat)),
    };
  }, [totalExVat]);
  useReportBookWizardLivePrice(livePriceReport);

  const panelDraft = useMemo<ClipsPanelDraft>(
    () => ({
      step:
        selected.size > 0 || name.trim() || phone.trim() || notes.trim() ? 1 : 0,
      selected: [...selected],
      name,
      phone,
      notes,
    }),
    [selected, name, phone, notes],
  );

  useBookPanelDraft<ClipsPanelDraft>({
    storageKey: "clips",
    data: panelDraft,
    shouldPersist: (d) => d.step >= 1,
    onRestore: (saved) => {
      setSelected(new Set(saved.selected));
      setName(saved.name);
      setPhone(saved.phone);
      setNotes(saved.notes);
    },
  });

  const summaryLines = useMemo(
    () =>
      Array.from(selected).map((id) => ({
        label: "שירות",
        value: `${SERVICES[id]?.name ?? id} (${(SERVICES[id]?.price ?? 0).toLocaleString("he-IL")} ₪)`,
      })),
    [selected],
  );

  const previewBody = useMemo(() => {
    if (selected.size === 0) return undefined;
    return buildBookingWhatsAppBody({
      intent: "continue_chat",
      serviceLabel: "קליפים ושירותים דיגיטליים",
      summaryLines: [
        ...summaryLines,
        ...(notes.trim()
          ? [{ label: "הערות", value: sanitizeLeadText(notes, 300) }]
          : []),
      ],
      contact: {
        name: sanitizeLeadText(name, 60) || "[שם]",
        phone: phone ? formatPhoneForDisplay(phone) : "[טלפון]",
      },
      priceExVat: totalExVat,
      totalEstimate: withVat(totalExVat),
      utmSource: readUtmSource() ?? "/book#clips",
      bookCategory: "clips",
      includeTrustFooter: true,
      ycForm: "clips_booking",
    });
  }, [selected, summaryLines, name, phone, notes, totalExVat]);

  const handleSubmit = useCallback(() => {
    if (!termsAccepted) {
      mergeErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      scrollAndHighlightFirstError();
      return;
    }
    if (selected.size === 0) {
      mergeErrors({ services: "בחרו לפחות שירות אחד" });
      scrollAndHighlightFirstError();
      return;
    }

    const fieldErrs = attemptSubmit(
      (): ValidationResult => {
        const nameResult = validatePersonName(name);
        if (!nameResult.ok) return nameResult;
        const phoneResult = validateIsraeliMobile(phone);
        if (!phoneResult.ok) return phoneResult;
        return { ok: true };
      },
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : formatPhoneForDisplay(phone.trim());

        const body = buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: "קליפים ושירותים דיגיטליים",
          summaryLines: [
            ...summaryLines,
            ...(notes.trim()
              ? [{ label: "הערות", value: sanitizeLeadText(notes, 300) }]
              : []),
          ],
          contact: { name: sanitizeLeadText(name, 60), phone: displayPhone },
          priceExVat: totalExVat,
          totalEstimate: withVat(totalExVat),
          utmSource: readUtmSource() ?? "/book#clips",
          bookCategory: "clips",
          includeTrustFooter: true,
          ycForm: "clips_booking",
        });

        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "clips_booking",
        });

        void submitLead(
          {
            formId: "clips_booking",
            subject: "הזמנת קליפ / שירות דיגיטלי",
            body,
            website_verification: honeypot,
            name: sanitizeLeadText(name, 60),
            phone: displayPhone,
            crossSell: { bookCategory: "clips", routeId },
          },
          href,
          "continue_chat",
          { leadCategory: "clips" },
        );
        clearPanelBookingDraft("clips");
      },
    );
    setErrors(fieldErrs ?? {});
    if (fieldErrs && Object.keys(fieldErrs).length > 0) scrollAndHighlightFirstError();
  }, [
    attemptSubmit,
    mergeErrors,
    name,
    notes,
    phone,
    routeId,
    selected.size,
    submitLead,
    summaryLines,
    termsAccepted,
    totalExVat,
  ]);

  const handleNewBooking = useCallback(() => {
    resetSubmit();
    resetGuardClock();
    setSelected(new Set());
    setName("");
    setPhone("");
    setNotes("");
    setTermsAccepted(false);
    setErrors({});
  }, [resetGuardClock, resetSubmit]);

  if (isSuccess && successWaHref) {
    return (
      <BookingSuccessPanel
        intent={successIntent}
        whatsappHref={successWaHref}
        bookCategory="clips"
        routeId={routeId}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="space-y-8">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <LeadFormAlert message={globalError} />

      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">בחרו שירותים</h2>
        <p className="mb-4 text-sm text-muted-foreground">ניתן לבחור כמה שירותים</p>
        {errors.services && (
          <p className="mb-3 text-xs text-red-500" data-field-error>
            {errors.services}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {CLIPS_SERVICES.map(({ id, icon, name: sName, desc, price }) => {
            const active = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleService(id)}
                aria-pressed={active}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-start transition-colors",
                  active
                    ? "border-brand-red bg-brand-red/5"
                    : "border-border bg-background hover:border-brand-red/30",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs",
                    active ? "border-brand-red bg-brand-red text-white" : "border-border",
                  )}
                  aria-hidden="true"
                >
                  {active && "✓"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {icon} {sName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                  <p className="mt-1 text-xs font-medium text-brand-red">
                    {price.toLocaleString("he-IL")} ₪ + מע״מ
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {totalExVat > 0 && (
        <div className="rounded-xl border border-brand-red/20 bg-brand-red/5 px-4 py-3">
          <PriceWithVat amountExVat={totalExVat} size="md" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="clips-name" className="mb-1.5 block text-xs font-semibold">
            {FORM_MICROCOPY.nameLabel} *
          </label>
          <input
            id="clips-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={FORM_MICROCOPY.namePlaceholder}
            className={cn(inputClass, errors.name && "border-red-400")}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500" data-field-error>{errors.name}</p>}
        </div>
        <PhoneInputField
          id="clips-phone"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
      </div>

      <div>
        <label htmlFor="clips-notes" className="mb-1.5 block text-xs font-semibold">
          {FORM_MICROCOPY.visionLabel} (אופציונלי)
        </label>
        <textarea
          id="clips-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={FORM_MICROCOPY.visionPlaceholder}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <BookWhatHappensNext />
      <BookTrustBadges badges={[{ icon: "🔄", label: "סבב תיקונים אחד בעריכה" }, { icon: "☁️", label: "עבודה מרחוק לחלוטין" }]} />

      <div className="rounded-xl bg-surface px-4 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">ציר זמן ריאלי</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-none">
          <li>
            <span className="font-medium text-foreground">אחרי השליחה:</span>{" "}
            מקבלים הנחיות להעלאת הקבצים לענן
          </li>
          <li>
            <span className="font-medium text-foreground">24 עד 48 שעות:</span>{" "}
            העריכה מסתיימת ותוצאה סופית אצלכם
          </li>
          <li>
            <span className="font-medium text-foreground">לאחר האישור:</span>{" "}
            קבצים מוגמרים + גיבוי ענן לכל החיים
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">
          סבב תיקונים ראשון כלול. כל שינוי נוסף מעבר לכך מחויב בנפרד
        </p>
      </div>

      {previewBody && name.trim() && phone.trim() ? (
        <BookingWhatsAppPreview messageBody={previewBody} />
      ) : null}

      <div className="rounded-xl bg-surface px-4 py-3 text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          שלחתם ורוצים לשנות שירות או להוסיף פריט? אין בעיה. מדברים בוואטסאפ ומעדכנים. אין קנסות ואין אותיות קטנות.
        </p>
      </div>

      <BookingApprovals
        variant="light"
        termsAccepted={termsAccepted}
        onTermsChange={(v) => {
          setTermsAccepted(v);
          if (v && errors.terms) mergeErrors({ terms: "" });
        }}
        termsError={errors.terms}
      />

      <CheckoutTrustMicro variant="inline" className="mt-2" showLegalLinks={false} />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected.size === 0 || isSubmitting}
        className="w-full rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? "שולח..." : "המשך בוואטסאפ "}
      </button>
    </div>
  );
}
