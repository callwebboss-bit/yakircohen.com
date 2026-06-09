import brandCopy from "./closer-brand-copy.json";
import { STUDIO_SAVINGS_TIP_THRESHOLD } from "./studio-recording-booking";
import type { StudioScenarioId } from "@/lib/studio-participant-pricing";

export type ClientScenarioMeta = {
  title: string;
  description: string;
};

export const CLIENT_SCENARIO_LABELS = brandCopy.clientScenarioLabels as Record<
  StudioScenarioId,
  ClientScenarioMeta
>;

export function getClientScenarioTitle(id: StudioScenarioId): string {
  return CLIENT_SCENARIO_LABELS[id]?.title ?? id;
}

export function getClientScenarioDescription(id: StudioScenarioId): string {
  const raw = CLIENT_SCENARIO_LABELS[id]?.description ?? "";
  return raw.replace("{threshold}", String(STUDIO_SAVINGS_TIP_THRESHOLD));
}

/** כותרת קצרה להערכת מחיר חיה - בלי א./ב./ג. */
export function getClientScenarioShortTitle(id: StudioScenarioId): string {
  return getClientScenarioTitle(id).replace(/^[א-ת]\.\s*/, "");
}
