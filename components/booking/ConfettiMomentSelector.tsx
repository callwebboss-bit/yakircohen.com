"use client";

import { cn } from "@/lib/utils";

type MomentId = "glass_break" | "slow_dance" | "afterparty";

type Option = {
  id: MomentId;
  label: string;
  recommendation: string;
};

const OPTIONS: Option[] = [
  {
    id: "glass_break",
    label: "שבירת הכוס בחופה",
    recommendation: "קונפטי משי לבן שנוחת באיטיות - אפקט ענן",
  },
  {
    id: "slow_dance",
    label: "שיא ריקוד הסלואו",
    recommendation: "קונפטי משי לבן שנוחת באיטיות - אפקט ענן",
  },
  {
    id: "afterparty",
    label: "פתיחת הרחבה - אפטר פארטי",
    recommendation: "קונפטי מטאלי מוזהב שמחזיר את האור של הפנסים",
  },
];

type Props = {
  value: string;
  onChange: (v: MomentId) => void;
};

export default function ConfettiMomentSelector({ value, onChange }: Props) {
  const selected = OPTIONS.find((o) => o.id === value);

  return (
    <div className="px-0.5">
      <p className="mb-1 text-[0.65rem] font-semibold text-muted-foreground">מהו רגע השיא שלך?</p>
      <div className="flex flex-col gap-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-lg border px-2.5 py-2 text-right text-xs font-medium transition-colors",
              value === opt.id
                ? "border-brand-red bg-brand-red/5 text-brand-red"
                : "border-border text-muted-foreground hover:border-brand-red/40",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {selected ? (
        <p className="mt-1.5 text-[0.65rem] text-muted-foreground">
          מומלץ: {selected.recommendation}
        </p>
      ) : null}
    </div>
  );
}
