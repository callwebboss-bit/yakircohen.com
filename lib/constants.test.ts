import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUSINESS_FOUNDING_YEAR,
  FOUNDER_CAREER_START_YEAR,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  SITE_TRUST_STATS,
  TRUST_CLAIM_SOURCES,
  TRUST_STATS_CLARIFICATION,
} from "./constants";

/*
 * "20+ שנות ניסיון" הוא מספר קשיח, והוא מתיישן בלי שאף אחד ירגיש.
 *
 * הרקע: העמוד הצהיר 20+ שנות ניסיון והסכמה הצהירה foundingDate 2010,
 * כלומר 16 שנה. שתי טענות שנראות סותרות באותו אתר הן בדיוק מה שמחליש
 * אמון אצל גולש ואצל מנוע. ההבחנה נכונה, הוותק האישי מתחיל ב-2004,
 * אבל היא הייתה קיימת רק כהערה בקוד.
 *
 * למה מספר קשיח ולא חישוב מהשנה הנוכחית: חישוב בזמן בנייה מכניס
 * אי-דטרמיניזם לפלט, מקפיא את המספר עד הפריסה הבאה, ומפיל את שער
 * אי-הפגיעה בכל ינואר. עדיף מספר יציב עם בדיקה שמזהירה כשהוא מתרחק.
 */

function claimedYears(): number {
  const stat = SITE_TRUST_STATS.find((s) => s.label === "שנות ניסיון");
  assert.ok(stat, "לא נמצאה שורת שנות ניסיון ב-SITE_TRUST_STATS");
  const parsed = Number.parseInt(stat.value.replace(/\D/g, ""), 10);
  assert.ok(Number.isFinite(parsed), `לא הצלחתי לקרוא מספר מ-"${stat.value}"`);
  return parsed;
}

test("הוותק האישי מוקדם מהקמת העסק, אחרת ההבחנה חסרת מובן", () => {
  assert.ok(
    FOUNDER_CAREER_START_YEAR < BUSINESS_FOUNDING_YEAR,
    `ותק אישי משנת ${FOUNDER_CAREER_START_YEAR} מול עסק משנת ${BUSINESS_FOUNDING_YEAR}. ` +
      "אם העסק קדם לוותק האישי, ההפרדה בין שני המספרים לא מסבירה כלום",
  );
});

test("המספר המוצג לא מגזים ולא מתיישן", () => {
  const actual = new Date().getFullYear() - FOUNDER_CAREER_START_YEAR;
  const claimed = claimedYears();

  assert.ok(
    claimed <= actual,
    `האתר מצהיר ${claimed}+ שנות ניסיון, אבל מ-${FOUNDER_CAREER_START_YEAR} עברו ${actual}. ` +
      "הצהרה גבוהה מהמציאות היא הגזמה, ובדיוק מה שמנוע בודק",
  );

  /* הפרש של עשור אומר שהמספר נשאר מאחור ולא עודכן */
  assert.ok(
    actual - claimed < 10,
    `האתר מצהיר ${claimed}+ שנות ניסיון בזמן שעברו ${actual} מ-${FOUNDER_CAREER_START_YEAR}. ` +
      "המספר התיישן. לעדכן את SITE_TRUST_STATS ואת TRUST_STATS_CLARIFICATION",
  );
});

test("שורת ההבהרה מזכירה את שני המספרים", () => {
  assert.match(
    TRUST_STATS_CLARIFICATION,
    new RegExp(String(BUSINESS_FOUNDING_YEAR)),
    "שורת ההבהרה חייבת לנקוב בשנת הקמת העסק, אחרת היא לא מיישבת את הסתירה",
  );
  assert.match(
    TRUST_STATS_CLARIFICATION,
    new RegExp(String(claimedYears())),
    "שורת ההבהרה חייבת לנקוב באותו מספר שנות ניסיון שמוצג בפס האמון",
  );
});


/*
 * שלושת מספרי האמון נכנסים ל-JSON-LD, כלומר גוגל מצטט אותם כעובדה.
 * עד 4.10.2026 רק "20+" היה מוגן, ואפשר היה לשנות את הדירוג בלי שאיש
 * ישים לב. הבדיקות כאן דורשות שלכל מספר מוצג יהיה מקור מתועד, ושמקור
 * לא יישאר תלוי באוויר אחרי שהמספר שלו השתנה.
 */

function displayedClaims(): string[] {
  return [
    ...SITE_TRUST_STATS.map((s) => s.value),
    GOOGLE_REVIEW_COUNT,
  ];
}

test("לכל מספר אמון מוצג יש מקור מתועד", () => {
  const documented = new Set(TRUST_CLAIM_SOURCES.map((c) => c.value));
  for (const claim of displayedClaims()) {
    assert.ok(
      documented.has(claim),
      `"${claim}" מוצג באתר ונכנס ל-JSON-LD, ואין לו רשומה ב-TRUST_CLAIM_SOURCES. ` +
        "מספר אמון בלי מקור הוא מספר שאי אפשר להגן עליו",
    );
  }
});

test("אין מקור שלא מתאים לשום מספר מוצג", () => {
  const displayed = new Set(displayedClaims());
  for (const claim of TRUST_CLAIM_SOURCES) {
    assert.ok(
      displayed.has(claim.value),
      `ב-TRUST_CLAIM_SOURCES יש רשומה ל-"${claim.value}", אבל שום מספר מוצג לא תואם לה. ` +
        "כנראה המספר שונה והמקור נשאר מאחור. לעדכן או למחוק",
    );
  }
});

test("הדירוג ומספר הביקורות מגיעים מאותו מקור שמתועד", () => {
  const rating = TRUST_CLAIM_SOURCES.find((c) => c.value === `${GOOGLE_RATING} ★`);
  assert.ok(rating, `אין מקור מתועד לדירוג ${GOOGLE_RATING}`);
  assert.match(
    rating.source,
    /Google/,
    "מקור הדירוג חייב לנקוב בכרטיס Google, כי שם הגולש יכול לאמת אותו",
  );

  const reviews = TRUST_CLAIM_SOURCES.find((c) => c.value === GOOGLE_REVIEW_COUNT);
  assert.ok(reviews, `אין מקור מתועד ל-${GOOGLE_REVIEW_COUNT} ביקורות`);
});
