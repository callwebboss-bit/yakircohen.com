/**
 * Sync every service price in public/llms.txt from pricing-catalog (single source of truth).
 *
 * Run: npm run sync:llms           - כותב את המחירים מחדש מהקטלוג
 * Run: npm run audit:llms-prices   - מוודא בלבד, נכשל אם הקובץ השמור התיישן
 *
 * למה יש כאן מצב בדיקה ולא סקריפט אודיט נפרד: רק vercel-build הריץ את הסנכרון,
 * ולכן הקובץ השמור בריפו הצהיר 1,200 ש״ח להקלטת שיר בזמן שהקטלוג אומר 990.
 * שומר שהיה בודק רק "המחיר קיים איפשהו בקטלוג" היה מאשר את זה, כי 1,200 באמת
 * קיים בקטלוג בתור ריטוש תמונות, חבילת תגים קוליים ועדכוני IVR. הדרך היחידה
 * שלא ניתן לרמות אותה היא לייצר את המחיר מחדש ולהשוות, ולכן הבדיקה חולקת את
 * אותו קוד ייצור בדיוק ולא יכולה לסטות ממנו.
 *
 * למה הורחב ל-INLINE_PRICES (4.10.2026): עשרה מחירים ישבו מחוץ לבלוק המיוצר,
 * בשורות השירות של /business ו-/online. audit-llms-prices.mjs בדק אותם בבדיקת
 * קיום בלבד והדפיס את מגבלתו בעצמו: "היא לא יכולה לדעת שהמחיר שייך לשירות
 * שבשורה". נמדד שכל העשרה נכונים היום, ולכן זו הקשחה ולא תיקון באג. הסכנה
 * הייתה עתידית: 1,650 ש״ח בשורת סושיאל דאמפ היה ממשיך לעבור גם אם הקטלוג
 * היה משנה אותו, כי 1,650 קיים בקטלוג גם בתור פודקאסט וידאו.
 *
 * הטקסט של כל שורה נשאר כתוב ביד. מיוצר רק הזנב שאחרי ה-" · ", כלומר המחיר.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getExVat, type PriceItemId } from "../lib/data/pricing-catalog";

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
const voiceoverIvr = getExVat("voiceover_ivr");
const voiceoverPromo = getExVat("voiceover_promo");
const noiseBasic = getExVat("ai_noise_basic");
const voiceRestore = getExVat("ai_voice_restore");

const pricesBlock = `## מחירי פתיחה (לפני מע״מ, מסונכרן מ-pricing-catalog)
- אולפן - חצי שעה: ${nis(half)} · שעת אולפן: ${nis(hour)}
- פודקאסט אודיו (עד שעה + עריכה): ${nis(podcastAudio)}
- פודקאסט וידאו (3 מצלמות): ${nis(podcastVideo)}
- הפקת פודקאסט מלאה: ${meNis(podcastFull)}
- הקלטת ברכה: ${meNis(blessing)} · הקלטת שיר (קאבר): ${meNis(cover)}
- קריינות למרכזייה: ${nis(voiceoverIvr)} · קריינות לסרטון תדמית: ${nis(voiceoverPromo)}
- ניקוי רעשים בהקלטה: ${meNis(noiseBasic)} · שחזור קול מלא: ${nis(voiceRestore)}
- DJ לאירועים (צוות, כ-4 שעות): ${meNis(dj)}
- אטרקציה בודדת לאירוע: ${meNis(attraction)}
- שובר מתנה לאולפן: ${meNis(voucherFloor)}
- חנות: https://yakircohen.com/shop
`;

/**
 * שורות מחיר שיושבות מחוץ לבלוק, בסעיפי /business ו-/online.
 * הכתובת היא העוגן כי היא ייחודית בקובץ, ו-`prefix` הוא הניסוח שלפני הסכום.
 * כל רשומה חייבת להתאים לשורה אחת בדיוק, אחרת הסקריפט נכשל.
 */
const INLINE_PRICES: readonly { url: string; id: PriceItemId; prefix: string }[] = [
  { url: "https://yakircohen.com/academy/workshops", id: "workshop_team_2h", prefix: "מ-" },
  { url: "https://yakircohen.com/business/content-studio", id: "content_studio_pilot", prefix: "מ-" },
  { url: "https://yakircohen.com/business/on-site-studio", id: "on_site_half_day", prefix: "חצי יום " },
  { url: "https://yakircohen.com/business/corporate-songs", id: "corp_song_toast", prefix: "מ-" },
  { url: "https://yakircohen.com/business/audiobooks", id: "audiobook_sample", prefix: "פרק דוגמה " },
  { url: "https://yakircohen.com/business/audio-branding", id: "audio_brand_starter", prefix: "מ-" },
  { url: "https://yakircohen.com/business/employer-branding", id: "employer_welcome", prefix: "מ-" },
  { url: "https://yakircohen.com/online/legacy-digitization", id: "legacy_dig_basic", prefix: "מ-" },
  { url: "https://yakircohen.com/online/transcription", id: "transcribe_30min", prefix: "מ-" },
  { url: "https://yakircohen.com/online/voice-cloning", id: "voice_clone_setup", prefix: "מ-" },
];

/**
 * הקובץ מנורמל ל-LF מיד בקריאה, לפני כל חיתוך.
 *
 * למה: עץ העבודה מסונכרן ב-Dropbox בין מק לווינדוס, ולכן 786 קבצים בו הם
 * CRLF בזמן שהאינדקס של git הוא LF. הגבול למטה הוא `"\n## ..."`, ובקובץ
 * CRLF ה-indexOf תופס את ה-\n שבתוך \r\n. החיתוך נגמר שם ומשאיר \r בודד
 * בסוף הבלוק, ו-normalize למטה מחליף רק זוגות \r\n. התוצאה: השער דיווח
 * "מחיר שגוי" על שורה שנראית ריקה בשני הצדדים, בזמן שאף מחיר לא השתנה.
 * נמדד 19.9.2026 בווינדוס, ואומת שקורה גם במק.
 *
 * הנרמול כאן מתקן גם את מצב הכתיבה: קודם הוא הזריק בלוק LF לתוך קובץ
 * CRLF ויצר קובץ מעורב. עכשיו הקובץ נכתב LF אחיד, כלומר בדיוק מה
 * שהאינדקס כבר מכיל, ולכן git לא רואה שינוי בכלל.
 */
const raw = readFileSync(llmsPath, "utf8").replace(/\r\n/g, "\n");

function fail(message: string): never {
  console.error(`sync:llms — ${message}`);
  process.exit(1);
}

function replacePricesBlock(text: string): string {
  const start = "## מחירי פתיחה";
  const nextSection = "\n## מרכזי תוכן עיקריים";
  const startIdx = text.indexOf(start);
  const nextIdx = text.indexOf(nextSection);

  if (startIdx === -1 || nextIdx === -1 || nextIdx <= startIdx) {
    fail("could not find price section markers in llms.txt");
  }

  return text.slice(0, startIdx) + pricesBlock.trimEnd() + "\n" + text.slice(nextIdx);
}

function replaceInlinePrices(text: string): string {
  const lines = text.split("\n");
  for (const entry of INLINE_PRICES) {
    const hits: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("- ") && lines[i].includes(entry.url)) hits.push(i);
    }
    if (hits.length !== 1) {
      fail(
        `expected exactly one line for ${entry.url} in llms.txt, found ${hits.length}. ` +
          "הכתובת היא העוגן של המחיר, ולכן היא חייבת להופיע פעם אחת בשורת רשימה.",
      );
    }
    const line = lines[hits[0]];
    const sepIdx = line.indexOf(" · ");
    if (sepIdx === -1) {
      fail(`line for ${entry.url} lost its " · " price separator in llms.txt`);
    }
    lines[hits[0]] = `${line.slice(0, sepIdx)} · ${entry.prefix}${nis(getExVat(entry.id))}`;
  }
  return lines.join("\n");
}

const expected = replaceInlinePrices(replacePricesBlock(raw));

if (process.argv.includes("--check")) {
  if (raw === expected) {
    console.log(
      `audit:llms-prices OK — ${INLINE_PRICES.length + 11} מחירים ב-llms.txt תואמים ל-pricing-catalog.`,
    );
    process.exit(0);
  }

  const actualLines = raw.split("\n");
  const expectedLines = expected.split("\n");
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
    `  ✗ מה: public/llms.txt מצהיר מחירים שלא תואמים ל-pricing-catalog.ts (${drifted.length} שורות).`,
  );
  console.error(drifted.join("\n"));
  console.error(
    "\n    למה זה חשוב: llms.txt הוא מה שמנועי AI קוראים כדי לצטט מחיר. " +
      "מחיר מיושן שם מתפרסם כעובדה.",
  );
  console.error("    תיקון: npm run sync:llms ואז לשמור את הקובץ ב-git.\n");
  process.exit(1);
}

writeFileSync(llmsPath, expected, "utf8");
console.log(
  `sync:llms OK — ${INLINE_PRICES.length + 11} מחירים ב-public/llms.txt סונכרנו מ-pricing-catalog`,
);
