"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { PRICING_HUB_SECTIONS } from "@/lib/data/pricing-hub";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { formatIlMobileDisplay, normalizeIlMobile } from "@/lib/leads/format-phone-il";
import type { ServiceType } from "@/lib/leads/types";
import MultiStepLeadShell, { useMultiStep } from "@/components/leads/MultiStepLeadShell";
import ServiceAutoQualifyFields, {
  type AutoQualifyValues,
} from "@/components/leads/ServiceAutoQualifyFields";
import SuccessBurst from "@/components/leads/SuccessBurst";

const STEPS = [
  { id: "service", title: "שירות ומחיר" },
  { id: "qualify", title: "התאמה" },
  { id: "contact", title: "פרטים ושליחה" },
];

const DRAFT_KEY = "yc_pricing_inquiry_draft_v1";

type Draft = {
  sectionId: string;
  rowLabel: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  qualify: AutoQualifyValues;
};

function sectionToServiceType(sectionId: string): ServiceType {
  if (sectionId === "studio") return "studio";
  if (sectionId === "podcast") return "podcast";
  if (sectionId === "events" || sectionId === "dj") return "events";
  if (sectionId === "business") return "business";
  if (sectionId === "online") return "online";
  if (sectionId === "photography") return "photography";
  return "unknown";
}

export default function PricingInquiryForm() {
  const searchParams = useSearchParams();
  const ask = searchParams.get("ask") || "";
  const { submitLead, isSubmitting, isSuccess } = useLeadSubmit();
  const multi = useMultiStep(STEPS.length);

  const [sectionId, setSectionId] = useState(ask || PRICING_HUB_SECTIONS[0]?.id || "studio");
  const [rowLabel, setRowLabel] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [qualify, setQualify] = useState<AutoQualifyValues>({});
  const [error, setError] = useState<string | null>(null);

  const section = useMemo(
    () => PRICING_HUB_SECTIONS.find((s) => s.id === sectionId) || PRICING_HUB_SECTIONS[0],
    [sectionId],
  );

  const selectedRow = useMemo(
    () => section?.rows.find((r) => r.label === rowLabel),
    [section, rowLabel],
  );

  const serviceType = sectionToServiceType(section?.id || "");

  useEffect(() => {
    if (ask) {
      const match = PRICING_HUB_SECTIONS.find((s) => s.id === ask);
      if (match) setSectionId(match.id);
    }
  }, [ask]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Draft;
      if (d.sectionId) setSectionId(d.sectionId);
      if (d.rowLabel) setRowLabel(d.rowLabel);
      if (d.name) setName(d.name);
      if (d.phone) setPhone(d.phone);
      if (d.email) setEmail(d.email);
      if (d.message) setMessage(d.message);
      if (d.qualify) setQualify(d.qualify);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const draft: Draft = {
        sectionId,
        rowLabel,
        name,
        phone,
        email,
        message,
        qualify,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [sectionId, rowLabel, name, phone, email, message, qualify]);

  // Soft recover when phone present on blur of contact step
  useEffect(() => {
    if (multi.stepIndex !== 2) return;
    const normalized = normalizeIlMobile(phone);
    if (!normalized || normalized.length < 10) return;
    const t = window.setTimeout(() => {
      void fetch("/api/leads/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "pricing_inquiry_draft",
          name,
          phone: normalized,
          email,
          draft: message,
          serviceType,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 1200);
    return () => window.clearTimeout(t);
  }, [multi.stepIndex, phone, name, email, message, serviceType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setError(null);

    const normalized = normalizeIlMobile(phone);
    if (!name.trim() || !normalized) {
      setError("שם וטלפון נייד ישראלי נדרשים.");
      return;
    }

    const priceLine = selectedRow
      ? `${selectedRow.label} — ${selectedRow.exVat.toLocaleString("he-IL")} ₪ לפני מע״מ`
      : section?.title || "";

    const body = [
      `שירות: ${section?.title || sectionId}`,
      priceLine ? `מחירון: ${priceLine}` : null,
      `קישור: https://yakircohen.com/pricing?ask=${section?.id || sectionId}`,
      qualify.eventDate ? `תאריך: ${qualify.eventDate}` : null,
      qualify.budgetHint ? `תקציב משוער: ${qualify.budgetHint}` : null,
      qualify.recordingType ? `סוג הקלטה: ${qualify.recordingType}` : null,
      message ? `הודעה: ${message}` : null,
      `שם: ${name}`,
      `טלפון: ${normalized}`,
      email ? `אימייל: ${email}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const waHref = buildWhatsAppHref({
      text: `היי, פנייה ממחירון:\n${body}`,
      source: "pricing-inquiry",
    });

    try {
      await submitLead(
        {
          formId: "pricing_inquiry",
          subject: `פנייה ממחירון - ${section?.title || "כללי"} - ${name}`,
          body,
          name,
          phone: normalized,
          email: email.trim() || undefined,
          website_verification: honeypot,
          serviceType,
          eventDate: qualify.eventDate,
          budgetHint: qualify.budgetHint ? Number(qualify.budgetHint) : undefined,
          pricingRef: selectedRow
            ? {
                sectionId: section!.id,
                label: selectedRow.label,
                exVat: selectedRow.exVat,
                href: selectedRow.href || section!.href,
              }
            : {
                sectionId: section!.id,
                label: section!.title,
                href: section!.href,
              },
        },
        waHref,
      );
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch {
      setError("משהו השתבש. נסו שוב או פנו בוואטסאפ.");
    }
  }

  if (isSuccess) {
    return (
      <div className="relative rounded-2xl border border-border bg-surface px-6 py-8 text-center">
        <SuccessBurst active />
        <p className="text-sm font-semibold text-foreground">קיבלנו את הפנייה</p>
        <p className="mt-2 text-sm text-muted-foreground">
          נחזור אליך {TIME_CLAIMS.quote24h}. נפתח גם וואטסאפ להמשך.
        </p>
      </div>
    );
  }

  return (
    <form
      id="pricing-inquiry"
      onSubmit={handleSubmit}
      className="relative space-y-4"
      noValidate
      style={{ minHeight: 280 }}
    >
      <input
        type="text"
        name="website_verification"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <MultiStepLeadShell steps={STEPS} stepIndex={multi.stepIndex}>
        {multi.stepIndex === 0 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="piq-section" className="mb-1 block text-xs font-semibold">
                קטגוריה במחירון *
              </label>
              <select
                id="piq-section"
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setRowLabel("");
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              >
                {PRICING_HUB_SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="piq-row" className="mb-1 block text-xs font-semibold">
                שורת מחיר (אופציונלי)
              </label>
              <select
                id="piq-row"
                value={rowLabel}
                onChange={(e) => setRowLabel(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="">לא בחרתי שורה ספציפית</option>
                {section?.rows.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label} — {r.exVat.toLocaleString("he-IL")} ₪
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={multi.next}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-red px-6 text-sm font-semibold text-white"
            >
              המשך
            </button>
          </div>
        ) : null}

        {multi.stepIndex === 1 ? (
          <div className="space-y-4">
            <ServiceAutoQualifyFields
              serviceType={serviceType}
              values={qualify}
              onChange={setQualify}
            />
            <div>
              <label htmlFor="piq-message" className="mb-1 block text-xs font-semibold">
                שאלה / בקשה (אופציונלי)
              </label>
              <textarea
                id="piq-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                placeholder="על מה תרצו לשמוע?"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={multi.back}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold"
              >
                חזרה
              </button>
              <button
                type="button"
                onClick={multi.next}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white"
              >
                המשך
              </button>
            </div>
          </div>
        ) : null}

        {multi.stepIndex === 2 ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="piq-name" className="mb-1 block text-xs font-semibold">
                  שם מלא *
                </label>
                <input
                  id="piq-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="piq-phone" className="mb-1 block text-xs font-semibold">
                  טלפון נייד *
                </label>
                <input
                  id="piq-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatIlMobileDisplay(e.target.value))}
                  onBlur={() => setPhone(formatIlMobileDisplay(phone))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  placeholder="05X-XXX-XXXX"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label htmlFor="piq-email" className="mb-1 block text-xs font-semibold">
                אימייל (אופציונלי — למדריך והתראה)
              </label>
              <input
                id="piq-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                dir="ltr"
              />
            </div>
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={multi.back}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold"
              >
                חזרה
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? "שולח..." : "שלח בוואטסאפ + מייל"}
              </button>
            </div>
          </div>
        ) : null}
      </MultiStepLeadShell>
    </form>
  );
}
