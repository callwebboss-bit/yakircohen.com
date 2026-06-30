"use client";

import { WizardAnxietyPills } from "@/components/booking/cro/WizardAnxietyPills";
import { WizardLastMinuteUpsell, WizardPriceReframe } from "@/components/booking/cro/WizardCroExtras";
import { WizardReassuranceBadge } from "@/components/booking/cro/WizardReassuranceBadge";
import { WizardStep3HoldTimer as WizardStep3HoldTimerBase } from "@/components/booking/cro/WizardStep3HoldTimer";
import { WizardStepTransitionSkeleton } from "@/components/booking/cro/WizardStepTransitionSkeleton";
import { WizardWelcomePerkPills } from "@/components/booking/cro/WizardWelcomePerkPills";
import WizardUrgencyHint from "@/components/booking/WizardUrgencyHint";
import { SINGER_CRO_CONFIG } from "@/lib/data/cro/singer";
import type {
  SingerSessionPriorityId,
  SingerWelcomePerkId,
} from "@/lib/singer-form-draft";

const SESSION_QUESTION = "מה הכי חשוב לכם בהופעה?";
const WELCOME_QUESTION = "בחרו הטבה ללא עלות";

export function SingerSessionPriorityPills({
  value,
  onChange,
}: {
  value: SingerSessionPriorityId;
  onChange: (id: Exclude<SingerSessionPriorityId, "">) => void;
}) {
  return (
    <WizardAnxietyPills
      question={SESSION_QUESTION}
      options={SINGER_CRO_CONFIG.anxieties}
      value={value}
      onChange={(id) => onChange(id as Exclude<SingerSessionPriorityId, "">)}
    />
  );
}

export function SingerWelcomePerkPills({
  value,
  onChange,
}: {
  value: SingerWelcomePerkId;
  onChange: (id: Exclude<SingerWelcomePerkId, "">) => void;
}) {
  return (
    <WizardWelcomePerkPills
      question={WELCOME_QUESTION}
      options={SINGER_CRO_CONFIG.perks}
      value={value}
      onChange={(id) => onChange(id as Exclude<SingerWelcomePerkId, "">)}
    />
  );
}

export function SingerReassuranceBadge({
  anxietyId,
}: {
  anxietyId: Exclude<SingerSessionPriorityId, "">;
}) {
  const reassurance = SINGER_CRO_CONFIG.reassuranceByAnxiety[anxietyId];
  if (!reassurance) return null;
  return (
    <div className="min-h-[72px]">
      <WizardReassuranceBadge reassurance={reassurance} />
    </div>
  );
}

export function SingerWizardStepTransitionOverlay({
  active,
  layout = "summary",
  onComplete,
  onAbort,
}: {
  active: boolean;
  layout?: "packages" | "contact" | "summary";
  onComplete: () => void;
  onAbort?: () => void;
}) {
  return (
    <WizardStepTransitionSkeleton
      active={active}
      layout={layout}
      messages={SINGER_CRO_CONFIG.transitionMessages}
      onComplete={onComplete}
      onAbort={onAbort}
    />
  );
}

export function SingerWizardStep3HoldTimer({ deadlineMs }: { deadlineMs: number }) {
  return <WizardStep3HoldTimerBase category="singer" deadlineMs={deadlineMs} />;
}

export function SingerWizardUrgencyHint({
  priceHoldLabel,
  className,
}: {
  priceHoldLabel?: string | null;
  className?: string;
}) {
  return (
    <WizardUrgencyHint
      category="singer"
      priceHoldLabel={priceHoldLabel}
      className={className}
    />
  );
}

export function SingerPriceReframe() {
  const text = SINGER_CRO_CONFIG.priceReframe;
  if (!text) return null;
  return <WizardPriceReframe text={text} />;
}

export function SingerLastMinuteRecordingOffer({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const label =
    SINGER_CRO_CONFIG.lastMinuteUpsell?.label ??
    "הקלטת ההופעה מהמיקסר - מבצע לסגירה";
  return (
    <WizardLastMinuteUpsell
      label={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
