/**
 * Tier-1 hubs must expose AEO signals (answer block or speakable).
 * Run: node scripts/audit-aeo-coverage.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TIER1 = [
  {
    path: "/studio",
    files: [
      "components/services/ServicePageFromRegistry.tsx",
      "components/services/ServicePageLayout.tsx",
    ],
  },
  {
    path: "/podcast",
    files: ["components/seo/PodcastHubPageContent.tsx", "components/services/ServicePageLayout.tsx"],
  },
  {
    path: "/events",
    files: ["components/services/ServicePageFromRegistry.tsx", "components/seo/EventsAttractionsSchema.tsx"],
  },
  { path: "/shop", files: ["components/seo/ShopPageContent.tsx"] },
  {
    path: "/pricing",
    files: ["app/pricing/page.tsx", "components/pricing/PricingFaqSection.tsx"],
  },
];

const AEO_MARKERS = [
  "AnswerBlock",
  'data-speakable="true"',
  "SpeakableSchema",
  "faq-aeo",
  "FaqPageSchema",
  "buildFaqSchema",
  '"@type": "FAQPage"',
];

const errors = [];

for (const tier of TIER1) {
  const hit = tier.files.some((rel) => {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) return false;
    const src = fs.readFileSync(full, "utf8");
    return AEO_MARKERS.some((marker) => src.includes(marker));
  });
  if (!hit) {
    errors.push(`${tier.path}: missing AEO markers in ${tier.files.join(", ")}`);
  }
}

if (errors.length) {
  console.error("audit:aeo-coverage failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`audit:aeo-coverage OK (${TIER1.length} tier-1 hubs)`);
