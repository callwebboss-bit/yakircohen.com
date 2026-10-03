/**
 * audit:trust-claims - שומר על טענות אמון: בלי דחיפות מדומה, בלי מספרים
 * שלא מגיעים ממקור אחד, ובלי מחיר מחוק שלא קשור לקטלוג.
 *
 * למה זה קיים (שלב 5, ממצאים FIT-04..FIT-07, FIT-12, OE-29, LF-15, OAC-07):
 * סקירת המכירות של 2.10.2026 מצאה באשפים "ההרשמה לחודש הקרוב מלאה - רשימת
 * המתנה" קבוע, טיימר "המחיר שמור עבורך" שמתאפס לבד, "בודק זמינות..." שלא
 * בודק כלום, "0 גולשים כרגע", "מקליטים עכשיו" לפי השעון, ובעמוד הקשר "500+
 * פרויקטים" ו-"5.0" בזמן שדף הבית אמר "5,000+ לקוחות" ו-4.9. כל אלה הוסרו.
 * השומר הזה מונע מהם לחזור, כי הם נכתבים בקלות בכל רכיב חדש.
 *
 * מה נסרק: git ls-files components lib app public/llms.txt, קבצי ts/tsx/txt/json.
 * לא נסרקים: קבצי בדיקה, *.generated.*, ושורות הערה.
 *
 * שלושה סוגי בדיקה:
 *  1. ניסוחים אסורים (BANNED). אין להם חריג: הם תמיד דחיפות מדומה.
 *  2. מספרי אמון ("5,000+ לקוחות", "500+ פרויקטים", "4.9 כוכבים", "דירוג 5.0")
 *     מותרים רק ב-lib/constants.ts. כל מקום אחר קורא SITE_TRUST_STATS,
 *     GOOGLE_RATING או GOOGLE_REVIEW_COUNT. מופע שאינו טענה של העסק (למשל
 *     סטטיסטיקת שוק בבלוג) נכנס ל-ALLOWED עם סיבה.
 *  3. מחיר מחוק (line-through) מותר רק בקובץ שרשום ב-LINE_THROUGH_BOUND, עם
 *     קובץ המקור של המחיר והביטוי שקושר אותו לקטלוג. אם הביטוי נעלם מקובץ
 *     המקור, הרשומה נכשלת. בנוסף, שדות מחיר ייחוס (originalPrice, listPrice)
 *     אסור שיקבלו מספר כתוב, ו"במקום N ₪" בפרוזה אסור.
 *
 * מה הוא לא מכסה, במפורש: טענה שנבנית מחלקים בזמן ריצה (template עם משתנה
 * שאינו מ-constants), ומספר בלי מילת ההקשר ("5,000+" לבד).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const SCAN = "components lib app public/llms.txt";
const TRUST_SOURCE = "lib/constants.ts";

const BANNED = [
  { re: /רשימת המתנה/, why: "רשימת המתנה קבועה היא מחסור מדומה (FIT-05)" },
  { re: /שמור(?:ים|ה)? עבורך/, why: "שום מחיר או מקום לא נשמר עבור הגולש (FIT-05, OE-29)" },
  { re: /בודק(?:ת)? זמינות/, why: "הודעת טעינה שטוענת לבדיקה שלא קורית (OE-29)" },
  { re: /גולשים כרגע/, why: "מונה גולשים מדומה (FIT-12)" },
  { re: /מקליטים עכשיו/, why: "השעון לא יודע אם מקליטים (FIT-12)" },
  { re: /זמין עכשיו/, why: "זמינות שלא נגזרת מיומן אמיתי (FIT-12)" },
  { re: /חיסכון עד \d+%/, why: "אחוז חיסכון בלי מחיר שתומך בו (OE-08)" },
  { re: /השארנו את המקום/, why: "שום מקום לא נשמר, רק טיוטה בדפדפן (FIT-05)" },
  { re: /שמרנו את המחיר/, why: "מחירי הקטלוג לא פגים ולא נשמרים (FIT-05)" },
];

const TRUST_NUMBER = [
  /\d[\d,]+\+\s*(?:לקוחות|פרויקטים|ביקורות|אירועים|חתונות|הקלטות|תלמידים)/,
  /(?<![\d.])[45]\.\d(?![\d])\s*(?:★|כוכבים)/,
  /★\s*[45]\.\d(?![\d])/,
  /דירוג[^"\n`]{0,14}(?<![\d.])[45]\.\d(?![\d])/,
  /* צורת אובייקט, כמו שעמוד הקשר כתב: { num: "500+", label: "פרויקטים" } */
  /\b(?:num|value|stat|count)\s*:\s*["'`]\d[\d,]+\+["'`]/,
  /\b(?:num|value|stat|rating)\s*:\s*["'`](?:★\s*)?[45]\.\d(?![\d])/,
];

/* מופעים מותרים של מספר אמון או של "במקום N ₪". { file, match, why } */
const ALLOWED = [
  {
    file: "lib/data/academy-ulpan-page.ts",
    match: "שיעור ניסיון ב-500",
    why: "שיעור ניסיון מול מחיר המסלול החודשי של האולפן. שני מחירים אמיתיים של אותו מוצר (EXPLAINED ב-audit:prose-prices). שאלה לבעלים אם להשאיר את הניסוח",
  },
];

/* מחיר מחוק מותר רק כאן. source הוא הקובץ שמחזיק את מחיר הייחוס, ו-bound
   הוא הביטוי שקושר אותו לקטלוג. אם bound כבר לא מופיע ב-source, נכשל. */
const LINE_THROUGH_BOUND = [
  {
    file: "components/booking/BookUpsellSection.tsx",
    source: "lib/data/events-booking-upsells.ts",
    bound: 'originalPrice: getExVat("event_attraction_1")',
    why: "תותח שני: מחיר הייחוס הוא event_attraction_1 (שלב 4 WP4)",
  },
  {
    file: "components/booking/WizardCouponPriceLine.tsx",
    source: "components/booking/WizardCouponPriceLine.tsx",
    bound: "applyCouponDiscountExVat(offer, totalExVat)",
    why: "המחוק הוא הסכום שהאשף חישב, והמחיר אחריו הוא אותו סכום אחרי קופון",
  },
  {
    file: "components/marketing/EventIndexAttractionsBundle.tsx",
    source: "lib/data/event-index-attractions-pro.ts",
    bound: 'PRO_SINGLE_EX_VAT = getExVat("event_attraction_1")',
    why: "שלוש בנפרד = 3 x event_attraction_1",
  },
  {
    file: "components/seo/DjMashupBundlePicker.tsx",
    source: "lib/data/mashup-bundle-pricing.ts",
    bound: "getExVat(offer.singlePricingId) * offer.count",
    why: "מחיר בנפרד = מחיר הקטלוג של מאשאפ בודד כפול הכמות",
  },
];

const REFERENCE_FIELD_LITERAL = /\b(?:originalPrice|listPrice|referencePrice|wasPrice)\s*:\s*\d/;
const REFERENCE_PROSE = /במקום\s*₪?\s*\d[\d,]*\s*(?:₪|ש״ח|ש"ח|שקל)/;

function isComment(line, inBlock) {
  const t = line.trim();
  if (inBlock) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("//")) return { comment: true, inBlock: false };
  if (t.startsWith("/*")) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("*")) return { comment: true, inBlock: false };
  if (t.startsWith("{/*")) return { comment: true, inBlock: !t.includes("*/") };
  return { comment: false, inBlock: false };
}

const files = execSync(`git ls-files ${SCAN}`, { maxBuffer: 1e8 })
  .toString()
  .trim()
  .split("\n")
  .filter(
    (f) =>
      /\.(ts|tsx|txt|json)$/.test(f) &&
      !/\.test\.tsx?$/.test(f) &&
      !/\.generated\./.test(f) &&
      existsSync(f),
  );

const failures = [];
const allowedUsed = new Set();
const lineThroughFiles = new Set();

for (const file of files) {
  const text = readFileSync(file, "utf8");
  let inBlock = false;
  text.split(/\r?\n/).forEach((line, idx) => {
    const state = isComment(line, inBlock);
    inBlock = state.inBlock;
    if (state.comment) return;
    const where = `${file}:${idx + 1}`;
    const snippet = line.trim().slice(0, 140);

    for (const b of BANNED) {
      if (b.re.test(line)) failures.push({ where, kind: "ניסוח אסור", why: b.why, snippet });
    }

    if (file !== TRUST_SOURCE && TRUST_NUMBER.some((re) => re.test(line))) {
      const entry = ALLOWED.find((a) => a.file === file && line.includes(a.match));
      if (entry) allowedUsed.add(entry);
      else
        failures.push({
          where,
          kind: "מספר אמון מחוץ ל-lib/constants.ts",
          why: "לקרוא SITE_TRUST_STATS / GOOGLE_RATING / GOOGLE_REVIEW_COUNT (FIT-06)",
          snippet,
        });
    }

    if (/\bline-through\b/.test(line)) lineThroughFiles.add(file);

    if (REFERENCE_FIELD_LITERAL.test(line)) {
      failures.push({
        where,
        kind: "מחיר ייחוס כתוב",
        why: "מחיר ייחוס חייב לבוא מ-getExVat של פריט קטלוג (FIT-05)",
        snippet,
      });
    }
    if (REFERENCE_PROSE.test(line)) {
      const entry = ALLOWED.find((a) => a.file === file && line.includes(a.match));
      if (entry) {
        allowedUsed.add(entry);
        return;
      }
      failures.push({
        where,
        kind: "\"במקום N ₪\" בפרוזה",
        why: "מחיר ייחוס מוצג רק מהקטלוג, לא כטקסט (FIT-05)",
        snippet,
      });
    }
  });
}

for (const file of lineThroughFiles) {
  const entry = LINE_THROUGH_BOUND.find((e) => e.file === file);
  if (!entry) {
    failures.push({
      where: file,
      kind: "מחיר מחוק לא רשום",
      why: "line-through חדש: לרשום ב-LINE_THROUGH_BOUND עם הקישור לקטלוג",
      snippet: "",
    });
  }
}
for (const entry of LINE_THROUGH_BOUND) {
  if (!lineThroughFiles.has(entry.file)) {
    failures.push({
      where: entry.file,
      kind: "רשומת LINE_THROUGH_BOUND מתה",
      why: "אין כבר line-through בקובץ. להסיר את הרשומה",
      snippet: "",
    });
    continue;
  }
  const src = existsSync(entry.source) ? readFileSync(entry.source, "utf8") : "";
  if (!src.includes(entry.bound)) {
    failures.push({
      where: entry.source,
      kind: "מחיר מחוק כבר לא קשור לקטלוג",
      why: `לא נמצא "${entry.bound}" (${entry.why})`,
      snippet: "",
    });
  }
}
for (const a of ALLOWED) {
  if (!allowedUsed.has(a)) {
    failures.push({ where: a.file, kind: "רשומת ALLOWED מתה", why: a.match, snippet: "" });
  }
}

console.log("=== audit:trust-claims ===\n");
console.log(`  נסרקו ${files.length} קבצים. מחיר מחוק ב-${lineThroughFiles.size} קבצים, כולם קשורים לקטלוג.`);
if (failures.length > 0) {
  console.error(`\n  ✗ ${failures.length} טענות אמון לא תקינות:\n`);
  for (const f of failures) {
    console.error(`    ${f.where}  [${f.kind}]`);
    console.error(`      ${f.why}`);
    if (f.snippet) console.error(`      ${f.snippet}`);
  }
  console.error("");
  process.exit(1);
}
console.log("  תקין. אין דחיפות מדומה, מספרי אמון ממקור אחד, ומחיר מחוק רק מהקטלוג.\n");
