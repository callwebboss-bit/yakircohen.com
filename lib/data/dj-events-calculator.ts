/**
 * נתוני מחשבון ה-DJ (/events/dj-events, /book#dj). כל אפשרות נקשרת למזהה
 * קטלוג, והמחיר נגזר ממנו. תוכנית שלב 4, WP2 (PJ-05, PI-24, PJ-06, LF-14).
 *
 * למה הקובץ קיים: עד 3.10.2026 המחירים ישבו בקומפוננטה כמספרים. "DJ יקיר
 * כהן אישית" ישב כמספר. מ-3.10.2026 (סבב שני) הבעלים קבע ש-9,800 הוא לפני
 * מע״מ (11,564 כולל), והמחיר נקרא מהקטלוג. "הקלטת שיר באולפן" תויגה "מחיר
 * מיוחד ללקוחות אירועים" ועלתה 1,500, יותר מהמחיר הרגיל. ו"רגע של כוכב"
 * (5,000 ו-8,000) לא קיים בקטלוג בכלל, ולכן הוא מוסתר עד שהבעלים יתמחר אותו.
 * npm test סורק רק lib/, ולכן הנתונים כאן ולא בקומפוננטה.
 */
import {
  DJ_TEAM_NOTE,
  getExVat,
  MOBILE_STUDIO_ARRIVAL_COPY,
  MOBILE_STUDIO_EVENT_SERVICES,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";

export { DJ_TEAM_NOTE };

export type DjCalcOption = {
  id: string;
  catalogId: PriceItemId;
  name: string;
  sub: string;
  badge: string | null;
  features?: readonly string[];
  icon?: string;
  /** פריטי קטלוג שמתווספים למחיר (אולפן נייד באירוע: ההגעה) */
  extraCatalogIds?: readonly PriceItemId[];
};

export type DjCalcPricedOption = DjCalcOption & { priceExVat: number };

function priced<T extends DjCalcOption>(option: T): T & { priceExVat: number } {
  const extras = (option.extraCatalogIds ?? []).reduce((sum, id) => sum + getExVat(id), 0);
  return { ...option, priceExVat: getExVat(option.catalogId) + extras };
}

export const DJ_CALC_FESTIVAL = priced({
  id: "festival",
  catalogId: "festival_all_in",
  name: 'חבילת "פסטיבל", הכל כלול',
  sub: "DJ, אולפן נייד, 3 אטרקציות, פסקול כניסה ומצגת. אירוע שלם",
  badge: null,
  features: [
    "DJ פרימיום מהצוות (5 שעות)",
    "אולפן הקלטות נייד באירוע",
    "3 אטרקציות אפקטים לבחירה",
    "פסקול כניסה + קריינות דרמטית",
    "מצגת תמונות קולנועית",
    "סרטון מעוצב מכל אטרקציה",
    "טכנאי צמוד + ציוד מלא",
  ],
} as const);

/* שעות: תקליטן מהצוות 4 שעות ועד 300 מוזמנים (החלטת הבעלים ED-04), יקיר
   אישית 5 שעות. אותו נוסח כמו services.ts ועמוד החתונות. */
export const DJ_CALC_DJ_OPTIONS = [
  priced({
    id: "dj_team",
    catalogId: "dj_premium",
    name: "DJ פרימיום מהצוות",
    sub: DJ_TEAM_NOTE,
    badge: null,
    features: ["מערכת הגברה מקצועית", "תאורה בסיסית", "4 שעות ניהול רחבה", "סרטון מהרחבה"],
  } as const),
  priced({
    id: "dj_yakir",
    catalogId: "dj_yakir_personal",
    name: "DJ יקיר כהן אישית",
    sub: "יקיר כהן על הקונסולה, 5 שעות",
    badge: "VIP",
    features: ["ציוד הגברה פרימיום", "תאורה מקצועית", "5 שעות ניהול רחבה", "סרטון מהרחבה"],
  } as const),
] as const;

export const DJ_CALC_ADDONS = [
  /* אולפן נייד באירוע (החלטת הבעלים 3.10.2026, סבב שני): צילום פודקאסט
     במחיר פודקאסט וידאו, הקלטת אודיו במחיר פודקאסט אודיו, ועל כל אחד
     ההגעה (2,500). עד אז mobile_studio ב-5,000, שנמחק. */
  priced({
    id: "studio_mobile_video",
    catalogId: MOBILE_STUDIO_EVENT_SERVICES.videoId,
    extraCatalogIds: [MOBILE_STUDIO_EVENT_SERVICES.arrivalId],
    name: "צילום פודקאסט באירוע",
    sub: `אולפן נייד: ${MOBILE_STUDIO_ARRIVAL_COPY}. צילום במחיר פודקאסט וידאו, ועליו ההגעה`,
    badge: null,
    icon: "🎥",
  } as const),
  priced({
    id: "studio_mobile_audio",
    catalogId: MOBILE_STUDIO_EVENT_SERVICES.audioId,
    extraCatalogIds: [MOBILE_STUDIO_EVENT_SERVICES.arrivalId],
    name: "הקלטת אודיו באירוע",
    sub: `אולפן נייד: ${MOBILE_STUDIO_ARRIVAL_COPY}. הקלטה במחיר פודקאסט אודיו, ועליה ההגעה`,
    badge: null,
    icon: "🎤",
  } as const),
  priced({
    id: "entry",
    catalogId: "pre_event_production",
    name: "פסקול כניסה + קריינות דרמטית",
    sub: "הפקה מראש ותיאום עם ה-DJ",
    badge: null,
    icon: "🎬",
  } as const),
  priced({
    id: "slideshow",
    catalogId: "cinematic_slideshow",
    name: "מצגת תמונות קולנועית",
    sub: "סיפור ויזואלי שרץ על המסך כל הערב",
    badge: null,
    icon: "🖼️",
  } as const),
  priced({
    id: "led",
    catalogId: "led_lighting",
    name: "עמדת LED לאירועים",
    sub: "תאורה דקורטיבית או הקרנת לוגו",
    badge: null,
    icon: "💡",
  } as const),
  priced({
    id: "drummer",
    catalogId: "electronic_drummer",
    name: "מתופף אלקטרוני מקצועי",
    sub: "ליווי מוזיקלי חי לרחבה, ללא הגברה",
    badge: null,
    icon: "🥁",
  } as const),
  /* היה studio_hour (1,500) עם "מחיר מיוחד ללקוחות אירועים", יותר מהמחיר
     הרגיל של שיר. עכשיו הקלטת השיר הרגילה, בלי טענת הנחה. */
  priced({
    id: "record_song",
    catalogId: "song_recording",
    name: "הקלטת שיר באולפן",
    sub: "הקלטה, מיקס ומאסטר בסשן של שעה. תיקון זיופים בתוספת",
    badge: null,
    icon: "🎵",
  } as const),
] as const;

export const DJ_CALC_ATTRACTION_ID: PriceItemId = "event_attraction_1";

export const DJ_CALC_EFFECTS = [
  { id: "smoke", name: "עשן כבד", sub: "מכונות בלעדיות, עד 4 דקות", icon: "💨" },
  { id: "bubbles_smoke", name: "בועות סבון עשן", sub: "מצטלם מדהים", icon: "🫧", badge: "היט" },
  { id: "balloons", name: "בלונים ענקיים", sub: "6 בלוני ענק לרחבה, ברגע שיא", icon: "🎈" },
  { id: "sparklers", name: "זיקוקים קרים", sub: "רגע של אש קרה, ניצוצות לבנים", icon: "❄️" },
  { id: "confetti", name: "תותח קונפטי", sub: "פיצוץ צבעוני ברגע השיא", icon: "🎊" },
  { id: "color_smoke", name: "עשן צבעוני", sub: "תותחי צבע ברחבה", icon: "🌈" },
  { id: "foam", name: "תותח קצף", sub: "מושלם לפעילות ילדים וסוף לילה", icon: "🧴" },
] as const;

/**
 * "רגע של כוכב" (5,000 / 8,000) מוסתר: אין לו מזהה בקטלוג ואין לו עמוד.
 * להחזיר רק אחרי שהבעלים יתמחר אותו ויתווסף לקטלוג (שאלת בעלים DJ-6).
 */
export const DJ_CALC_SHOW_STAR_MOMENT = false;

export type DjCalcEffectId = (typeof DJ_CALC_EFFECTS)[number]["id"];
export type DjCalcDjId = (typeof DJ_CALC_DJ_OPTIONS)[number]["id"];
export type DjCalcAddonId = (typeof DJ_CALC_ADDONS)[number]["id"];

/** כל מזהי הקטלוג שהמחשבון נשען עליהם (לבדיקה) */
export function getDjCalculatorCatalogIds(): PriceItemId[] {
  return [
    DJ_CALC_FESTIVAL.catalogId,
    ...DJ_CALC_DJ_OPTIONS.map((o) => o.catalogId),
    ...DJ_CALC_ADDONS.flatMap((o) => [
      o.catalogId,
      ...(("extraCatalogIds" in o ? o.extraCatalogIds : undefined) ?? []),
    ]),
    DJ_CALC_ATTRACTION_ID,
  ];
}
