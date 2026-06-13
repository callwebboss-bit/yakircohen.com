/**
 * Audit meta descriptions for WhatsApp/share preview hooks (≤60 chars).
 * Run:
 *   node scripts/audit-share-descriptions.mjs          # Tier 1 only (default)
 *   node scripts/audit-share-descriptions.mjs --all    # all services + hubs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const auditAll = process.argv.includes("--all");

const SHARE_PREVIEW_MAX = 60;
const LOCATION_MARKERS = [
  "במודיעין",
  "ממודיעין",
  "בירושלים",
  "מירושלים",
  "במרכז",
  "לכל הארץ",
];

export function auditShareHook(description) {
  const dotIndex = description.indexOf(".");
  const hookEnd =
    dotIndex >= 0
      ? dotIndex + 1
      : Math.min(description.length, SHARE_PREVIEW_MAX);
  const hook = description.slice(0, hookEnd).trim();
  const hookLength = hook.length;
  const hasLocation = LOCATION_MARKERS.some((m) => hook.includes(m));
  const preview = description.slice(0, SHARE_PREVIEW_MAX);
  const endsClean =
    dotIndex >= 0 && dotIndex < SHARE_PREVIEW_MAX
      ? true
      : !/[א-תa-zA-Z]$/.test(preview) || preview.length < SHARE_PREVIEW_MAX;

  return {
    preview,
    ok: hasLocation && hookLength <= SHARE_PREVIEW_MAX + 5 && endsClean,
    hookLength,
    hasLocation,
  };
}

function extractDefaultDescription() {
  const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const match = layout.match(
    /const DEFAULT_DESCRIPTION\s*=\s*\n?\s*["'`]([^"'`]+)["'`]/,
  );
  return match?.[1] ?? null;
}

function extractHubDescription(hubConst) {
  const file = fs.readFileSync(
    path.join(root, "lib", "seo", "hub-pages.ts"),
    "utf8",
  );
  const block = file.match(
    new RegExp(
      `export const ${hubConst}[\\s\\S]*?description:\\s*\\n?\\s*["'\`]([^"'\`]+)["'\`]`,
    ),
  );
  return block?.[1] ?? null;
}

function extractServiceMetaDescription(serviceId) {
  const file = fs.readFileSync(
    path.join(root, "lib", "data", "services.ts"),
    "utf8",
  );
  const block = file.match(
    new RegExp(
      `"${serviceId}"[\\s\\S]*?metaDescription:\\s*\\n?\\s*["'\`]([^"'\`]+)["'\`]`,
    ),
  );
  return block?.[1] ?? null;
}

function extractAllServiceDescriptions() {
  const file = fs.readFileSync(
    path.join(root, "lib", "data", "services.ts"),
    "utf8",
  );
  const re =
    /"([^"]+)":\s*\{[\s\S]*?metaDescription:\s*\n?\s*["']([^"']+)["']/g;
  const entries = [];
  let m;
  while ((m = re.exec(file))) {
    entries.push({ label: `services:${m[1]}`, description: m[2] });
  }
  return entries;
}

function extractAllHubDescriptions() {
  const file = fs.readFileSync(
    path.join(root, "lib", "seo", "hub-pages.ts"),
    "utf8",
  );
  const re =
    /export const (\w+)[\s\S]*?description:\s*\n?\s*["']([^"']+)["']/g;
  const entries = [];
  let m;
  while ((m = re.exec(file))) {
    entries.push({ label: `hub:${m[1]}`, description: m[2] });
  }
  return entries;
}

/** Tier 1 — GSC top pages + high-share routes */
const TIER1 = [
  { label: "דף הבית", getDescription: extractDefaultDescription },
  {
    label: "/studio/recording-song-modiin",
    getDescription: () =>
      extractServiceMetaDescription("recording-song-modiin"),
  },
  {
    label: "/studio/recording-studio",
    getDescription: () =>
      extractServiceMetaDescription("studio-recording-studio"),
  },
  {
    label: "/podcast",
    getDescription: () => extractHubDescription("PODCAST_HUB_SEO"),
  },
  {
    label: "/events",
    getDescription: () => extractServiceMetaDescription("events-hub"),
  },
  {
    label: "/events/dj-events",
    getDescription: () => extractServiceMetaDescription("events-dj"),
  },
  {
    label: "/events/wedding-attractions-packages",
    getDescription: () =>
      extractServiceMetaDescription("events-wedding-packages"),
  },
  {
    label: "/pricing",
    getDescription: () => extractHubDescription("PRICING_HUB_SEO"),
  },
  {
    label: "/online",
    getDescription: () => extractHubDescription("ONLINE_HUB_SEO"),
  },
];

function auditEntries(entries) {
  const failures = [];
  for (const entry of entries) {
    const description =
      typeof entry.getDescription === "function"
        ? entry.getDescription()
        : entry.description;
    if (!description) {
      failures.push({ label: entry.label, reason: "description not found" });
      continue;
    }
    const audit = auditShareHook(description);
    if (!audit.ok) {
      failures.push({
        label: entry.label,
        reason: `hook=${audit.preview} (${audit.hookLength} chars, location=${audit.hasLocation})`,
      });
    }
  }
  return failures;
}

const entries = auditAll
  ? [
      { label: "דף הבית", getDescription: extractDefaultDescription },
      ...extractAllServiceDescriptions(),
      ...extractAllHubDescriptions(),
    ]
  : TIER1;

const failures = auditEntries(entries);
const scope = auditAll ? "all" : "Tier-1";

if (failures.length === 0) {
  console.log(`audit:share — all ${entries.length} ${scope} descriptions pass`);
  process.exit(0);
}

console.log(`audit:share — ${failures.length} ${scope} failure(s):`);
for (const f of failures) {
  console.log(`  ${f.label}: ${f.reason}`);
}
process.exit(1);
