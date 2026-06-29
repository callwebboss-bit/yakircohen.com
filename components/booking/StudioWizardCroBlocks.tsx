"use client";

import { BOOK_WIZARD_COPY, STUDIO_QUICK_UPGRADE_IDS } from "@/lib/data/book-wizard-copy";
import { STUDIO_RECORDING_UPGRADES, type StudioUpgradeId } from "@/lib/data/studio-recording-booking";
import { calcStudioPackageFitPct } from "@/lib/studio-package-fit";
import { formatNis } from "@/lib/data/pricing";
import type { StudioFormDraft } from "@/lib/studio-form-draft";
import { bookFieldClass } from "@/lib/book-form-ui";
import { cn } from "@/lib/utils";

type ProjectMode = StudioFormDraft["projectMode"];

export function StudioProjectModeToggle({
  value,
  onChange,
}: {
  value: ProjectMode;
  onChange: (mode: Exclude<ProjectMode, "">) => void;
}) {
  const options: { id: Exclude<ProjectMode, "">; label: string }[] = [
    { id: "personal", label: BOOK_WIZARD_COPY.projectPersonal },
    { id: "business", label: BOOK_WIZARD_COPY.projectBusiness },
  ];

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-foreground">{BOOK_WIZARD_COPY.projectModeQuestion}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={cn(
                "min-h-12 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_8%,transparent)] text-[var(--service-accent,#d42b2b)]"
                  : "border-border/60 text-foreground hover:border-[var(--service-accent,#d42b2b)]/30",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StudioFitMeter({
  form,
}: {
  form: Pick<StudioFormDraft, "recordingType" | "packageId" | "projectMode">;
}) {
  const pct = calcStudioPackageFitPct(form);
  if (pct == null) return null;

  return (
    <div
      className="min-h-14 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3"
      role="status"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-emerald-900">{BOOK_WIZARD_COPY.fitMeterLabel}</p>
        <span className="text-lg font-bold tabular-nums text-emerald-700">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-200/60">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-emerald-800">{BOOK_WIZARD_COPY.fitMeterDetail}</p>
    </div>
  );
}

export function StudioUpgradeQuickPills({
  allowedIds,
  selected,
  onToggle,
}: {
  allowedIds: Set<string> | null;
  selected: Set<string>;
  onToggle: (id: StudioUpgradeId) => void;
}) {
  const pills = STUDIO_RECORDING_UPGRADES.filter(
    (u) =>
      (STUDIO_QUICK_UPGRADE_IDS as readonly string[]).includes(u.id) &&
      (!allowedIds || allowedIds.has(u.id)),
  );
  if (!pills.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">תוספות מהירות</p>
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => {
          const active = selected.has(pill.id);
          return (
            <button
              key={pill.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(pill.id)}
              className={cn(
                "min-h-10 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-[var(--service-accent,#d42b2b)] bg-[var(--service-accent,#d42b2b)]/10 text-[var(--service-accent,#d42b2b)]"
                  : "border-border/60 text-foreground hover:border-[var(--service-accent,#d42b2b)]/40",
              )}
            >
              +{pill.price.toLocaleString("he-IL")} ₪ · {pill.name.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StudioCostSplitBlock({
  enabled,
  count,
  totalExVat,
  onEnabledChange,
  onCountChange,
}: {
  enabled: boolean;
  count: number;
  totalExVat: number;
  onEnabledChange: (v: boolean) => void;
  onCountChange: (n: number) => void;
}) {
  const perPerson = enabled && count >= 2 ? Math.round(totalExVat / count) : null;

  return (
    <div className="rounded-xl border border-border/60 bg-surface px-4 py-4">
      <label className="flex min-h-12 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--service-accent,#d42b2b)]"
        />
        <span className="text-sm font-semibold text-foreground">{BOOK_WIZARD_COPY.splitCostLabel}</span>
      </label>
      {enabled ? (
        <div className="mt-4 space-y-3">
          <label htmlFor="split-count" className="block text-xs font-semibold text-muted-foreground">
            כמה משתתפים מתחלקים? ({count})
          </label>
          <input
            id="split-count"
            type="range"
            min={2}
            max={10}
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-full accent-[var(--service-accent,#d42b2b)]"
          />
          {perPerson != null ? (
            <p className="text-sm font-semibold text-emerald-700">
              {BOOK_WIZARD_COPY.splitCostPerPerson(formatNis(perPerson))}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function StudioBusinessFields({
  companyName,
  needsInvoice,
  onCompanyNameChange,
  onNeedsInvoiceChange,
}: {
  companyName: string;
  needsInvoice: boolean;
  onCompanyNameChange: (v: string) => void;
  onNeedsInvoiceChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-surface p-4">
      <div>
        <label htmlFor="company-name" className="mb-1.5 block text-xs font-semibold">
          {BOOK_WIZARD_COPY.companyNameLabel}
        </label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className={bookFieldClass}
          autoComplete="organization"
        />
      </div>
      <label className="flex min-h-12 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={needsInvoice}
          onChange={(e) => onNeedsInvoiceChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--service-accent,#d42b2b)]"
        />
        <span className="text-sm text-foreground">{BOOK_WIZARD_COPY.needsInvoiceLabel}</span>
      </label>
    </div>
  );
}

export function WizardInlinePriceBar({
  title,
  totalExVat,
}: {
  title: string;
  totalExVat: number;
}) {
  if (totalExVat <= 0) return null;

  return (
    <div className="min-h-12 flex items-center justify-between gap-3 rounded-xl border border-[var(--service-accent,#d42b2b)]/25 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_6%,transparent)] px-4 py-2.5">
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
      <p className="shrink-0 text-sm font-bold tabular-nums text-[var(--service-accent,#d42b2b)]">
        {formatNis(totalExVat)} לפני מע״מ
      </p>
    </div>
  );
}
