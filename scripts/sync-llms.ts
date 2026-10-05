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
import { DJ_PER_EVENT_NOTE, DJ_TEAM_NOTE, DJ_YAKIR_NOTE, getExVat, getPriceById, type PriceItemId } from "../lib/data/pricing-catalog";
import { djTravelFeesLine } from "../lib/data/dj-travel-fees";
import { TIME_CLAIMS } from "../lib/data/conversion-copy";
import { withVat } from "../lib/data/pricing";
import { getSongParticipantsExplanation, SONG_ADDON_IDS, SONG_OFFER_BASE_ID } from "../lib/data/song-offer";
import { mobileChannelPriceLine } from "../lib/data/mobile-studio-booking";
import { EXTRA_PERSON_COST_NOTE } from "../lib/data/participant-cost-copy";

const root = resolve(import.meta.dirname, "..");
const llmsPath = resolve(root, "public/llms.txt");

function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/* שלב 4 WP12 (S29, OE-40, PB-29): כל שורה אומרת במפורש אם המחיר כולל מע״מ.
   צרכן: כולל מע״מ קודם ולפני מע״מ בסוגריים. עסקים: לפני מע״מ. */
function consumer(id: PriceItemId, from = false): string {
  const ex = getExVat(id);
  return `${from ? "מ-" : ""}${nis(withVat(ex))} כולל מע״מ (${nis(ex)} + מע״מ)`;
}

function business(id: PriceItemId, from = false): string {
  return `${from ? "מ-" : ""}${nis(getExVat(id))} + מע״מ`;
}

/* השיר והתוספות נקראים מהקטלוג דרך song-offer, כך שתוספת חדשה או מחיר חדש
   נכנסים לכאן מעצמם. */
function songAddonLine(id: PriceItemId): string {
  const item = getPriceById(id);
  const note = item.requires ? `, רק עם ${getPriceById(item.requires as PriceItemId).label}` : "";
  return `${item.label}${note} +${nis(withVat(item.exVat))}`;
}
const songAddons = SONG_ADDON_IDS.map(songAddonLine).join(" · ");

const pricesBlock = `## מחירי פתיחה (מסונכרן מ-pricing-catalog. כולל מע״מ, ובסוגריים לפני מע״מ)
- אולפן - חצי שעה, קובץ גולמי בלי עריכה: ${consumer("studio_half_hour")} · שעת אולפן: ${consumer("studio_hour")}
- פודקאסט אודיו (עד שעה + עריכה): ${consumer("podcast_audio")}
- פודקאסט וידאו (3 מצלמות): ${consumer("podcast_video")}
- הפקת פודקאסט מלאה: ${consumer("full_podcast_production", true)}
- בכל הקלטת פודקאסט, באולפן וגם בבית או במשרד של הלקוח: ${TIME_CLAIMS.podcastSameSecond} (ההקלטה עוברת ישר מהמצלמות למחשב, עם חיתוך חי לפי מי שמדבר)
- הקלטת ברכה: ${consumer("blessing_recording", true)}
- הקלטת שיר באולפן (הקלטה, מיקס ומאסטר, סשן של שעה, תיקון זיופים לא כלול): ${consumer(SONG_OFFER_BASE_ID)}
- תוספות לשיר, כולל מע״מ: ${songAddons}
- משתתפים בשיר (זמר אחד כלול): ${getSongParticipantsExplanation().withVat} ${getSongParticipantsExplanation().exVat}, ${getSongParticipantsExplanation().limit}. ${EXTRA_PERSON_COST_NOTE}
- אולפן נייד בבית או במשרד (הגעה עם כל הציוד, התאורה והצוות, ופרק פודקאסט אודיו מוגמר לאדם אחד כלול: הקלטה, עריכה ומסירה): ${consumer("mobile_podcast_at_home", true)} · ${mobileChannelPriceLine()}
- קריינות למרכזייה (שלוש הודעות): ${consumer("voiceover_ivr")} · קריינות לסרטון תדמית: ${consumer("voiceover_promo")}
- ניקוי רעשים בהקלטה קיימת: ${consumer("ai_noise_basic", true)} · שחזור קול מלא: ${consumer("ai_voice_restore")}
- DJ לאירועים (${DJ_TEAM_NOTE}): ${consumer("dj_premium", true)}
- DJ יקיר כהן אישית (${DJ_YAKIR_NOTE}): ${consumer("dj_yakir_personal", true)}
- DJ: ${DJ_PER_EVENT_NOTE} ${djTravelFeesLine()}
- אטרקציה בודדת לאירוע: ${consumer("event_attraction_1", true)}
- שובר מתנה לאולפן: ${consumer("studio_half_hour", true)} · ${TIME_CLAIMS.voucherInstant}
- חנות: https://yakircohen.com/shop
`;

/**
 * מחירים בשורות התוכן, לפי כתובת. השורה נכתבת מחדש מהקטלוג, ו---check נכשל אם
 * היא התיישנה. עד עכשיו אלה היו עשרה מספרים כתובים ביד בלי ציון מע״מ.
 */
const BODY_PRICES: Record<string, string> = {
  "https://yakircohen.com/academy/workshops": business("workshop_team_2h", true),
  "https://yakircohen.com/business/content-studio": business("content_studio_pilot", true),
  "https://yakircohen.com/business/on-site-studio": `חצי יום ${business("on_site_half_day")}`,
  "https://yakircohen.com/business/corporate-songs": business("corp_song_toast", true),
  "https://yakircohen.com/business/audiobooks": `פרק דוגמה ${business("audiobook_sample")}`,
  "https://yakircohen.com/business/audio-branding": business("audio_brand_starter", true),
  "https://yakircohen.com/business/employer-branding": business("employer_welcome", true),
  "https://yakircohen.com/online/legacy-digitization": consumer("legacy_dig_basic", true),
  "https://yakircohen.com/online/transcription": consumer("transcribe_30min", true),
  "https://yakircohen.com/online/voice-cloning": consumer("voice_clone_setup", true),
};

function applyBodyPrices(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const m = line.match(/^(- [^:]+: )(https:\/\/yakircohen\.com\/\S+)( · .*)?$/);
      if (!m) return line;
      const price = BODY_PRICES[m[2]];
      return price ? `${m[1]}${m[2]} · ${price}` : line;
    })
    .join("\n");
}

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
const start = "## מחירי פתיחה";
const nextSection = "\n## מרכזי תוכן עיקריים";
const startIdx = raw.indexOf(start);
const nextIdx = raw.indexOf(nextSection);

if (startIdx === -1 || nextIdx === -1 || nextIdx <= startIdx) {
  console.error("sync:llms — could not find price section markers in llms.txt");
  process.exit(1);
}

const expectedBlock = pricesBlock.trimEnd() + "\n";
const updated = applyBodyPrices(raw.slice(0, startIdx) + expectedBlock + raw.slice(nextIdx));

/* משווים אחרי נרמול סופי שורה: הקובץ נערך גם מווינדוס, וכישלון על CRLF בלבד
   היה מדווח על "מחיר שגוי" בזמן שאף מחיר לא השתנה. */
function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

if (process.argv.includes("--check")) {
  if (normalize(raw) === normalize(updated)) {
    console.log(
      "audit:llms-prices OK — בלוק מחירי הפתיחה ב-llms.txt תואם ל-pricing-catalog.",
    );
    process.exit(0);
  }

  const actualLines = normalize(raw).split("\n");
  const expectedLines = normalize(updated).split("\n");
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
