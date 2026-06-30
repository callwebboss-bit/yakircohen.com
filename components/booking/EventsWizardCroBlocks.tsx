"use client";

import { WizardAnxietyPills } from "@/components/booking/cro/WizardAnxietyPills";
import { WizardDecoyCard } from "@/components/booking/cro/WizardDecoyCard";
import { WizardReassuranceBadge } from "@/components/booking/cro/WizardReassuranceBadge";
import { WizardWelcomePerkPills } from "@/components/booking/cro/WizardWelcomePerkPills";
import { EVENTS_CRO_CONFIG } from "@/lib/data/cro/events";
import type { EventsSessionPriorityId, EventsWelcomePerkId } from "@/lib/events-form-draft";

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

export function EventsEffectFailureBadge() {
  const reassurance = EVENTS_CRO_CONFIG.reassuranceByAnxiety.effect_failure;
  if (!reassurance) return null;
  return <WizardReassuranceBadge reassurance={reassurance} />;
}

export function EventsDecoyVipCard({ escapeWaHref }: { escapeWaHref: string }) {
  const decoy = EVENTS_CRO_CONFIG.decoy;
  if (!decoy) return null;
  return <WizardDecoyCard decoy={decoy} escapeWaHref={escapeWaHref} className="mt-4" />;
}
