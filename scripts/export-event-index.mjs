/**
 * Reads anonymized Event Index payload from Closer export → generates site data.
 *
 * Workflow:
 *   1. Closer → "פרסם דופק שוק" → event-index-input.json
 *   2. Save to local-tools/exports/event-index-input.json
 *   3. npm run export:event-index
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_CANDIDATES = [
  path.join(ROOT, "..", "local-tools", "exports", "event-index-input.json"),
  path.join(ROOT, "..", "local-tools", "event-index-input.json"),
];
const OUT_TS = path.join(ROOT, "lib", "data", "event-index.generated.ts");
const OUT_ALERTS = path.join(ROOT, "lib", "data", "market-alerts.generated.json");

function findInput() {
  for (const p of INPUT_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function emptyWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const weekOf = d.toISOString().slice(0, 10);
  return {
    weekOf,
    publishedAt: new Date().toISOString(),
    sampleSize: 0,
    segments: [],
    attractions: [],
    geoHeatmap: {},
    topRising: [],
    topFalling: [],
  };
}

function sanitizeIndex(index) {
  const week = index || emptyWeek();
  return {
    weekOf: week.weekOf || emptyWeek().weekOf,
    publishedAt: week.publishedAt || new Date().toISOString(),
    sampleSize: Number(week.sampleSize) || 0,
    segments: (week.segments || []).map((s) => ({
      id: String(s.id),
      label: String(s.label),
      avgClosedPriceNis: s.avgClosedPriceNis ?? null,
      catalogBenchmarkNis: s.catalogBenchmarkNis ?? null,
      demandTrendPct: Number(s.demandTrendPct) || 0,
      leadCount: Number(s.leadCount) || 0,
      closedCount: Number(s.closedCount) || 0,
      sampleSufficient: Boolean(s.sampleSufficient),
    })),
    attractions: (week.attractions || []).map((a) => ({
      id: String(a.id),
      label: String(a.label),
      demandTrendPct: Number(a.demandTrendPct) || 0,
      leadCount: Number(a.leadCount) || 0,
      catalogBenchmarkNis: a.catalogBenchmarkNis ?? null,
    })),
    geoHeatmap: week.geoHeatmap || {},
    topRising: (week.topRising || []).slice(0, 5),
    topFalling: (week.topFalling || []).slice(0, 5),
  };
}

const inputPath = findInput();
let payload;
if (inputPath) {
  payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  console.log("[export:event-index] input:", inputPath);
} else {
  console.warn("[export:event-index] no input — writing placeholder (run Closer publish first)");
  payload = { eventIndex: emptyWeek(), arbitrageAlerts: [] };
}

const eventIndex = sanitizeIndex(payload.eventIndex);
const alerts = (payload.arbitrageAlerts || []).map((a) => ({
  id: String(a.id),
  toRegion: String(a.toRegion),
  fromRegion: String(a.fromRegion),
  segmentId: String(a.segmentId),
  segmentLabel: String(a.segmentLabel),
  demandScore: Number(a.demandScore) || 0,
  suggestedPremiumPct: Number(a.suggestedPremiumPct) || 20,
  message: String(a.message || ""),
}));

const tsContent = `/** Auto-generated — npm run export:event-index. Do not edit. */
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

export const EVENT_INDEX_WEEK: EventIndexWeek = ${JSON.stringify(eventIndex, null, 2)};

export const EVENT_INDEX_HAS_DATA = ${eventIndex.sampleSize > 0};
`;

fs.writeFileSync(OUT_TS, tsContent, "utf8");
fs.writeFileSync(
  OUT_ALERTS,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), alerts }, null, 2)}\n`,
  "utf8",
);
console.log("[export:event-index] wrote", OUT_TS);
console.log("[export:event-index] alerts:", alerts.length);
