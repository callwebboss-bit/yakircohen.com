"use client";

import { WizardAnxietyPills } from "@/components/booking/cro/WizardAnxietyPills";
import { WizardLastMinuteUpsell, WizardPriceReframe } from "@/components/booking/cro/WizardCroExtras";
import { WizardReassuranceBadge } from "@/components/booking/cro/WizardReassuranceBadge";
import { WizardStepTransitionSkeleton } from "@/components/booking/cro/WizardStepTransitionSkeleton";
import { WizardWelcomePerkPills } from "@/components/booking/cro/WizardWelcomePerkPills";
import WizardUrgencyHint from "@/components/booking/WizardUrgencyHint";
import { EVENTS_CRO_CONFIG } from "@/lib/data/cro/events";
import type {
  EventsSessionPriorityId,
  EventsWelcomePerkId,
} from "@/lib/events-form-draft";

const SESSION_QUESTION = "מה הכי מדאיג אתכם לגבי האירוע?";
const WELCOME_QUESTION = "בחרו הטבת הגעה ללא עלות";

export function EventsSessionPriorityPills({
  value,
  onChange,
}: {
  value: EventsSessionPriorityId;
  onChange: (id: Exclude<EventsSessionPriorityId, "">) => void;
}) {
  return (
    <WizardAnxietyPills
      question={SESSION_QUESTION}
      options={EVENTS_CRO_CONFIG.anxieties}
      value={value}
      onChange={(id) => onChange(id as Exclude<EventsSessionPriorityId, "">)}
    />
  );
}

export function EventsWelcomePerkPills({
  value,
  onChange,
}: {
  value: EventsWelcomePerkId;
  onChange: (id: Exclude<EventsWelcomePerkId, "">) => void;
}) {
  return (
    <WizardWelcomePerkPills
      question={WELCOME_QUESTION}
      options={EVENTS_CRO_CONFIG.perks}
      value={value}
      onChange={(id) => onChange(id as Exclude<EventsWelcomePerkId, "">)}
    />
  );
}

export function EventsReassuranceBadge({
  anxietyId,
}: {
  anxietyId: Exclude<EventsSessionPriorityId, "">;
}) {
  const reassurance = EVENTS_CRO_CONFIG.reassuranceByAnxiety[anxietyId];
  if (!reassurance) return null;
  return (
    <div className="min-h-[72px]">
      <WizardReassuranceBadge reassurance={reassurance} />
    </div>
  );
}

/** @deprecated use EventsReassuranceBadge */
export function EventsEffectFailureBadge() {
  return <EventsReassuranceBadge anxietyId="effect_failure" />;
}

export function EventsWizardStepTransitionOverlay({
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
      messages={EVENTS_CRO_CONFIG.transitionMessages}
      onComplete={onComplete}
      onAbort={onAbort}
    />
  );
}

export function EventsWizardUrgencyHint({ className }: { className?: string }) {
  return <WizardUrgencyHint category="events" className={className} />;
}

export function EventsPriceReframe() {
  const text = EVENTS_CRO_CONFIG.priceReframe;
  if (!text) return null;
  return <WizardPriceReframe text={text} />;
}

export function EventsLastMinutePhotoOffer({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const label =
    EVENTS_CRO_CONFIG.lastMinuteUpsell?.label ??
    "מצגת תמונות מקצועית לפתיחת האירוע";
  return (
    <WizardLastMinuteUpsell
      label={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
