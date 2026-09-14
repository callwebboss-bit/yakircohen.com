import { SITE_URL } from "@/lib/site-url";

/**
 * מקור אמת אחד למזהי הישויות בגרף הסכמה.
 *
 * למה זה קיים: הצמתים הוכרזו ב-build-site-schema.ts עם `${SITE_URL}/#organization`,
 * כלומר עם לוכסן לפני הסולמית, בזמן שההפניות אליהם נבנו במקומות אחרים עם
 * `${absoluteUrl()}#organization`, בלי לוכסן, כי absoluteUrl() מחזיר את הדומיין
 * בלי לוכסן סוגר. שתי המחרוזות האלה הן שני IRI שונים לחלוטין.
 *
 * התוצאה שנמדדה: ה-provider של כל צומת Service באתר הצביע על
 * https://yakircohen.com#organization בזמן שהצומת מוצהר כ-
 * https://yakircohen.com/#organization, ולכן ההפניה לא התחברה לשום דבר.
 * מנוע שבונה גרף ישויות ראה Service יתום בלי ספק, בכ-43 עמודי שירות.
 *
 * לוכסן אחד. לכן המזהים מוצהרים כאן פעם אחת, וכל מי שמפנה אליהם מייבא מכאן
 * ולא מרכיב מחרוזת בעצמו. `scripts/audit-schema-entity-refs.mjs` אוכף את זה.
 */
export const ENTITY_IDS = {
  website: `${SITE_URL}/#website`,
  organization: `${SITE_URL}/#organization`,
  founder: `${SITE_URL}/#founder`,
  localBusiness: `${SITE_URL}/#localbusiness`,
} as const;

export type EntityIdKey = keyof typeof ENTITY_IDS;

/** הפניה לצומת קיים בגרף, בצורה ש-schema.org מצפה לה. */
export function entityRef(key: EntityIdKey): { "@id": string } {
  return { "@id": ENTITY_IDS[key] };
}
