import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_FILE = path.join(ROOT, "lib", "data", "pricing-catalog.ts");
const PRICING_FILE = path.join(ROOT, "lib", "data", "pricing.ts");
const DOCS_PRICING = path.join(ROOT, "docs", "PRICING.md");
const DATA_DIR = path.join(ROOT, "lib", "data");

const VAT_RATE = 0.18;
const errors = [];
const warnings = [];

function withVat(exVat) {
  return Math.round(exVat * (1 + VAT_RATE));
}

function parseCatalogExVatValues(text) {
  const items = [];
  const re = /exVat:\s*(\d+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    items.push(Number(m[1]));
  }
  return items;
}

function parsePricingConstants(text) {
  const map = {};
  const re = /export const (\w+)\s*=\s*getExVat\("([^"]+)"\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

function parseCatalogById(text) {
  const map = {};
  const re = /\{\s*id:\s*"([^"]+)"[^}]*exVat:\s*(\d+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    map[m[1]] = Number(m[2]);
  }
  return map;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".ts") && e.name !== "pricing-catalog.ts") out.push(full);
  }
  return out;
}

// 1. Validate VAT math for every catalog price
const catalogText = fs.readFileSync(CATALOG_FILE, "utf8");
for (const exVat of parseCatalogExVatValues(catalogText)) {
  const expected = withVat(exVat);
  const manual = Math.round(exVat * 1.18);
  if (expected !== manual) {
    errors.push(`VAT mismatch for ${exVat}: withVat=${expected}, manual=${manual}`);
  }
}

// 2. pricing.ts constants must match catalog ids
const pricingText = fs.readFileSync(PRICING_FILE, "utf8");
const catalogById = parseCatalogById(catalogText);
const pricingRefs = parsePricingConstants(pricingText);

for (const [constName, id] of Object.entries(pricingRefs)) {
  if (!(id in catalogById)) {
    errors.push(`pricing.ts ${constName} references unknown catalog id "${id}"`);
  }
}

// 3. Stale docs check
if (fs.existsSync(DOCS_PRICING)) {
  const docs = fs.readFileSync(DOCS_PRICING, "utf8");
  if (docs.includes("980 ₪ - שעת אולפן") || docs.includes("980 ₪")) {
    const hourExVat = catalogById.studio_hour;
    if (hourExVat && docs.includes("980")) {
      errors.push(
        `docs/PRICING.md mentions stale 980 ₪ -- studio hour is ${hourExVat} ₪ ex-VAT`,
      );
    }
  }
}

// 4. Warn on hardcoded catalog prices duplicated in lib/data (heuristic)
const catalogPrices = new Set(parseCatalogExVatValues(catalogText));
const duplicateHits = new Map();

for (const file of walk(DATA_DIR)) {
  const rel = path.relative(ROOT, file);
  if (rel === path.join("lib", "data", "pricing.ts")) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const price of catalogPrices) {
    if (price < 100) continue;
    const re = new RegExp(`(?:price|exVat):\\s*${price}\\b`);
    if (re.test(text) && !text.includes("getExVat(")) {
      const key = `${price}`;
      if (!duplicateHits.has(key)) duplicateHits.set(key, []);
      duplicateHits.get(key).push(rel);
    }
  }
}

for (const [price, files] of duplicateHits) {
  if (files.length > 0) {
    warnings.push(
      `Hardcoded price ${price} in ${files.slice(0, 3).join(", ")}${files.length > 3 ? "…" : ""} -- prefer getExVat() from pricing-catalog.ts`,
    );
  }
}

// 5. Event attraction bundle tiers: events-booking + attraction-book-pricing vs catalog
const eventsBookingPath = path.join(DATA_DIR, "events-booking.ts");
const attractionPricingPath = path.join(DATA_DIR, "attraction-book-pricing.ts");
for (const filePath of [eventsBookingPath, attractionPricingPath]) {
  if (!fs.existsSync(filePath)) continue;
  const text = fs.readFileSync(filePath, "utf8");
  for (let tier = 1; tier <= 4; tier++) {
    const id = `event_attraction_${tier}`;
    const catalogPrice = catalogById[id];
    if (catalogPrice === undefined) {
      errors.push(`Missing catalog id "${id}" for event bundle audit`);
      continue;
    }
    const re = new RegExp(`getExVat\\("${id}"\\)`);
    if (!re.test(text)) {
      warnings.push(
        `${path.relative(ROOT, filePath)} does not reference getExVat("${id}") — verify bundle sync`,
      );
    }
  }
}

const eventSingle = catalogById.event_attraction_1;
const eventBundle4 = catalogById.event_attraction_4;
if (eventSingle !== undefined && eventBundle4 !== undefined && eventBundle4 < eventSingle * 2) {
  warnings.push(
    `event_attraction_4 (${eventBundle4}) is less than 2× event_attraction_1 (${eventSingle}) — check bundle math`,
  );
}

console.log("=== audit:pricing ===\n");

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  console.log("");
}

if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(`✓ Catalog VAT math OK (${parseCatalogExVatValues(catalogText).length} prices)`);
console.log(`✓ pricing.ts constants aligned with catalog`);
console.log("✓ Event attraction bundle files reference pricing-catalog tiers");
if (warnings.length === 0) {
  console.log("✓ No duplicate hardcoded catalog prices detected in lib/data");
}
console.log("\nAudit passed.");
