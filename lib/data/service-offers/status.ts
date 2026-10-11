/**
 * מצב הפרסום של עמודי השירותים החדשים (11.10.2026), במקום אחד ובלי תלויות,
 * כדי שגם קבצים שנטענים בצד הלקוח (למשל matanot-page.ts) יוכלו לקרוא אותו
 * בלי למשוך את הקטלוג.
 *
 * כל עמוד שלא ברשימה PUBLISHED הוא טיוטה: noindex, לא במפת האתר, ואף עמוד קיים
 * לא מקשר אליו. פרסום עמוד = הוספת הנתיב לכאן, הוספה ל-app/sitemap.ts, ו"תפרסם"
 * מהבעלים. אז כל הקישורים אליו מעמודים קיימים נדלקים בבת אחת.
 */
export const SERVICE_OFFER_LABELS = {
  "/studio/parody": "פרודיה לאירוע",
  "/studio/original-song": "שיר מקורי לכל אירוע",
  "/studio/group-session": "מסיבת רווקות או יום הולדת באולפן",
  "/studio/ai-song-gift": "שיר AI במתנה",
  "/studio/renew-old-song": "חידוש שיר ישן",
  "/studio/professional-singer": "שיר בביצוע זמר מהצוות",
  "/studio/class-song": "שיר סיום לגן או לכיתה",
  "/studio/blessings/enlistment": "שיר או ברכה לגיוס",
  "/podcast/live-podcast": "פודקאסט חי מהבמה",
  "/podcast/launch-package": "חבילת השקה לפודקאסט",
  "/podcast/host-coaching": "אימון הנחיה לפודקאסט",
} as const;

export type ServiceOfferPath = keyof typeof SERVICE_OFFER_LABELS;

/* "תפרסם את כולם", הבעלים 11.10.2026 */
const PUBLISHED: ReadonlySet<ServiceOfferPath> = new Set<ServiceOfferPath>([
  "/studio/parody",
  "/studio/original-song",
  "/studio/group-session",
  "/studio/ai-song-gift",
  "/studio/professional-singer",
  "/studio/class-song",
  "/studio/blessings/enlistment",
  "/podcast/live-podcast",
  "/podcast/launch-package",
  "/podcast/host-coaching",
  /* "תוסיף לתיק עבודות ולשירות חדש ותדחוף", הבעלים 11.10.2026 */
  "/studio/renew-old-song",
]);

export function isServiceOfferPublished(path: ServiceOfferPath): boolean {
  return PUBLISHED.has(path);
}

/** הקישורים שמותר להציג מעמוד קיים: רק לעמודים שפורסמו, בסדר שהתבקש */
export function publishedServiceLinks(paths: readonly ServiceOfferPath[]): { href: string; label: string }[] {
  return paths.filter(isServiceOfferPublished).map((href) => ({ href, label: SERVICE_OFFER_LABELS[href] }));
}

/** בתוך עמוד חדש: קישור לעמוד חדש אחר נשאר רק אם הוא פורסם, או שגם העמוד הנוכחי עדיין טיוטה */
export function isLinkableFrom(fromDraft: boolean, href: string): boolean {
  if (fromDraft || !(href in SERVICE_OFFER_LABELS)) return true;
  return isServiceOfferPublished(href as ServiceOfferPath);
}
