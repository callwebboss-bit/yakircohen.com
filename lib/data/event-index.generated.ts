/** Auto-generated — npm run export:event-index. Do not edit. */
export type EventIndexSegment = {
  id: string;
  label: string;
  avgClosedPriceNis: number | null;
  catalogBenchmarkNis: number | null;
  demandTrendPct: number;
  leadCount: number;
  closedCount: number;
  sampleSufficient: boolean;
};

export type EventIndexAttraction = {
  id: string;
  label: string;
  demandTrendPct: number;
  leadCount: number;
  catalogBenchmarkNis: number | null;
};

export type EventIndexWeek = {
  weekOf: string;
  publishedAt: string;
  sampleSize: number;
  segments: EventIndexSegment[];
  attractions: EventIndexAttraction[];
  geoHeatmap: Record<string, number>;
  topRising: { id: string; label: string; trendPct: number }[];
  topFalling: { id: string; label: string; trendPct: number }[];
};

export const EVENT_INDEX_WEEK: EventIndexWeek = {
  "weekOf": "2026-06-08",
  "publishedAt": "2026-06-13T15:25:30.477Z",
  "sampleSize": 0,
  "segments": [],
  "attractions": [],
  "geoHeatmap": {},
  "topRising": [],
  "topFalling": []
};

export const EVENT_INDEX_HAS_DATA = false;
