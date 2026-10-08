/**
 * עזרים טהורים לשגיאות שדה נגישות ולסימון שדות חובה (F-11, F-45, 7.10.2026).
 * נפרדים מהרכיב כדי שאפשר לבדוק אותם ב-node:test בלי DOM.
 */

/** מזהה האלמנט של הודעת השגיאה של שדה. אותו מזהה נכנס ל-aria-describedby. */
export function fieldErrorId(fieldId: string): string {
  return `${fieldId}-error`;
}

type DescribedByPart = string | false | null | undefined;

/**
 * מרכיב ערך aria-describedby ממזהים. חלקים ריקים או false נשמטים, ואם לא נשאר
 * דבר מוחזר undefined, כדי שלא יישאר מאפיין ריק ב-DOM. הרמז הקבוע בא לפני
 * השגיאה, והשגיאה לא מחליפה אותו: describedBy(hintId, error && errorId).
 */
export function describedBy(...parts: DescribedByPart[]): string | undefined {
  const ids = parts.filter(
    (part): part is string => typeof part === "string" && part.trim().length > 0,
  );
  return ids.length > 0 ? ids.map((id) => id.trim()).join(" ") : undefined;
}

const LEGACY_REQUIRED_SUFFIX = /\s*\*\s*$/;

/**
 * הקוראים הישנים מוסיפים " *" לטקסט התווית (`${nameLabel} *`), והכוכבית נכנסת
 * לשם הנגיש של השדה. מפרק תווית כזו לטקסט נקי ולדגל חובה, כדי שהרכיב ירנדר
 * את הכוכבית עם aria-hidden ויציב aria-required.
 */
export function splitRequiredLabel(label: string): { text: string; required: boolean } {
  if (!LEGACY_REQUIRED_SUFFIX.test(label)) return { text: label, required: false };
  return { text: label.replace(LEGACY_REQUIRED_SUFFIX, ""), required: true };
}
