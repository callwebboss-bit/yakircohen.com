/**
 * Static audit: required GA4 funnel + micro-conversion event names
 * must appear in the analytics layer and at least one call site.
 * Run: node scripts/audit-funnel-events.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const GA4_LEAD_FUNNEL_STEPS = [
  "book_wizard_start",
  "book_wizard_step",
  "book_lead_submit",
  "book_success_wa_click",
];

const GA4_MICRO_CONVERSIONS = [
  "portfolio_demo_play",
  "pricing_calculator_interact",
  "whatsapp_fab_click",
  "thank_you_upsell_click",
  "shop_cta_click",
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === "dist"
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = [
  ...walk(path.join(ROOT, "lib")),
  ...walk(path.join(ROOT, "components")),
  ...walk(path.join(ROOT, "hooks")),
];

const corpus = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");

const required = [...GA4_LEAD_FUNNEL_STEPS, ...GA4_MICRO_CONVERSIONS];
const missing = required.filter((name) => {
  return !corpus.includes(`"${name}"`) && !corpus.includes(`'${name}'`);
});

if (missing.length) {
  console.error("audit:funnel-events FAILED — missing event wiring:");
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}

const callSiteChecks = [
  { name: "whatsapp_fab_click", needle: "whatsapp_fab_click" },
  { name: "portfolio_demo_play", needle: "portfolio_demo_play" },
  { name: "pricing_calculator_interact", needle: "pricing_calculator_interact" },
  { name: "thank_you_upsell_click", needle: "thank_you_upsell_click" },
  { name: "shop_cta_click", needle: "shop_cta_click" },
  { name: "book_wizard_start", needle: 'trackConversion("book_wizard_start"' },
  { name: "book_lead_submit", needle: 'trackConversion("book_lead_submit"' },
];

const missingCalls = callSiteChecks.filter((c) => !corpus.includes(c.needle));

if (missingCalls.length) {
  console.error("audit:funnel-events FAILED — missing call sites:");
  for (const m of missingCalls) console.error(`  - ${m.name}`);
  process.exit(1);
}

console.log(
  `audit:funnel-events OK (${required.length} events, ${callSiteChecks.length} call-site checks)`,
);
