"use client";

import { cn } from "@/lib/utils";

export function WizardLastMinuteUpsell({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "relative z-10 flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
        checked
          ? "border-[var(--service-accent,#d42b2b)] bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_6%,transparent)]"
          : "border-border/60 bg-surface",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--service-accent,#d42b2b)]"
      />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

export function WizardPriceReframe({ text }: { text: string }) {
  return (
    <p className="text-center text-xs leading-relaxed text-muted-foreground">{text}</p>
  );
}

export function WizardParkingBanner({ copy }: { copy: string }) {
  return (
    <div
      className="min-h-[72px] rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900 transition-all duration-300"
      role="status"
    >
      {copy}
    </div>
  );
}
