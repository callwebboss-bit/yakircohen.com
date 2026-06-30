import type { TierACategoryId, WizardCroConfig } from "@/lib/book-wizard-cro/types";
import { EVENTS_CRO_CONFIG } from "@/lib/data/cro/events";
import { PODCAST_CRO_CONFIG } from "@/lib/data/cro/podcast";
import { SINGER_CRO_CONFIG } from "@/lib/data/cro/singer";
import { STUDIO_CRO_CONFIG } from "@/lib/data/cro/studio";

export const CRO_REGISTRY = {
  studio: STUDIO_CRO_CONFIG,
  events: EVENTS_CRO_CONFIG,
  podcast: PODCAST_CRO_CONFIG,
  singer: SINGER_CRO_CONFIG,
} satisfies Record<TierACategoryId, WizardCroConfig>;

export function getCroConfig(category: TierACategoryId): WizardCroConfig {
  return CRO_REGISTRY[category];
}

export { STUDIO_CRO_CONFIG, EVENTS_CRO_CONFIG, PODCAST_CRO_CONFIG, SINGER_CRO_CONFIG };
