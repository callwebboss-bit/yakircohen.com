"use client";

import { useMemo, useState } from "react";
import BookingApprovals from "@/components/booking/BookingApprovals";
import KoalendarModal from "@/components/booking/KoalendarModal";
import BookingPaymentTrust from "@/components/booking/BookingPaymentTrust";
import BookingSummaryActions from "@/components/booking/BookingSummaryActions";
import BookTrustBadges from "@/components/booking/BookTrustBadges";
import BookUpsellSection from "@/components/booking/BookUpsellSection";
import BookWhatHappensNext from "@/components/booking/BookWhatHappensNext";
import BookingStepPanel from "@/components/booking/BookingStepPanel";
import BookingWhatsAppPreview from "@/components/booking/BookingWhatsAppPreview";
import BookingWizardNav from "@/components/booking/BookingWizardNav";
import BookingSuccessPanel from "@/components/booking/BookingSuccessPanel";
import PhoneInputField from "@/components/forms/PhoneInputField";
import PriceWithVat from "@/components/booking/PriceWithVat";
import NeedsDiscoveryStep from "@/components/booking/NeedsDiscoveryStep";
import HoneypotField from "@/components/forms/HoneypotField";
import LeadFormAlert from "@/components/forms/LeadFormAlert";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import {
  PODCAST_EXTRA_PARTICIPANT_PRICE,
  PODCAST_OVERTIME_RATE,
  PODCAST_PACKAGES,
  type PodcastPackageId,
} from "@/lib/data/podcast-calculator";
import {
  getPodcastUpsellItems,
  sumPodcastUpsells,
} from "@/lib/data/podcast-booking-upsells";
import { UPSELLS } from "@/lib/data/booking-calculator-services";
import { withVat } from "@/lib/data/pricing";
import {
  BOOKING_CTA,
  BOOKING_SUMMARY_INTRO,
  BOOKING_CONSULT_15_MIN,
} from "@/lib/data/booking-shared";
import {
  formatPhoneForDisplay,
  sanitizeLeadText,
  validateBookingLead,
} from "@/lib/form-validation";
import {
  buildBookingWhatsAppBody,
  readUtmSource,
} from "@/lib/booking-messages";
import { notifyLeadByEmail } from "@/lib/lead-email-notify";
import { openWhatsAppLead } from "@/lib/open-whatsapp-lead";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["חבילה", "פרטים", "סיכום"] as const;

const TIMEFRAME_OPTIONS = [
  { value: "", label: "מתי מתאים לכם?" },
  { value: "asap", label: "בהקדם האפשרי" },
  { value: "next_week", label: "שבוע הקרוב" },
  { value: "this_month", label: "בחודש הקרוב" },
  { value: "exploring", label: "רק בודק/ת אפשרויות" },
] as const;

const PODCAST_COMPARISON_ROWS = [
  { label: "הקלטה באולפן", ids: ["starter", "audio", "video", "social"] },
  { label: "עריכה ומיקס", ids: ["audio", "video", "social"] },
  { label: "מאסטרינג", ids: ["audio", "video", "social"] },
  { label: "העלאה לספוטיפיי", ids: ["audio", "video", "social"] },
  { label: "הקלטת וידאו (3 מצלמות)", ids: ["video", "social"] },
  { label: "3 קטעי רילס", ids: ["social"] },
  { label: "העלאה לאפל + יוטיוב", ids: ["social"] },
] as const;

type FormState = {
  packageId: PodcastPackageId | "";
  overtimeBlocks: number;
  participantCount: number;
  name: string;
  phone: string;
  timeframe: string;
  customerNeed: string;
  notes: string;
  selectedUpsells: string[];
  termsAccepted: boolean;
};

const INITIAL: FormState = {
  packageId: "",
  overtimeBlocks: 0,
  participantCount: 1,
  name: "",
  phone: "",
  timeframe: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  termsAccepted: false,
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-fast ease-luxury focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

export default function PodcastBookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastWaHref, setLastWaHref] = useState("");
  const [lastIntent, setLastIntent] = useState<"continue_chat" | "start_now">("continue_chat");
  const [koalendarOpen, setKoalendarOpen] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "podcast_booking_wizard",
  });

  const draft = useBookingDraft(
    "podcast",
    form,
    setForm,
    (s) => s,
    (raw) => {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as Partial<FormState>;
      return {
        ...INITIAL,
        ...r,
        selectedUpsells: Array.isArray(r.selectedUpsells) ? r.selectedUpsells : [],
        participantCount:
          typeof r.participantCount === "number" && r.participantCount >= 1
            ? r.participantCount
            : INITIAL.participantCount,
        overtimeBlocks:
          typeof r.overtimeBlocks === "number" && r.overtimeBlocks >= 0
            ? r.overtimeBlocks
            : INITIAL.overtimeBlocks,
        termsAccepted: Boolean(r.termsAccepted),
      };
    },
  );

  const selected = PODCAST_PACKAGES.find((p) => p.id === form.packageId);
  const extraParticipantsCost =
    form.participantCount > 2
      ? (form.participantCount - 2) * PODCAST_EXTRA_PARTICIPANT_PRICE
      : 0;
  const upsellTotal = sumPodcastUpsells(new Set(form.selectedUpsells));
  const packageTotal =
    (selected?.price ?? 0) +
    form.overtimeBlocks * PODCAST_OVERTIME_RATE +
    extraParticipantsCost +
    upsellTotal;

  const upsellItems = getPodcastUpsellItems(form.packageId);
  const selectedUpsellSet = new Set(form.selectedUpsells);

  const toggleUpsell = (id: string) => {
    setForm((prev) => {
      const has = prev.selectedUpsells.includes(id);
      return {
        ...prev,
        selectedUpsells: has
          ? prev.selectedUpsells.filter((x) => x !== id)
          : [...prev.selectedUpsells, id],
      };
    });
  };

  const canStep0 = form.packageId !== "";

  const buildSummaryContext = () => {
    const displayPhone = form.phone.trim()
      ? formatPhoneForDisplay(form.phone.trim())
      : "";
    const timeframeLabel =
      TIMEFRAME_OPTIONS.find((o) => o.value === form.timeframe)?.label ?? "";
    const summaryLines = [
      ...(selected ? [{ label: "חבילה", value: selected.name }] : []),
      ...(form.participantCount > 1
        ? [
            {
              label: "מספר משתתפים",
              value:
                form.participantCount > 2
                  ? `${form.participantCount} (+${extraParticipantsCost.toLocaleString("he-IL")} ₪)`
                  : String(form.participantCount),
            },
          ]
        : []),
      ...(form.overtimeBlocks > 0
        ? [
            {
              label: "זמן נוסף",
              value: `+${form.overtimeBlocks * 30} דק׳ (+${(form.overtimeBlocks * PODCAST_OVERTIME_RATE).toLocaleString("he-IL")} ₪)`,
            },
          ]
        : []),
      ...(timeframeLabel ? [{ label: "מועד מועדף", value: timeframeLabel }] : []),
      ...(form.notes ? [{ label: "הערות", value: sanitizeLeadText(form.notes, 500) }] : []),
      ...(form.selectedUpsells ?? [])
        .filter((k) => (UPSELLS[k]?.price ?? 0) > 0)
        .map((k) => ({
          label: "תוספת",
          value: `${UPSELLS[k]?.name ?? k} (+${(UPSELLS[k]?.price ?? 0).toLocaleString("he-IL")} ₪)`,
        })),
    ];
    return {
      summaryLines,
      contact: {
        name: sanitizeLeadText(form.name, 60),
        phone: displayPhone,
      },
    };
  };

  const canStep1 = useMemo(
    () => Boolean(form.name.trim() && form.phone.trim()),
    [form.name, form.phone],
  );

  const handleAction = (intent: "continue_chat" | "start_now") => {
    if (!form.termsAccepted) {
      setErrors({ terms: "יש לאשר את התנאים לפני שליחה" });
      return;
    }
    const fieldErrs = attemptSubmit(
      () =>
        validateBookingLead({
          name: form.name,
          phone: form.phone,
          date: "",
          time: "",
          location: "",
          notes: form.notes,
          requireLocation: false,
          requireDate: false,
          requireTime: false,
        }),
      (result) => {
        const displayPhone = result.normalizedPhone
          ? formatPhoneForDisplay(result.normalizedPhone)
          : form.phone.trim();
        const { summaryLines } = buildSummaryContext();
        const body = buildBookingWhatsAppBody({
          intent,
          serviceLabel: selected ? `פודקאסט - ${selected.name}` : "פודקאסט",
          packageLabel: selected?.name,
          summaryLines,
          contact: { name: sanitizeLeadText(form.name, 60), phone: displayPhone },
          priceExVat: selected ? packageTotal : undefined,
          totalEstimate: selected ? withVat(packageTotal) : undefined,
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          timing:
            form.timeframe === "asap"
              ? "urgent"
              : form.timeframe === "exploring"
                ? "future"
                : form.timeframe
                  ? "month"
                  : null,
          utmSource: readUtmSource() ?? "/book#podcast",
          includeTrustFooter: true,
        });
        const href = buildWhatsAppHref({
          text: body,
          utm_source: "website",
          utm_campaign: "podcast_booking_wizard",
        });
        openWhatsAppLead(href);
        notifyLeadByEmail({
          formId: "podcast_booking_wizard",
          subject: "הזמנת פודקאסט",
          body,
          name: form.name,
          phone: displayPhone,
        });
        setLastIntent(intent);
        setLastWaHref(href);
        setSubmitted(true);
        draft.clear();
      },
    );
    setErrors(fieldErrs ?? {});
  };

  const previewBody =
    step === 2 && selected
      ? buildBookingWhatsAppBody({
          intent: "continue_chat",
          serviceLabel: `פודקאסט - ${selected.name}`,
          packageLabel: selected.name,
          summaryLines: buildSummaryContext().summaryLines,
          contact: buildSummaryContext().contact,
          priceExVat: packageTotal,
          totalEstimate: withVat(packageTotal),
          customerNeed: sanitizeLeadText(form.customerNeed, 500) || null,
          timing:
            form.timeframe === "asap"
              ? "urgent"
              : form.timeframe === "exploring"
                ? "future"
                : form.timeframe
                  ? "month"
                  : null,
          utmSource: readUtmSource() ?? "/book#podcast",
          includeTrustFooter: true,
        })
      : undefined;

  const resetWizard = () => {
    setForm(INITIAL);
    setStep(0);
    setSubmitted(false);
    setErrors({});
  };

  if (submitted && lastWaHref) {
    return (
      <BookingSuccessPanel
        intent={lastIntent}
        whatsappHref={lastWaHref}
        onNewBooking={resetWizard}
      />
    );
  }

  return (
    <div className="min-w-0 max-w-full space-y-8">
      {draft.restored && draft.savedAt && !draftDismissed ? (
        <p className="rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-xs text-muted-foreground">
          שחזרנו טיוטה שמורה מ-
          {new Date(draft.savedAt).toLocaleDateString("he-IL", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          .{" "}
          <button
            type="button"
            onClick={() => {
              draft.clear();
              setDraftDismissed(true);
            }}
            className="underline hover:text-brand-red"
          >
            נקה
          </button>
        </p>
      ) : null}

      <BookingWizardNav steps={STEPS} currentStep={step} label="שלבי הזמנת פודקאסט" />

      {step === 0 && (
        <BookingStepPanel stepKey={0}>
          <h2 className="text-xl font-semibold text-foreground">בחרו חבילת פודקאסט</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PODCAST_PACKAGES.map((pkg) => {
              const active = form.packageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      packageId: pkg.id,
                      overtimeBlocks: 0,
                      selectedUpsells: [],
                    }))
                  }
                  className={cn(
                    "rounded-2xl border p-5 text-start",
                    active ? "border-brand-red bg-brand-red/5" : "border-border bg-background",
                  )}
                  aria-pressed={active}
                >
                  {pkg.badge ? (
                    <span className="text-xs font-bold text-brand-red">{pkg.badge}</span>
                  ) : null}
                  <p className="mt-1 font-semibold text-foreground">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
                  <div className="mt-3">
                    <PriceWithVat amountExVat={pkg.price} size="md" />
                  </div>
                </button>
              );
            })}
          </div>
          {/* Participant count */}
          <div className="mt-6">
            <p className="mb-1 text-sm font-semibold text-foreground">כמה משתתפים בפרק?</p>
            <p className="mb-3 text-xs text-muted-foreground">
              עד 2 משתתפים — כלול במחיר. כל משתתף נוסף:{" "}
              <span className="font-medium text-foreground">
                +{PODCAST_EXTRA_PARTICIPANT_PRICE} ₪
              </span>{" "}
              (מיקרופון נוסף + עריכה מוגברת)
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((count) => {
                const extra = Math.max(0, count - 2) * PODCAST_EXTRA_PARTICIPANT_PRICE;
                const active = form.participantCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, participantCount: count }))}
                    className={cn(
                      "flex flex-col items-center rounded-xl border px-4 py-2.5 text-center transition-colors",
                      active
                        ? "border-brand-red bg-brand-red/10 text-brand-red"
                        : "border-border bg-background text-foreground hover:border-brand-red/40",
                    )}
                    aria-pressed={active}
                  >
                    <span className="text-sm font-semibold">
                      {count === 1 ? "מגיש יחיד" : `${count} אנשים`}
                    </span>
                    <span className={cn("text-[0.65rem]", active ? "text-brand-red/80" : "text-muted-foreground")}>
                      {extra > 0 ? `+${extra} ₪` : "כלול"}
                    </span>
                  </button>
                );
              })}
              <a
                href="https://wa.me/972587555456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl border border-dashed border-border px-4 py-2.5 text-center text-sm text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
              >
                <span className="text-sm font-semibold">5+ אנשים</span>
                <span className="text-[0.65rem]">ווטסאפ לתיאום</span>
              </a>
            </div>
          </div>

          {selected ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                גלישה בזמן · {PODCAST_OVERTIME_RATE.toLocaleString("he-IL")} ₪ לכל 30 דקות
              </p>
              <p className="mb-3 text-sm font-semibold text-foreground">כמה זמן הקלטה נוסף?</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, overtimeBlocks: b }))}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                      form.overtimeBlocks === b
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-border bg-background hover:border-brand-red/40",
                    )}
                  >
                    {b === 0
                      ? "ללא גלישה"
                      : `+${b * 30} דק׳ (+${(b * PODCAST_OVERTIME_RATE).toLocaleString("he-IL")} ₪)`}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Comparison — mobile: selected package only; desktop: full table */}
          {selected ? (
            <div className="rounded-xl border border-border bg-surface p-4 md:hidden">
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                מה כלול ב{selected.name.split(" - ")[0]}?
              </p>
              <ul className="space-y-2">
                {PODCAST_COMPARISON_ROWS.filter((row) =>
                  (row.ids as readonly string[]).includes(selected.id),
                ).map((row) => (
                  <li key={row.label} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-green-600" aria-hidden="true">
                      ✓
                    </span>
                    {row.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-2.5 text-start text-xs font-semibold text-muted-foreground">
                    מה כלול
                  </th>
                  {PODCAST_PACKAGES.map((pkg) => (
                    <th
                      key={pkg.id}
                      className="px-3 py-2.5 text-center text-xs font-semibold text-foreground"
                    >
                      {pkg.name.split(" - ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PODCAST_COMPARISON_ROWS.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={cn("border-b border-border last:border-0", ri % 2 === 1 && "bg-surface/50")}
                  >
                    <td className="px-4 py-2 text-xs text-foreground">{row.label}</td>
                    {PODCAST_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="px-3 py-2 text-center text-base">
                        {(row.ids as readonly string[]).includes(pkg.id) ? (
                          <span className="text-green-600" aria-label="כלול">
                            ✓
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40" aria-label="לא כלול">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {form.packageId && upsellItems.length > 0 ? (
            <BookUpsellSection
              items={upsellItems}
              selected={selectedUpsellSet}
              onToggle={toggleUpsell}
              className="mt-6"
            />
          ) : null}

          <StepNav onNext={() => setStep(1)} nextDisabled={!canStep0} showBack={false} />
        </BookingStepPanel>
      )}

      {step === 1 && (
        <BookingStepPanel stepKey={1}>
          <h2 className="text-xl font-semibold text-foreground">פרטים לתיאום</h2>
          <div className="relative max-w-lg space-y-4">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <LeadFormAlert message={globalError} />
            <Field id="pb-name" label="שם *" value={form.name} error={errors.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
            <PhoneInputField
              id="pb-phone"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
              error={errors.phone}
            />
            <div>
              <label htmlFor="pb-timeframe" className="mb-1.5 block text-xs font-semibold">
                מועד מועדף
              </label>
              <select
                id="pb-timeframe"
                value={form.timeframe}
                onChange={(e) => setForm((p) => ({ ...p, timeframe: e.target.value }))}
                className={cn(inputClass, "appearance-none")}
              >
                {TIMEFRAME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === ""}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <Field id="pb-notes" label="הערות" multiline value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} />
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canStep1} />
        </BookingStepPanel>
      )}

      {step === 2 && selected && (
        <BookingStepPanel stepKey={2}>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
          >
            → ערוך בחירה
          </button>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">סיכום</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected.name}</p>
              {form.overtimeBlocks > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  +{form.overtimeBlocks * 30} דק׳ הקלטה נוספת
                </p>
              ) : null}
              <PriceWithVat amountExVat={packageTotal} size="lg" className="mt-4" />
            </div>
            <div className="space-y-4">
              <BookWhatHappensNext />
              <BookTrustBadges
                badges={[
                  { icon: "🔄", label: "סבב תיקונים אחד כלול בעריכה" },
                  { icon: "☁️", label: "גיבוי ענן עד ההקלטה הבאה" },
                  { icon: "🅿️", label: "חנייה חופשית במודיעין" },
                ]}
              />
              <NeedsDiscoveryStep
                value={form.customerNeed}
                onChange={(v) => setForm((p) => ({ ...p, customerNeed: v }))}
                id="pb-customer-need"
              />
              {previewBody ? <BookingWhatsAppPreview messageBody={previewBody} /> : null}
              <p className="text-sm text-muted-foreground">{BOOKING_SUMMARY_INTRO}</p>
              <BookingApprovals
                variant="light"
                termsAccepted={form.termsAccepted}
                onTermsChange={(v) => setForm((p) => ({ ...p, termsAccepted: v }))}
                termsError={errors.terms}
              />
              <BookingSummaryActions
                disabled={!form.termsAccepted}
                socialProof="פרק ראשון מוכן בדרך כלל תוך 5 ימי עבודה"
                continueWhatsApp={{
                  label: BOOKING_CTA.continue_chat,
                  onClick: () => handleAction("continue_chat"),
                }}
                startNow={{
                  label: BOOKING_CTA.start_now,
                  onClick: () => handleAction("start_now"),
                }}
                consult15Min={{
                  label: BOOKING_CONSULT_15_MIN.title,
                  onClick: () => setKoalendarOpen(true),
                }}
              />
              <BookingPaymentTrust />

              {form.phone.trim().length >= 9 && (
                <p className="text-center text-xs text-muted-foreground">
                  לא עכשיו?{" "}
                  <a
                    href={buildWhatsAppHref({
                      text:
                        `שמרתי את הפרטים שלי לפודקאסט באולפן יקיר כהן:\n\n` +
                        buildSummaryContext().summaryLines
                          .map((l) => `• ${l.label}: ${l.value}`)
                          .join("\n") +
                        `\n\nלהמשיך מכאן: yakircohen.com/book#podcast`,
                      utm_source: "website",
                      utm_campaign: "podcast_save_for_later",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-brand-red"
                  >
                    שלחו לעצמכם ווטסאפ לחזרה
                  </a>
                </p>
              )}

              <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-muted-foreground hover:text-brand-red">
                חזרה לפרטים
              </button>
            </div>
          </div>
        </BookingStepPanel>
      )}

      <KoalendarModal open={koalendarOpen} onClose={() => setKoalendarOpen(false)} />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  min,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  min?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "resize-none")} />
      ) : (
        <input id={id} type={type} min={min} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, error && "border-red-400")} />
      )}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  showBack?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 border-t border-border pt-6">
      {showBack && onBack ? (
        <button type="button" onClick={onBack} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold">
          חזרה
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        המשך
      </button>
    </div>
  );
}
