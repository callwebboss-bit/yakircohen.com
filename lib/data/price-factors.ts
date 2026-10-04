import {
  catalogWithVat,
  getExVat,
  SONG_PARTICIPANT_RULES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";

/**
 * מה מזיז את מחיר ההקלטה.
 *
 * נמדד ב-2.10.2026: מתוך 13 שאלות ה-AEO באתר, 11 שואלות "כמה עולה" ואף
 * אחת לא עונה "למה זה עולה ככה". המודל עצמו כבר היה קיים ונכון
 * ב-studio-price-builder.ts (משך, גימור, משתתפים, דחיפות), אבל הוא
 * מרונדר בעמוד אחד בלבד ורק אחרי לחיצה, ולכן הידע לא נקרא.
 *
 * הסיבות כאן נמסרו על ידי הבעלים בשאלון, ולא נוסחו מתוך הנחה.
 * המספרים נמשכים מהקטלוג ולא נכתבים ביד, כולל מע״מ קודם ובקטן לפני
 * מע״מ (החלטת הבעלים 2.10.2026).
 *
 * במיזוג main ל-feature/sales-fix (3.10.2026) הותאם להחלטות
 * OWNER-DECISIONS-2026-10-02.md: שיר הוא בסיס ותוספות ואין "מסלול Pro"
 * של שלוש שעות; כל משתתף נוסף בשיר 99 (סבב רביעי); והתוצאה של שיר ביד בסוף הסשן,
 * ולכן גורם הדחיפות (מסירה רגילה בחמישה ימים, מהירה ב-48 שעות) ירד
 * והוחלף בתוספות. ההסבר של הבעלים על דחיפות ("מיקס צריך לנוח") שמור
 * בהיסטוריה של main, ויחזור אם יוחלט שיש שירות שבו הוא חל.
 */

/** "354 ₪ כולל מע״מ (300 ₪ + מע״מ)" */
function dualNis(id: PriceItemId): string {
  const ex = getExVat(id);
  return `${catalogWithVat(ex).toLocaleString("he-IL")} ₪ כולל מע״מ (${ex.toLocaleString("he-IL")} ₪ + מע״מ)`;
}

function vatNis(id: PriceItemId): string {
  return `${catalogWithVat(getExVat(id)).toLocaleString("he-IL")} ₪`;
}


export type PriceFactor = {
  id: string;
  /** מה הגורם */
  title: string;
  /** מה האפשרויות בפועל */
  what: string;
  /** למה זה מזיז את המחיר. במילים של הבעלים. */
  why: string;
};

export function buildStudioPriceFactors(): readonly PriceFactor[] {
  const extra = SONG_PARTICIPANT_RULES.extraId;
  return [
    {
      id: "finish",
      title: "רמת הגימור",
      what: "בשעת חדר או בברכה: חומר גלם מההקלטה, או עריכה בסיסית וניקוי. בהקלטת שיר: הקלטה, מיקס ומאסטר במחיר אחד.",
      why: "שיר מוכן כולל מיקס ומאסטר. זה מחיר התוצאה, לא שעת חדר פלוס מיקס.",
    },
    {
      id: "duration",
      title: "כמה זמן ההקלטה",
      what: "חצי שעה לברכה, שעה לשיר. את השיר מקבלים בסוף הסשן.",
      why: "זמן ארוך יותר הוא לא רק עוד חדר. הוא עוד טייקים לבחור מהם, וזה מה שמשנה את התוצאה.",
    },
    {
      id: "participants",
      title: "כמה אנשים מקליטים",
      what:
        `מקליט אחד כלול בבסיס. בשיר, כל משתתף נוסף ${vatNis(extra)} כולל מע״מ ` +
        `(${getExVat(extra).toLocaleString("he-IL")} ₪ + מע״מ), עד ${SONG_PARTICIPANT_RULES.max} בשיר.`,
      why: "כל אחד הוא ערוץ נפרד: עוד הקלטה, עוד איזון, ועוד ערבוב במיקס.",
    },
    {
      id: "addons",
      title: "אילו תוספות בוחרים",
      what:
        `תיקון זיופים וטכנאי שמכוון ומנחה ${dualNis("song_pitch_coaching")}. ` +
        `קליפ ערוך מהסשן ${dualNis("studio_session_clip_edited")}.`,
      why: "הבסיס הוא שיר מוכן. תיקון זיופים וקליפ הם בחירה שלכם, ומשלמים רק על מה שבוחרים.",
    },
  ];
}

/** תשובה ל-AEO. השאלה שאף אחת מ-13 הקיימות לא עונה עליה. */
export function buildPriceFactorsAnswer(): string {
  return (
    "ארבעה דברים מזיזים את מחיר ההקלטה: רמת הגימור, אורך ההקלטה, " +
    "כמה אנשים מקליטים, ואילו תוספות בוחרים. הגימור הוא הגורם הגדול, " +
    "כי שיר מוכן נמכר כמחיר של תוצאה ולא כשעת חדר פלוס מיקס. " +
    "תיקון זיופים וקליפ הם תוספות, ומשלמים רק על מה שבוחרים."
  );
}
