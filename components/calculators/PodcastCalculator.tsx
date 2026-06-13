"use client";

import { useCallback, useMemo, useState } from "react";
import CalculatorStickyBar from "@/components/calculators/CalculatorStickyBar";
import HoneypotField from "@/components/forms/HoneypotField";
import {
  formatCurrency,
  formatCurrencyWithVat,
} from "@/components/calculators/formatCurrency";
import {
  PODCAST_OVERTIME_RATE,
  PODCAST_PACKAGES,
  type PodcastPackage,
  type PodcastPackageId,
} from "@/lib/data/podcast-calculator";
import { useLeadFormGuard } from "@/hooks/useLeadFormGuard";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PodcastPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "touch-press relative flex w-full flex-col rounded-2xl border bg-surface p-5 text-right transition-[border-color,box-shadow,transform]",
        selected
          ? "border-brand-red shadow-[0_0_0_3px_rgba(212,43,43,0.08)]"
          : "border-border hover:border-brand-red/30 hover:shadow-sm active:scale-[0.97]",
      )}
    >
      {pkg.badge ? (
        <span className="absolute -top-px right-4 rounded-b-md bg-brand-red px-3 py-0.5 text-[0.65rem] font-bold tracking-wider text-white">
          {pkg.badge}
        </span>
      ) : null}
      {pkg.badge ? <span className="block h-3" aria-hidden /> : null}

      <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
      <p className="text-[0.7rem] text-muted-foreground">{pkg.subtitle}</p>
      <p className="mt-1 text-[0.7rem] font-semibold text-brand-red">{pkg.ideal}</p>

      <p className="mt-3 text-3xl font-bold text-foreground">{formatCurrency(pkg.price)}</p>
      <p className="text-[0.65rem] text-muted-foreground">
        + מע״מ - {formatCurrencyWithVat(pkg.price)} סה״כ
      </p>

      <ul className="mt-4 space-y-2">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-0.5 shrink-0 font-bold text-brand-red">-</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-border bg-background p-3">
        <p className="mb-1.5 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
          למה זה משתלם
        </p>
        <p className="text-[0.7rem] leading-relaxed text-muted-foreground">{pkg.summary}</p>
      </div>

      <span
        className={cn(
          "mt-4 w-full rounded-xl border py-2.5 text-center text-[0.8rem] font-semibold transition-colors",
          selected
            ? "border-brand-red bg-brand-red text-white"
            : "border-border text-muted-foreground",
        )}
      >
        {selected ? "נבחר" : "בחרו חבילה"}
      </span>
    </button>
  );
}

export default function PodcastCalculator({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<PodcastPackageId | null>(null);
  const [blocks, setBlocks] = useState(0);
  const { honeypot, setHoneypot, globalError, attemptSubmit } = useLeadFormGuard({
    formId: "podcast_calculator",
  });

  const pkg = PODCAST_PACKAGES.find((p) => p.id === selectedId) ?? null;
  const total = (pkg?.price ?? 0) + blocks * PODCAST_OVERTIME_RATE;

  const waText = useMemo(() => {
    if (!pkg) return buildServiceWhatsAppText("הפקת פודקאסט");
    const overtime =
      blocks > 0
        ? `זמן נוסף: +${blocks * 30} דק׳ (${formatCurrency(blocks * PODCAST_OVERTIME_RATE)})`
        : "";
    const base = [
      buildServiceWhatsAppText(`חבילת ${pkg.name}`),
      overtime,
      `סה״כ משוער: ${formatCurrency(total)} לפני מע״מ`,
    ]
      .filter(Boolean)
      .join("\n");
    return appendYcLeadTag(base, {
      service: "podcast",
      price: total,
      source: "/podcast",
      step: 2,
      intent: "continue_chat",
      form: "podcast_calculator",
      package: pkg.id,
    });
  }, [pkg, blocks, total]);

  const whatsappHref = useMemo(
    () => buildWhatsAppHref({ text: waText, utm_campaign: "podcast_calculator" }),
    [waText],
  );

  const { submitLead } = useLeadSubmit();

  const handleWhatsAppClick = useCallback(() => {
    if (!pkg) return;
    const errs = attemptSubmit(
      () => ({ ok: true as const }),
      () => {
        void submitLead(
          {
            formId: "podcast_calculator",
            subject: "ליד חדש - פודקאסט",
            body: waText,
            website_verification: honeypot,
            crossSell: { bookCategory: "podcast" },
          },
          whatsappHref,
          "continue_chat",
          { leadCategory: "podcast" },
        );
      },
    );
    if (errs) {
      /* honeypot / rate limit - blocked silently */
    }
  }, [attemptSubmit, honeypot, pkg, submitLead, waText, whatsappHref]);

  return (
    <div className={cn("pb-28", className)}>
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      {globalError ? (
        <p className="mx-auto mb-4 max-w-4xl text-center text-sm text-brand-red" role="alert">
          {globalError}
        </p>
      ) : null}
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PODCAST_PACKAGES.map((p) => (
            <PackageCard
              key={p.id}
              pkg={p}
              selected={selectedId === p.id}
              onSelect={() => {
                setSelectedId(p.id);
                setBlocks(0);
              }}
            />
          ))}
        </div>

        {pkg ? (
          <section className="rounded-2xl border border-border bg-foreground p-6 text-background">
            <p className="mb-2 text-[0.65rem] font-extrabold tracking-widest text-background/50 uppercase">
              גלישה בזמן - {formatCurrency(PODCAST_OVERTIME_RATE)} לכל 30 דקות
            </p>
            <p className="mb-4 text-base font-semibold">כמה זמן הקלטה נוסף?</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBlocks(b)}
                  className={cn(
                    "touch-press rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors",
                    blocks === b
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-background/25 text-background/70 hover:border-background/50 hover:text-background active:scale-[0.97]",
                  )}
                >
                  {b === 0
                    ? "ללא גלישה"
                    : `+${b * 30} דק׳ (+${formatCurrency(b * PODCAST_OVERTIME_RATE)})`}
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {pkg ? (
        <CalculatorStickyBar
          total={total}
          totalLabel="סה״כ לפני מע״מ"
          subLabel={`${formatCurrencyWithVat(total)} כולל מע״מ`}
          whatsappHref={whatsappHref}
          onWhatsAppClick={handleWhatsAppClick}
          showCta
        />
      ) : null}
    </div>
  );
}
