/**
 * audit:prose-prices - תופס מחיר קטלוג שהשתנה ופרוזה שנשארה מאחור.
 *
 * למה זה קיים: בסבב ספטמבר 2026 מחירי האטרקציות עודכנו בקטלוג
 * (1750->1695, 3200->3051, 4450->4322, 5500->5424) ו-14 מחרוזות פרוזה
 * ב-8 קבצים נשארו על הערכים הישנים. ארבע מהן נקראות על ידי מכונות:
 * הפסקה המסומנת data-speakable ב-/data/industry-2026, בלוק sr-only
 * ב-EventsBookingWizard, תשובת FAQ שנכנסת ל-JSON-LD, ושתי טבלאות בלוג.
 *
 * למה השומרים הקיימים לא תפסו: audit:pricing מחפש `price: 1695` או
 * `exVat: 1695`, כלומר מספר בצורת קוד. המחירים השגויים ישבו כטקסט עברי
 * עם פסיק אלפים, "מתחילה ב-1,750 ₪". אותה צורת כשל כמו audit:links
 * שתפס href="..." ולא href: "...".
 *
 * ולמה בדיקת "המחיר קיים בקטלוג" הייתה מאשרת את הבאג: 1750 הוא עד היום
 * מחיר תקף של שלושה פריטים אחרים (led_lighting, external_mix_master,
 * mashup_ready_pack_3). ערך לבדו לא אומר כלום. לכן הבדיקה כאן היא
 * "איזה מזהה שינה ערך", ולא "האם המספר מוכר".
 *
 * מה הוא כן מכסה: כל מזהה שערכו השתנה מול ענף הבסיס, וכל מזהה שנמחק
 * מהקטלוג. כל מופע פרוזה של הערך הישן חייב להיות מוסבר ומקושר למזהה
 * שמחזיק אותו היום, או מוסבר כמוצר אחר.
 *
 * למה גם מזהה שנמחק (שלב 2 חלק ג, 2.10.2026): הקלטת השיר עברה לבסיס
 * ותוספות, ו-cover_song, song_package, studio_viral ו-studio_all_in נמחקו.
 * PriceItemId הוא union אמיתי אחרי ה-satisfies, ולכן המחיקה נתפסה
 * בקומפילציה בכל הפניה בקוד, אבל לא בפרוזה. הגרסה הקודמת בדקה רק מזהים
 * שקיימים בשני הצדדים, ולכן מחיקה של ארבעה מזהים נראתה לה כ"אין שינוי".
 *
 * ולמה גם סכום תלת-ספרתי ליד ₪: המחיר שפרש היה 990, והתבנית הקודמת
 * דרשה פסיק אלפים, כך שהיא לא ראתה 990, 590 או 885 בכלל.
 *
 * מה הוא לא מכסה, ואומר את זה במפורש:
 *  1. מחיר פרוזה חדש שמעולם לא היה בקטלוג.
 *  2. סכום בלי ₪ או ש״ח לידו ("990 שקלים").
 *  3. הרצה בלי היסטוריית git (למשל checkout רדוד) נכשלת בקול, במקום
 *     לעבור בשקט.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CATALOG = "lib/data/pricing-catalog.ts";
const SCAN_DIRS = "lib components app public";

/* מופעי פרוזה של ערך שפרש, שהם באמת מוצר אחר. כל רשומה עם catalogId
   נבדקת מול הקטלוג החי, כך שאי אפשר "להשתיק" כאן מחיר שגוי: אם המזהה
   הזה יפסיק להחזיק את הערך, הרשומה עצמה תיכשל. */
/* מזהים שהמחיר שלהם מעולם לא נכתב כפרוזה: כל מופע שלו נגזר מהקטלוג. כשהמחיר שלהם
   משתנה, הערך הישן לא נבדק בכל הריפו (500 הוא מחיר תקף של עוד 11 פריטים, ו-49
   שורות כאלה הן מוצרים אחרים). במקום זה נבדק בדיוק מה שמסוכן: שורת פרוזה שמזכירה
   את שם הפריט ליד הערך הישן, לפני או אחרי מע״מ. מזהה שנמחק מהקטלוג כאן נכשל.
   החלטת הבעלים 7.10.2026: השיר המקורי עלה מ-500 ל-850 לפני מע״מ. */
const CATALOG_ONLY = [
  { id: "song_original_mitzvah", label: "שיר מקורי לבר או בת מצווה" },
];

const EXPLAINED = [
  /* שתי רשומות ה-1,750 של הבלוג (תאורת LED, מיקס חיצוני) נמחקו ב-3.10.2026:
     השורות כבר נגזרות מהקטלוג, ו-1,750 פרש עם mashup_ready_pack_3 וחשף אותן
     כמתות. */
  /* 1,000 פרש עם blessing_pair_combined ו-1,800 עם song_extended_pack (לא נכנסו
     במיזוג main, 3.10.2026: שיר הוא בסיס ותוספות). המופעים שנשארו אינם שיר
     או ברכה. הכרטיסייה (4,450) נגזרת עכשיו מהקטלוג, ולכן הרשומה שלה ירדה. */
  { value: 1000, file: "lib/data/blog.ts", match: "₪600-₪1,000", why: "טווח שוק לעיבוד בסיסי בטבלת השוואה" },
  { value: 1000, file: "lib/data/blog.ts", match: "זה מוסיף 500-1,000", why: "טווח תוספת לאולם גדול בפוסט הסבר" },
  { value: 1000, file: "lib/data/book-qualification-fields.ts", match: "400-1,000 ₪", why: "מדרגת תקציב שהלקוח בוחר" },
  { value: 1000, file: "lib/data/social-media.ts", match: "1,000 ₪", why: "ייעוץ סושיאל של שעה, מחירון הסושיאל הנפרד" },
  { value: 5500, file: "lib/data/blog.ts", match: "DJ לבר מצווה בישראל", why: "טווח שוק מצוטט, מסומן בפוסט עצמו כסקירה ולא כמחירון שלנו" },
  { value: 3200, file: "lib/data/academy-ulpan-page.ts", match: "3,200", why: "מסלול חודשי לאולפן עברית, מחירון אקדמיה נפרד" },
  { value: 3200, file: "lib/data/academy-hebrew-lessons-en.ts", match: "3,200", why: "אותו מסלול, גרסה אנגלית" },
  { value: 3200, file: "lib/data/shop-vouchers.ts", match: "2,500 - ₪3,200", why: "טווח שובר מתנה, לא פריט קטלוג" },
  { value: 3200, file: "lib/data/faq-aeo.ts", match: "2,500 עד 3,200", why: "אותו טווח שובר" },
  /* 990 פרש עם cover_song (שלב 2 חלק ג), אבל הוא עדיין המחיר של שיעור פרטי
     באקדמיה ושל פרק דוגמה לספר שמע. אף אחד מאלה לא מחיר שיר. */
  { value: 990, file: "app/(services)/academy/page.tsx", match: "שיעור מלא", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/data/academy-course-fit.ts", match: "שיעור מלא (60 דקות", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/data/academy-hub-courses.tsx", match: "שעה ב-990", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/data/academy-hub-courses.tsx", match: "fromPrice", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/data/academy-private-sessions.ts", match: "שיעור מלא (60 דקות", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/data/audience-landings.ts", match: "priceHint", catalogId: "academy_private_hour" },
  { value: 990, file: "lib/seo/hub-pages.ts", match: "שיעור פרטי 990", catalogId: "academy_private_hour" },
  { value: 990, file: "app/business/audiobooks/page.tsx", match: "לפרק דוגמה", catalogId: "audiobook_sample" },
  { value: 990, file: "public/llms.txt", match: "פרק דוגמה 990", catalogId: "audiobook_sample" },
  /* 5,000 פרש עם mobile_studio (האולפן הנייד אוחד ל-2,500, החלטת הבעלים
     3.10.2026 סבב שני), אבל הוא עדיין המחיר של תקליטן מהצוות ושל שיר לחברה. */
  { value: 5000, file: "public/llms.txt", match: "תקליטן מהצוות", catalogId: "dj_premium" },
  { value: 5000, file: "public/llms.txt", match: "שירים לחברות", catalogId: "corp_song_toast" },
  { value: 5000, file: "lib/data/business-hub-page.ts", match: "החל מ-5,000", catalogId: "corp_song_toast" },
  { value: 5000, file: "lib/data/social-media.ts", match: "5,000 ₪", why: "חבילת סושיאל, מחירון ניהול הסושיאל הנפרד" },
  { value: 5000, file: "lib/data/lead-flow/discovery-questions.ts", match: "5,000 ₪", why: "טווח תקציב בשאלון, לא מחיר" },
  { value: 5000, file: "lib/data/blog.ts", match: "₪1,500-₪5,000+", why: "טווח עלות פרק בהשוואת שוק" },
  { value: 5000, file: "lib/data/blog.ts", match: "טיפול אקוסטי בסיסי לחדר", why: "טווח שוק לטיפול אקוסטי" },
  /* 4,500 ו-1,200 פרשו עם mashup_custom_pack_3 ו-dj_voice_tag_pack_5, שעלו
     לתקרת ההנחה של 8% (החלטת הבעלים 3.10.2026, סבב שני). 4,500 הוא עדיין
     הקליפ המלא, תוכן ה-HR והמיתוג הקולי. 1,200 בפרוזה הוא טווח שוק. */
  { value: 4500, file: "app/business/employer-branding/page.tsx", match: "החל מ-4,500", catalogId: "employer_welcome" },
  { value: 4500, file: "public/llms.txt", match: "תוכן HR וקליטה", catalogId: "employer_welcome" },
  { value: 4500, file: "lib/data/business-hub-page.ts", match: "החל מ-4,500", catalogId: "employer_welcome" },
  { value: 4500, file: "lib/data/industry-2026.ts", match: "קליפ בר או בת מצווה מלא מתחיל במחירון האתר ב-4,500", catalogId: "full_production_clip" },
  { value: 4500, file: "lib/data/industry-2026.ts", match: "מחירון האולפן לקליפ מלא מתחיל ב-4,500", catalogId: "full_production_clip" },
  { value: 4500, file: "lib/data/blog.ts", match: "₪4,500-₪7,500", why: "טווח שוק לקליפ" },
  { value: 4500, file: "lib/data/blog.ts", match: "חבילה בסיסית (3,500-4,500 ₪)", why: "טווח שוק ל-DJ" },
  { value: 1200, file: "lib/data/blog.ts", match: "₪400-₪1,200", why: "טווח שוק למיקרופון USB" },
  { value: 1200, file: "lib/data/blog.ts", match: "בין 450 ל-1,200", why: "טווח שוק לשיר מתנה" },
  { value: 1200, file: "lib/data/blog.ts", match: "(900-1,200 ₪)", why: "טווח שוק לחבילת פרימיום" },
  { value: 1200, file: "lib/data/blog.ts", match: "800-1,200 ₪", why: "טווח שוק לפרק פודקאסט" },
  { value: 1200, file: "lib/data/blog.ts", match: "8 פרקים ב-1,200", why: "דוגמת חישוב בפוסט, לא מחיר" },
  { value: 1200, file: "lib/data/industry-2026.ts", match: "400-1,200 ₪", why: "טווח שוק לציוד ביתי" },
  { value: 1200, file: "lib/data/industry-2026.ts", match: "400 עד 1,200", why: "טווח שוק לציוד ביתי" },
  /* 150 פרש עם podcast_extra_participant (99, החלטות 5.10.2026 (פודקאסט)), אבל
     הוא עדיין כתיבה מחדש של ברכה. השאר טווחי שוק או תעריף נפרד. */
  { value: 150, file: "public/llms.txt", match: "כתיבה מחדש של הטקסט", catalogId: "blessing_text_rewrite" },
  { value: 150, file: "lib/data/blog.ts", match: "₪150-₪250", why: "טווח שוק לשעת עריכה של מתחיל" },
  { value: 150, file: "lib/data/blog.ts", match: "50-150 ₪", why: "טווח שוק למעמד מיקרופון" },
  { value: 150, file: "lib/data/online-mixing-page.ts", match: "מעל 5 דקות - 150", why: "תוספת אורך במיקס אונליין, לא משתתף בפודקאסט" },
];

/* סכום עם פסיק אלפים, או סכום תלת-ספרתי שלם (לא זנב של 1500), ליד ₪ או ש״ח */
const AMOUNT = String.raw`(?<!\d|\d[,.])(\d{1,3}(?:,\d{3})+|\d{3})(?!\d|,\d)`;
const PRICE_RE = new RegExp(String.raw`(?:₪\s*)${AMOUNT}|${AMOUNT}\s*(?:₪|ש״ח|ש"ח)`, "g");
const ID_RE = /\{\s*id:\s*"([^"]+)"[^}]*?exVat:\s*(\d+)/g;

function parseIds(text) {
  const map = {};
  let m;
  ID_RE.lastIndex = 0;
  while ((m = ID_RE.exec(text)) !== null) map[m[1]] = Number(m[2]);
  return map;
}

function baselineRef() {
  for (const ref of ["origin/main", "main"]) {
    try {
      execSync(`git rev-parse --verify --quiet ${ref}`, { stdio: "pipe" });
      return ref;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

const ref = baselineRef();
if (!ref) {
  /* נכשל ולא מדלג. שומר שמדלג בשקט ומחזיר 0 הוא בדיוק הכשל שהוא אמור
     למנוע: ב-CI אף אחד לא קורא לוג ירוק. checkout@v4 הוא depth 1 כברירת
     מחדל, ולכן ה-workflow מגדיר fetch-depth: 0 במפורש. */
  console.error("=== audit:prose-prices ===\n");
  console.error("  ✗ אין ענף בסיס (origin/main או main) בעותק הזה.");
  console.error("    הבדיקה משווה מחירי קטלוג מול ענף הבסיס, ובלעדיו אין מול מה להשוות,");
  console.error("    והיא לא עוברת בשקט כי אז היא חסרת ערך.");
  console.error("    תיקון מקומי: git fetch origin main");
  console.error("    תיקון ב-CI:  fetch-depth: 0 בשלב ה-checkout\n");
  process.exit(1);
}

const current = parseIds(readFileSync(CATALOG, "utf8"));
const base = parseIds(execSync(`git show ${ref}:${CATALOG}`, { maxBuffer: 1e8 }).toString());

/* to: null = המזהה נמחק מהקטלוג. הערך שלו פרש באותה מידה כמו ערך ששונה. */
const changed = Object.keys(base)
  .filter((id) => !(id in current) || base[id] !== current[id])
  .map((id) => ({ id, from: base[id], to: id in current ? current[id] : null }));

function describeTo(c) {
  return c.to === null ? "נמחק מהקטלוג" : `עכשיו ${c.to}`;
}

if (changed.length === 0) {
  console.log("=== audit:prose-prices ===\n");
  console.log(`  תקין. אף מחיר בקטלוג לא השתנה או נמחק מול ${ref}, ולכן אין ערך שפרש לחפש בפרוזה.\n`);
  process.exit(0);
}

const catalogOnlyIds = new Set(CATALOG_ONLY.map((e) => e.id));
const narrow = changed.filter((c) => catalogOnlyIds.has(c.id));
const missingCatalogOnly = CATALOG_ONLY.filter((e) => !(e.id in current));

const atRisk = new Map();
for (const c of changed.filter((c) => !catalogOnlyIds.has(c.id))) {
  if (!atRisk.has(c.from)) atRisk.set(c.from, []);
  atRisk.get(c.from).push(c);
}

/* סורק רק שורות שהמשתמש או המנוע רואה. הערות קוד מדברות על המחירים
   האלה בכוונה, כדי להסביר למה הם פרשו. */
function isComment(line, inBlock) {
  const t = line.trim();
  if (inBlock) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("//")) return { comment: true, inBlock: false };
  if (t.startsWith("/*")) return { comment: true, inBlock: !t.includes("*/") };
  if (t.startsWith("*")) return { comment: true, inBlock: false };
  return { comment: false, inBlock: false };
}

const files = execSync(`git ls-files ${SCAN_DIRS}`, { maxBuffer: 1e8 })
  .toString()
  .trim()
  .split("\n")
  /* קבצי בדיקה לא נסרקים: הם מצטטים את הפלט שהקוד מחשב מהקטלוג, לא פרוזה
     שגולש רואה, ובדיקה שמצטטת מחיר ישן נכשלת בעצמה. */
  .filter((f) => /\.(ts|tsx|txt)$/.test(f) && !/\.test\.tsx?$/.test(f) && f !== CATALOG);

/* ערך שפרש כמחיר לפני מע״מ יכול להיות מחיר תקף כולל מע״מ של פריט אחר (590
   הוא גם withVat(500) של הקלטת שיר). שורה שאומרת "כולל מע״מ" ושהערך בה הוא
   withVat של מחיר נוכחי כלשהו בקטלוג לא נחשבת ציטוט של המחיר הישן. */
const VAT_INCLUSIVE_LINE = /כולל מע[״"]מ|כולל מע\\"מ/;
const currentWithVat = new Set(Object.values(current).map((v) => Math.round(v * 1.18)));

const unexplained = [];
const usedEntries = new Set();

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  let inBlock = false;
  text.split(/\r?\n/).forEach((line, idx) => {
    const state = isComment(line, inBlock);
    inBlock = state.inBlock;
    if (state.comment) return;

    PRICE_RE.lastIndex = 0;
    const values = new Set();
    let m;
    while ((m = PRICE_RE.exec(line)) !== null) {
      values.add(Number((m[1] || m[2]).replace(/,/g, "")));
    }
    for (const c of narrow) {
      const label = CATALOG_ONLY.find((e) => e.id === c.id).label;
      if (!line.includes(label)) continue;
      const old = [c.from, Math.round(c.from * 1.18)];
      for (const value of values) {
        if (old.includes(value)) {
          unexplained.push({ file, line: idx + 1, value, text: line.trim().replace(/\s+/g, " "), narrowId: c.id });
        }
      }
    }
    for (const value of values) {
      if (!atRisk.has(value)) continue;
      if (VAT_INCLUSIVE_LINE.test(line) && currentWithVat.has(value)) continue;
      const entry = EXPLAINED.find(
        (e) => e.value === value && e.file === file && line.includes(e.match),
      );
      if (entry) {
        usedEntries.add(entry);
        continue;
      }
      unexplained.push({ file, line: idx + 1, value, text: line.trim().replace(/\s+/g, " ") });
    }
  });
}

/* רשומה שכבר לא מוצאת כלום היא רשומה מתה שמשתיקה בדיקה עתידית. */
const stale = EXPLAINED.filter((e) => atRisk.has(e.value) && !usedEntries.has(e));

/* רשומה שמצהירה על מזהה חייבת להסכים עם הקטלוג החי. */
const brokenBindings = EXPLAINED.filter(
  (e) => e.catalogId && usedEntries.has(e) && current[e.catalogId] !== e.value,
);

console.log("=== audit:prose-prices ===\n");
console.log(`  ענף בסיס: ${ref}`);
console.log(`  מחירי קטלוג שהשתנו או נמחקו (${changed.length}):`);
for (const c of changed) console.log(`    ${c.id}: ${c.from} -> ${c.to ?? "(נמחק)"}`);
console.log("");

let failed = false;

if (unexplained.length > 0) {
  failed = true;
  console.error(`  ✗ ${unexplained.length} מופעי פרוזה עדיין מצטטים מחיר שפרש:\n`);
  for (const u of unexplained) {
    if (u.narrowId) {
      console.error(`    ${u.file}:${u.line}`);
      console.error(`      ${u.text.slice(0, 120)}`);
      console.error(`      ${u.value} היה המחיר של ${u.narrowId} (עכשיו ${current[u.narrowId]} לפני מע״מ), והשורה מזכירה אותו בשם.\n`);
      continue;
    }
    const owners = atRisk.get(u.value).map((c) => c.id).join(", ");
    const holders = Object.keys(current).filter((id) => current[id] === u.value);
    console.error(`    ${u.file}:${u.line}`);
    console.error(`      ${u.text.slice(0, 120)}`);
    const fates = atRisk.get(u.value).map((c) => `${c.id}: ${describeTo(c)}`).join("; ");
    console.error(`      ${u.value} היה המחיר של ${owners} (${fates}).`);
    if (holders.length > 0) {
      console.error(`      שים לב: ${u.value} עדיין מחיר תקף של ${holders.join(", ")}.`);
      console.error(`      אם זו הכוונה, הוסיפו רשומה ל-EXPLAINED עם catalogId.`);
    }
    console.error("");
  }
}

if (missingCatalogOnly.length > 0) {
  failed = true;
  console.error(`  ✗ ${missingCatalogOnly.length} מזהים ב-CATALOG_ONLY לא קיימים בקטלוג. רשומה מתה:\n`);
  for (const e of missingCatalogOnly) console.error(`    ${e.id}`);
  console.error("");
}

if (stale.length > 0) {
  failed = true;
  console.error(`  ✗ ${stale.length} רשומות ב-EXPLAINED לא תואמות שום שורה. רשומה מתה משתיקה בדיקה:\n`);
  for (const s of stale) console.error(`    ${s.value} · ${s.file} · "${s.match}"`);
  console.error("");
}

if (brokenBindings.length > 0) {
  failed = true;
  console.error(`  ✗ ${brokenBindings.length} רשומות מצהירות על מזהה שכבר לא מחזיק את הערך:\n`);
  for (const b of brokenBindings) {
    console.error(`    ${b.file}: הוצהר ${b.catalogId}=${b.value}, בקטלוג ${current[b.catalogId]}`);
  }
  console.error("");
}

if (failed) {
  console.error("  תיקון: לגזור את המחיר מהקטלוג עם getExVat, במקום לכתוב מספר.");
  console.error("  התבנית שכבר בשימוש בריפו: ${getExVat(\"id\").toLocaleString(\"he-IL\")} ₪\n");
  process.exit(1);
}

console.log(`  תקין. כל מופעי הפרוזה של ${atRisk.size} הערכים שפרשו מוסברים ומקושרים לקטלוג.`);
if (narrow.length > 0) {
  console.log(`  ${narrow.length} מזהים שהמחיר שלהם מגיע רק מהקטלוג נבדקו לפי השם שלהם: ${narrow.map((c) => c.id).join(", ")}.`);
}
console.log("");
