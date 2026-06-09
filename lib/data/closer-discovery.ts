import brandCopy from "./closer-brand-copy.json";

export type DiscoverySet = {
  id: string;
  title: string;
  routeIds?: string[];
  emotionalIds?: string[];
  recordingTypes?: string[];
  questions: string[];
  closingCta?: string[];
  upsellHints?: string[];
};

export type AudienceRouteMeta = {
  id: string;
  label: string;
  discoverySetId: string;
};

export const CLOSER_DISCOVERY_SETS: Record<string, DiscoverySet> =
  brandCopy.discoverySets as Record<string, DiscoverySet>;

export const CLOSER_AUDIENCE_ROUTES: readonly AudienceRouteMeta[] =
  brandCopy.audienceRoutes as AudienceRouteMeta[];

export function resolveDiscoverySetId(opts: {
  routeId?: string | null;
  emotionalId?: string | null;
  recordingType?: string | null;
}): string {
  const { routeId, emotionalId, recordingType } = opts;

  if (recordingType) {
    const byType = Object.values(CLOSER_DISCOVERY_SETS).find((set) =>
      set.recordingTypes?.includes(recordingType),
    );
    if (byType) return byType.id;
  }

  if (routeId && emotionalId) {
    const byEmotional = Object.values(CLOSER_DISCOVERY_SETS).find(
      (set) =>
        set.routeIds?.includes(routeId) &&
        set.emotionalIds?.includes(emotionalId),
    );
    if (byEmotional) return byEmotional.id;
  }

  if (routeId) {
    const route = CLOSER_AUDIENCE_ROUTES.find((r) => r.id === routeId);
    if (route?.discoverySetId) return route.discoverySetId;
  }

  return "studio_group_default";
}

export function getDiscoverySet(id: string): DiscoverySet | undefined {
  return CLOSER_DISCOVERY_SETS[id];
}
