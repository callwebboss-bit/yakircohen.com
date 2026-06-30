"use client";

import { WizardAnxietyPills } from "@/components/booking/cro/WizardAnxietyPills";
import { WizardLastMinuteUpsell, WizardPriceReframe } from "@/components/booking/cro/WizardCroExtras";
import { WizardReassuranceBadge } from "@/components/booking/cro/WizardReassuranceBadge";
import { WizardStep3HoldTimer as WizardStep3HoldTimerBase } from "@/components/booking/cro/WizardStep3HoldTimer";
import { WizardStepTransitionSkeleton } from "@/components/booking/cro/WizardStepTransitionSkeleton";
import { WizardWelcomePerkPills } from "@/components/booking/cro/WizardWelcomePerkPills";
import WizardUrgencyHint from "@/components/booking/WizardUrgencyHint";
import { PODCAST_CRO_CONFIG } from "@/lib/data/cro/podcast";
import type {
  PodcastSessionPriorityId,
  PodcastWelcomePerkId,
} from "@/lib/podcast-form-draft";

const SESSION_QUESTION = "מה הכי חשוב לכם בפרק הראשון?";
const WELCOME_QUESTION = "בחרו הטבת הגעה ללא עלות";

export function PodcastSessionPriorityPills({
  value,
  onChange,
}: {
  value: PodcastSessionPriorityId;
  onChange: (id: Exclude<PodcastSessionPriorityId, "">) => void;
}) {
  return (
    <WizardAnxietyPills
      question={SESSION_QUESTION}
      options={PODCAST_CRO_CONFIG.anxieties}
      value={value}
      onChange={(id) => onChange(id as Exclude<PodcastSessionPriorityId, "">)}
    />
  );
}

export function PodcastWelcomePerkPills({
  value,
  onChange,
}: {
  value: PodcastWelcomePerkId;
  onChange: (id: Exclude<PodcastWelcomePerkId, "">) => void;
}) {
  return (
    <WizardWelcomePerkPills
      question={WELCOME_QUESTION}
      options={PODCAST_CRO_CONFIG.perks}
      value={value}
      onChange={(id) => onChange(id as Exclude<PodcastWelcomePerkId, "">)}
    />
  );
}

export function PodcastReassuranceBadge({
  anxietyId,
}: {
  anxietyId: Exclude<PodcastSessionPriorityId, "">;
}) {
  const reassurance = PODCAST_CRO_CONFIG.reassuranceByAnxiety[anxietyId];
  if (!reassurance) return null;
  return (
    <div className="min-h-[72px]">
      <WizardReassuranceBadge reassurance={reassurance} />
    </div>
  );
}

export function PodcastWizardStepTransitionOverlay({
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
      messages={PODCAST_CRO_CONFIG.transitionMessages}
      onComplete={onComplete}
      onAbort={onAbort}
    />
  );
}

export function PodcastWizardStep3HoldTimer({ deadlineMs }: { deadlineMs: number }) {
  return <WizardStep3HoldTimerBase category="podcast" deadlineMs={deadlineMs} />;
}

export function PodcastWizardUrgencyHint({
  priceHoldLabel,
  className,
}: {
  priceHoldLabel?: string | null;
  className?: string;
}) {
  return (
    <WizardUrgencyHint
      category="podcast"
      priceHoldLabel={priceHoldLabel}
      className={className}
    />
  );
}

export function PodcastPriceReframe() {
  const text = PODCAST_CRO_CONFIG.priceReframe;
  if (!text) return null;
  return <WizardPriceReframe text={text} />;
}

export function PodcastLastMinuteHighlightsOffer({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const label =
    PODCAST_CRO_CONFIG.lastMinuteUpsell?.label ??
    "רגעי שיא לרילס - מבצע לסגירה";
  return (
    <WizardLastMinuteUpsell
      label={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
