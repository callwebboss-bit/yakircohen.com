/**
 * Sync opening prices in public/llms.txt from pricing-catalog (single source of truth).
 *
 * Run: npm run sync:llms           - כותב את הבלוק מחדש מהקטלוג
 * Run: npm run audit:llms-prices   - מוודא בלבד, נכשל אם הקובץ השמור התיישן
 *
 * למה יש כאן מצב בדיקה ולא סקריפט אודיט נפרד: רק vercel-build הריץ את הסנכרון,
 * ולכן הקובץ השמור בריפו הצהיר 1,200 ש״ח להקלטת שיר בזמן שהקטלוג אומר 990.
 * שומר שהיה בודק רק "המחיר קיים איפשהו בקטלוג" היה מאשר את זה, כי 1,200 באמת
 * קיים בקטלוג בתור ריטוש תמונות, חבילת תגים קוליים ועדכוני IVR. הדרך היחידה
 * שלא ניתן לרמות אותה היא לייצר את הבלוק מחדש ולהשוות, ולכן הבדיקה חולקת את
 * אותו קוד ייצור בדיוק ולא יכולה לסטות ממנו.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getExVat } from "../lib/data/pricing-catalog";

const root = resolve(import.meta.dirname, "..");
const llmsPath = resolve(root, "public/llms.txt");

function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

function meNis(amount: number): string {
  return `מ-${nis(amount)}`;
}

const half = getExVat("studio_half_hour");
const hour = getExVat("studio_hour");
const podcastAudio = getExVat("podcast_audio");
const podcastVideo = getExVat("podcast_video");
const podcastFull = getExVat("full_podcast_production");
const cover = getExVat("cover_song");
const blessing = getExVat("blessing_recording");
const dj = getExVat("dj_premium");
const attraction = getExVat("event_attraction_1");
const voucherFloor = half;

const pricesBlock = `## מחירי פתיחה (לפני מע״מ, מסונכרן מ-pricing-catalog)
- אולפן - חצי שעה: ${nis(half)} · שעת אולפן: ${nis(hour)}
- פודקאסט אודיו (עד שעה + עריכה): ${nis(podcastAudio)}
- פודקאסט וידאו (3 מצלמות): ${nis(podcastVideo)}
- הפקת פודקאסט מלאה: ${meNis(podcastFull)}
- הקלטת ברכה: ${meNis(blessing)} · הקלטת שיר (קאבר): ${meNis(cover)}
- DJ לאירועים (צוות, כ-4 שעות): ${meNis(dj)}
- אטרקציה בודדת לאירוע: ${meNis(attraction)}
- שובר מתנה לאולפן: ${meNis(voucherFloor)}
- חנות: https://yakircohen.com/shop
`;

const raw = readFileSync(llmsPath, "utf8");
const start = "## מחירי פתיחה";
const nextSection = "\n## מרכזי תוכן עיקריים";
const startIdx = raw.indexOf(start);
const nextIdx = raw.indexOf(nextSection);

if (startIdx === -1 || nextIdx === -1 || nextIdx <= startIdx) {
  console.error("sync:llms — could not find price section markers in llms.txt");
  process.exit(1);
}

const expectedBlock = pricesBlock.trimEnd() + "\n";
const updated = raw.slice(0, startIdx) + expectedBlock + raw.slice(nextIdx);

/* משווים אחרי נרמול סופי שורה: הקובץ נערך גם מווינדוס, וכישלון על CRLF בלבד
   היה מדווח על "מחיר שגוי" בזמן שאף מחיר לא השתנה. */
function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

if (process.argv.includes("--check")) {
  const actualBlock = raw.slice(startIdx, nextIdx);
  if (normalize(actualBlock) === normalize(expectedBlock)) {
    console.log(
      "audit:llms-prices OK — בלוק מחירי הפתיחה ב-llms.txt תואם ל-pricing-catalog.",
    );
    process.exit(0);
  }

  const actualLines = normalize(actualBlock).split("\n");
  const expectedLines = normalize(expectedBlock).split("\n");
  const drifted: string[] = [];
  for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
    if (actualLines[i] !== expectedLines[i]) {
      drifted.push(
        `    בקובץ:  ${actualLines[i] ?? "(חסרה שורה)"}\n` +
          `    בקטלוג: ${expectedLines[i] ?? "(שורה עודפת)"}`,
      );
    }
  }

  console.error("=== audit:llms-prices ===\n");
  console.error(
    `  ✗ מה: public/llms.txt מצהיר מחירי פתיחה שלא תואמים ל-pricing-catalog.ts (${drifted.length} שורות).`,
  );
  console.error(drifted.join("\n"));
  console.error(
    "\n    למה זה חשוב: llms.txt הוא מה שמנועי AI קוראים כדי לצטט מחיר. " +
      "מחיר מיושן שם מתפרסם כעובדה.",
  );
  console.error("    תיקון: npm run sync:llms ואז לשמור את הקובץ ב-git.\n");
  process.exit(1);
}

writeFileSync(llmsPath, updated, "utf8");
console.log("sync:llms OK — public/llms.txt prices synced from pricing-catalog");
