/**
 * עמודי הליבה חייבים לפלוט אות AEO אמיתי: AnswerBlock, Speakable או FAQPage.
 *
 * הגרסה הקודמת עברה ללא תנאי. כל רשומה כללה גם את ServicePageLayout.tsx
 * המשותף, שמכיל את הסימנים האלה תמיד, ולכן שום עמוד לא יכול היה להיכשל.
 * בנוסף "metaDescription={" נספר כסימן AEO, וזה לא אות AEO בשום הגדרה.
 *
 * הכלל עכשיו: הקובץ של העמוד עצמו (לא ה-layout) חייב או לרנדר רכיב AEO
 * בעצמו, או להעביר faqs={...} ל-layout, שהופך אותן ל-FAQPage. זה בדיוק
 * המסלול שדפי הרג'יסטרי משתמשים בו, ולכן הוא אות אמיתי ולא הזדמנות לעקוף.
 *
 * Run: node scripts/audit-aeo-coverage.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** רק קבצי התוכן של העמוד. ה-layout המשותף לא נכלל בכוונה. */
const TIER1 = [
  { path: "/studio", files: ["components/services/ServicePageFromRegistry.tsx"] },
  { path: "/podcast", files: ["components/seo/PodcastHubPageContent.tsx"] },
  {
    path: "/events",
    files: ["components/services/ServicePageFromRegistry.tsx", "components/seo/EventsAttractionsSchema.tsx"],
  },
  { path: "/shop", files: ["components/seo/ShopPageContent.tsx"] },
  { path: "/pricing", files: ["app/pricing/page.tsx", "components/pricing/PricingFaqSection.tsx"] },
  { path: "/events/dj-events", files: ["components/seo/DjEventsPageContent.tsx"] },
  { path: "/studio/recording-song-modiin", files: ["components/seo/RecordingSongModiinPageContent.tsx"] },
  { path: "/podcast/podcast-recording", files: ["components/seo/PodcastRecordingPageContent.tsx"] },
  { path: "/online/vocal-fix", files: ["components/seo/OnlineVocalFixPageContent.tsx"] },
  { path: "/events/bar-mitzvah", files: ["components/seo/BarMitzvahPageContent.tsx"] },
  { path: "/events/attractions/confetti-cannon", files: ["components/seo/ConfettiCannonPageContent.tsx"] },
];

/** סימנים שמעידים על פליטת AEO אמיתית מהעמוד עצמו */
const AEO_MARKERS = [
  "<AnswerBlock",
  "<SpeakableSchema",
  "<FaqPageSchema",
  "buildFaqSchema(",
  '"@type": "FAQPage"',
  'data-speakable="true"',
  /** העברת שאלות ל-layout שהופך אותן ל-FAQPage */
  "faqs={",
  /** האצלה למרנדר הרג'יסטרי, שפולט FaqPageSchema מ-service.faqs (כמו /studio ו-/events) */
  "<ServicePageFromRegistry",
];

const errors = [];
const evidence = [];

for (const tier of TIER1) {
  const found = [];
  for (const rel of tier.files) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) {
      errors.push(`${tier.path}: הקובץ ${rel} לא קיים. הרשומה באודיט התיישנה.`);
      continue;
    }
    const src = fs.readFileSync(full, "utf8");
    for (const marker of AEO_MARKERS) {
      if (src.includes(marker)) found.push(`${path.basename(rel)}:${marker.replace(/[<"={(]/g, "")}`);
    }
  }
  if (found.length) evidence.push(`  ✓ ${tier.path.padEnd(38)} ${found[0]}`);
  else
    errors.push(
      `${tier.path}: אין אף אות AEO ב-${tier.files.join(", ")}.\n` +
        `      להוסיף AnswerBlock או SpeakableSchema לעמוד, או להעביר faqs={...} ל-ServicePageLayout.`,
    );
}

console.log("=== audit:aeo-coverage ===\n");
if (errors.length) {
  console.error(`נמצאו ${errors.length} בעיות:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`תקין. ${TIER1.length} עמודי ליבה פולטים אות AEO מהקובץ שלהם עצמם:`);
for (const line of evidence) console.log(line);
