/**
 * Audit rendered title length (with brand suffix) — Tier-1 by default.
 * Run:
 *   node scripts/audit-seo-title-length.mjs          # Tier-1 (verify:seo)
 *   node scripts/audit-seo-title-length.mjs --all    # every hub + service metaTitle
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BRAND = "יקיר כהן הפקות";
const SUFFIX = ` | ${BRAND}`;
const MIN = 50;
const MAX = 60;
const auditAll = process.argv.includes("--all");

export function fullTitle(base) {
  let t = base.trim();
  while (t.endsWith(SUFFIX)) t = t.slice(0, -SUFFIX.length).trim();
  const pipeBrand = new RegExp(`\\s*\\|\\s*${BRAND}\\s*$`);
  while (pipeBrand.test(t)) t = t.replace(pipeBrand, "").trim();
  return `${t}${SUFFIX}`;
}

function extractHubTitle(hubConst) {
  const file = fs.readFileSync(path.join(root, "lib/seo/hub-pages.ts"), "utf8");
  const block = file.match(
    new RegExp(
      `export const ${hubConst}[\\s\\S]*?title:\\s*\\n?\\s*["'\`]([^"'\`]+)["'\`]`,
    ),
  );
  return block?.[1] ?? null;
}

function extractServiceMetaTitle(serviceId) {
  const file = fs.readFileSync(path.join(root, "lib/data/services.ts"), "utf8");
  const block = file.match(
    new RegExp(`"${serviceId}"[\\s\\S]*?metaTitle:\\s*\\n?\\s*["'\`]([^"'\`]+)["'\`]`),
  );
  return block?.[1] ?? null;
}

function check(label, title, issues) {
  if (!title) {
    issues.push({ label, reason: "title not found" });
    return;
  }
  const full = fullTitle(title);
  const len = full.length;
  if (len < MIN || len > MAX) {
    issues.push({ label, len, title, full });
  }
}

/** GSC / share Tier-1 routes — aligned with audit-share-descriptions.mjs */
const TIER1 = [
  { label: "/", getTitle: () => extractHomeTitle() },
  {
    label: "/studio/recording-song-modiin",
    getTitle: () => extractServiceMetaTitle("recording-song-modiin"),
  },
  {
    label: "/studio/recording-studio",
    getTitle: () => extractServiceMetaTitle("studio-recording-studio"),
  },
  { label: "/studio", getTitle: () => extractServiceMetaTitle("studio-hub") },
  { label: "/podcast", getTitle: () => extractHubTitle("PODCAST_HUB_SEO") },
  { label: "/events", getTitle: () => extractServiceMetaTitle("events-hub") },
  { label: "/events/dj-events", getTitle: () => extractServiceMetaTitle("events-dj") },
  {
    label: "/events/wedding-attractions-packages",
    getTitle: () => extractServiceMetaTitle("events-wedding-packages"),
  },
  { label: "/pricing", getTitle: () => extractHubTitle("PRICING_HUB_SEO") },
  { label: "/online", getTitle: () => extractHubTitle("ONLINE_HUB_SEO") },
  { label: "/book", getTitle: () => extractBookTitle() },
];

function extractHomeTitle() {
  const page = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8");
  return page.match(/const HOME_TITLE\s*=\s*"([^"]+)"/)?.[1] ?? null;
}

function extractBookTitle() {
  const file = fs.readFileSync(path.join(root, "lib/seo/book-page.ts"), "utf8");
  return file.match(/BOOK_PAGE_TITLE\s*=\s*"([^"]+)"/)?.[1] ?? null;
}

function collectAllTitles() {
  const entries = [];
  const hubFile = fs.readFileSync(path.join(root, "lib/seo/hub-pages.ts"), "utf8");
  for (const m of hubFile.matchAll(
    /export const \w+_HUB_SEO[\s\S]*?slug: "([^"]+)"[\s\S]*?title: "([^"]+)"/g,
  )) {
    entries.push({ label: `hub:${m[1]}`, title: m[2] });
  }
  entries.push({ label: "page:home", title: extractHomeTitle() });
  entries.push({ label: "page:book", title: extractBookTitle() });
  const svc = fs.readFileSync(path.join(root, "lib/data/services.ts"), "utf8");
  let idx = 0;
  for (const m of svc.matchAll(/metaTitle:\s*["']([^"']+)["']/g)) {
    idx += 1;
    entries.push({ label: `service#${idx}`, title: m[1] });
  }
  return entries;
}

const issues = [];

if (auditAll) {
  for (const { label, title } of collectAllTitles()) {
    check(label, title, issues);
  }
} else {
  for (const entry of TIER1) {
    check(entry.label, entry.getTitle(), issues);
  }
}

issues.sort((a, b) => (b.len ?? 0) - (a.len ?? 0));

const scope = auditAll ? "all" : "Tier-1";

if (issues.length === 0) {
  console.log(
    `audit:seo-title-length -- all ${scope} titles within ${MIN}-${MAX} chars (with suffix)`,
  );
  process.exit(0);
}

console.log(
  `audit:seo-title-length -- ${issues.length} ${scope} title(s) outside ${MIN}-${MAX} chars:`,
);
for (const issue of issues) {
  if (issue.reason) {
    console.log(`  ${issue.label}: ${issue.reason}`);
    continue;
  }
  console.log(`  [${issue.len}] ${issue.label}`);
  console.log(`       base: ${issue.title}`);
  console.log(`       full: ${issue.full}`);
}
process.exit(1);
