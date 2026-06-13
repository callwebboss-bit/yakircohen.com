"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { ProService, ProServiceId, ProWizardField } from "@/lib/data/pro-services";
import { getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { buildBookHref } from "@/lib/book-url";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { AdvisorResponse } from "@/lib/pro-service-advisor";
import { cn } from "@/lib/utils";

type ProServiceWizardProps = {
  service: ProService;
};

function initValues(fields: readonly ProWizardField[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    out[f.id] = f.type === "multiselect" ? "[]" : "";
  }
  return out;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ProWizardField;
  value: string;
  onChange: (v: string) => void;
}) {
  const baseClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

  if (field.type === "textarea") {
    return (
      <textarea
        id={field.id}
        className={cn(baseClass, "min-h-[88px] resize-y")}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={field.id}
        className={baseClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      >
        <option value="">בחרו...</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "multiselect") {
    const selected: string[] = (() => {
      try {
        return JSON.parse(value || "[]") as string[];
      } catch {
        return [];
      }
    })();
    return (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                const next = on
                  ? selected.filter((x) => x !== o.value)
                  : [...selected, o.value];
                onChange(JSON.stringify(next));
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on
                  ? "border-brand-red bg-brand-red/10 text-brand-red"
                  : "border-border text-muted-foreground hover:border-brand-red/40",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <input
      id={field.id}
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      className={baseClass}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  );
}

export default function ProServiceWizard({ service }: ProServiceWizardProps) {
  const [values, setValues] = useState(() => initValues(service.wizardFields));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdvisorResponse | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const patch = useCallback((id: string, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/service-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, inputs: values }),
      });
      if (!res.ok) throw new Error("שגיאה בשרת");
      const data = (await res.json()) as AdvisorResponse & { source?: string };
      setResult(data);
      setSource(data.source ?? null);
    } catch {
      setError("לא הצלחנו לקבל הצעה. נסו שוב או פנו בוואטסאפ.");
    } finally {
      setLoading(false);
    }
  };

  const basePrice = getExVat(service.pricingId);
  const displayPrice = result?.estimatedPriceExVat ?? basePrice;

  const waBody = appendYcLeadTag(
    [
      service.whatsappIntro,
      result?.summary ? `\nסיכום: ${result.summary}` : "",
      `\nמחיר משוער: ${displayPrice.toLocaleString("he-IL")} שקלים לפני מע״מ (${withVat(displayPrice).toLocaleString("he-IL")} שקלים כולל מע״מ)`,
      "\nאשמח לפרטים והמשך.",
    ].join(""),
    {
      service: service.closerServiceId,
      price: displayPrice,
      source: service.utmCampaign,
      step: 2,
    },
  );

  const whatsappHref = buildWhatsAppHref({
    text: waBody,
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_wizard`,
  });

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby={`wizard-${service.id}`}
    >
      <h2
        id={`wizard-${service.id}`}
        className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {service.wizardTitle}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        ממלאים פרטים — מקבלים הצעה מותאמת עם מחיר משוער. יקיר בודק לפני סגירה.
      </p>

      {!result ? (
        <form onSubmit={submit} className="mt-6 space-y-5">
          {service.wizardFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <FieldInput
                field={field}
                value={values[field.id] ?? ""}
                onChange={(v) => patch(field.id, v)}
              />
            </div>
          ))}
          {error ? (
            <p className="text-sm text-brand-red" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light disabled:opacity-60"
          >
            {loading ? "מחשב הצעה..." : "קבלו הצעה משוערת"}
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          {source ? (
            <p className="text-xs text-muted-foreground">
              {source === "ai" ? "הצעה חכמה מהאתר — יקיר מאשר לפני ביצוע" : "הערכה לפי מחשבון האתר"}
            </p>
          ) : null}
          <p className="text-sm font-medium text-foreground">{result.summary}</p>
          {result.recommendations.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.recommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : null}
          {result.technicalNotes ? (
            <p className="rounded-lg border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
              {result.technicalNotes}
            </p>
          ) : null}
          <p className="text-sm font-semibold text-brand-red">
            משוער: {displayPrice.toLocaleString("he-IL")} שקלים לפני מע״מ
            {result.priceNote ? ` · ${result.priceNote}` : ""}
          </p>
          {result.nextSteps.length > 0 ? (
            <ol className="space-y-1 text-xs text-muted-foreground">
              {result.nextSteps.map((s, i) => (
                <li key={s}>
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          ) : null}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              המשך בוואטסאפ
            </a>
            <Link
              href={buildBookHref(service.bookCategoryId)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              הזמנה מקוונת
            </Link>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setSource(null);
              }}
              className="text-sm text-muted-foreground hover:text-brand-red"
            >
              חזרה לטופס
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
