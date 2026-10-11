import type { BookCategoryId } from "@/lib/book-url";
import { DOOR_SENTENCES } from "@/lib/data/home-doors";
import type { DoorId } from "@/lib/data/intent-nav";
import type { PriceItemId } from "@/lib/data/pricing-catalog";

export type SmartFormCategoryId =
  | "song"
  | "family"
  | "pro_single"
  | "events"
  | "podcast"
  | "clips"
  | "unsupported_rehearsal";

export type SmartFormChip = {
  id: string;
  label: string;
  /** אם קיים - מחליף את בסיס הקטגוריה (חבילה קבועה / וריאציה) */
  catalogId?: PriceItemId;
  /** תוספת על הבסיס - רק PriceItemId ממחירון */
  upsellCatalogId?: PriceItemId;
  tooltip?: string;
  /** בחירה זו עוצרת את הטופס (anti-lead) */
  antiLead?: boolean;
};

export type SmartFormCategory = {
  id: SmartFormCategoryId;
  title: string;
  /** מזהה קטלוג ברירת מחדל להערכת מחיר */
  catalogId: PriceItemId | null;
  bookCategory: BookCategoryId | null;
  reassurance: string;
  chips: readonly SmartFormChip[];
  /** true = לא שירות נתמך */
  antiLead: boolean;
  antiLeadMessage?: string;
  /** משפחות: מחיר חבילה קבוע, בלי שעתי */
  fixedPackageOnly: boolean;
  /** הדלת שהכרטיס שייך אליה (D84). נכתב ל-data-door על הכרטיס */
  door: DoorId;
  /**
   * D93 (11.10.2026): ב-/book שני כרטיסים גדולים, שיר או שיר במתנה ופודקאסט,
   * וכל השאר גלויים בקטן מתחתם, בלי לחיצה נוספת.
   */
  prominence: "primary" | "secondary";
  /** שורה בכרטיס הגדול: המשפט של הבעלים לדלת (DOOR_SENTENCES) */
  cardLine?: string;
  /** בכרטיס הגדול: מחיר פתיחה ("מ-") או מחיר קבוע. המחיר עצמו מ-catalogId */
  cardPriceFrom?: boolean;
};

export const SMART_FORM_ANTI_LEAD_MESSAGE =
  "האולפן מתמחה בהפקות והקלטות בלבד, ולא מציע שירותי חדר חזרות.";

/*
 * ק7 (11.10.2026, D93): הקלטת שיר יצאה מתוך "משפחה / ברכה" לכרטיס גדול משלה,
 * עם אותם צ'יפים ואותם מזהים (cover, song_pitch), כך שהערכת המחיר, ה-URL
 * וה-closer לא משתנים. ה-closer ממפה smartCat לא מוכר לפי bookCategory=studio,
 * כלומר "recording", בדיוק כמו family. הכרטיס הקודם נשאר לברכה, בשם של הדלת.
 */
export const SMART_FORM_CATEGORIES: readonly SmartFormCategory[] = [
  {
    id: "song",
    title: "שיר או שיר במתנה",
    catalogId: "song_recording",
    bookCategory: "studio",
    reassurance:
      "מקליטים בלי לחץ. עורכים ביחד בישיבה - יוצאים עם קובץ מוכן, בלי המתנה ארוכה.",
    fixedPackageOnly: true,
    antiLead: false,
    door: "song-gift",
    prominence: "primary",
    cardLine: DOOR_SENTENCES["song-gift"],
    cardPriceFrom: false,
    chips: [
      {
        id: "cover",
        label: "הקלטת שיר",
        catalogId: "song_recording",
        tooltip: "הקלטה, מיקס ומאסטר בסשן של שעה. בלי תיקון זיופים",
      },
      {
        id: "song_pitch",
        label: "תיקון זיופים וטכנאי מנחה",
        upsellCatalogId: "song_pitch_coaching",
        tooltip: "לשיר: טכנאי שמכוון ומנחה בזמן ההקלטה, ותיקון זיופים",
      },
      {
        id: "voice_enhance",
        label: "שיפור קול",
        upsellCatalogId: "ai_voice_enhance",
        tooltip: "הבהרה ונוכחות לקול אחרי ההקלטה",
      },
      {
        id: "summary_clip",
        label: "קליפ קצר",
        upsellCatalogId: "quick_summary_clip",
        tooltip: "סרטון קצר מרגעי האולפן לשיתוף",
      },
    ],
  },
  {
    id: "podcast",
    title: "פודקאסט",
    catalogId: "podcast_audio",
    bookCategory: "podcast",
    reassurance:
      "מקליטים בלי לחץ. עורכים ביחד בישיבה - יוצאים עם קובץ מוכן, בלי המתנה ארוכה.",
    fixedPackageOnly: false,
    antiLead: false,
    door: "podcast",
    prominence: "primary",
    cardLine: DOOR_SENTENCES.podcast,
    cardPriceFrom: true,
    chips: [
      {
        id: "audio",
        label: "פודקאסט אודיו",
        catalogId: "podcast_audio",
      },
      {
        id: "video",
        label: "פודקאסט וידאו",
        catalogId: "podcast_video",
        tooltip: "הקלטה עם מצלמות באולפן",
      },
      {
        id: "pilot",
        label: "פיילוט",
        catalogId: "podcast_pilot",
      },
      {
        id: "extra_guest",
        label: "משתתף נוסף",
        upsellCatalogId: "podcast_extra_participant",
      },
      {
        id: "edit_hour",
        label: "עריכה נוספת",
        upsellCatalogId: "podcast_editing_hour",
      },
      {
        id: "srt",
        label: "כתוביות",
        upsellCatalogId: "transcribe_hour_srt",
      },
    ],
  },
  {
    id: "family",
    title: "ברכה מוקלטת",
    catalogId: "blessing_recording",
    bookCategory: "studio",
    reassurance:
      "מקליטים בלי לחץ. עורכים ביחד בישיבה - יוצאים עם קובץ מוכן, בלי המתנה ארוכה.",
    fixedPackageOnly: true,
    antiLead: false,
    door: "song-gift",
    prominence: "secondary",
    chips: [
      {
        id: "blessing",
        label: "ברכה",
        catalogId: "blessing_recording",
        tooltip: "הקלטה קצרה לאירוע משפחתי - כולל עריכה בסיסית",
      },
      {
        id: "voice_enhance",
        label: "שיפור קול",
        upsellCatalogId: "ai_voice_enhance",
        tooltip: "הבהרה ונוכחות לקול אחרי ההקלטה",
      },
      {
        id: "summary_clip",
        label: "קליפ קצר",
        upsellCatalogId: "quick_summary_clip",
        tooltip: "סרטון קצר מרגעי האולפן לשיתוף",
      },
    ],
  },
  {
    id: "events",
    title: "אטרקציות",
    catalogId: "event_attraction_1",
    bookCategory: "events",
    reassurance:
      "נהיה מתואמים 100% עם הדי ג'יי והסאונדמן שלכם - לומדים את רגעי האפקטים לפני האירוע.",
    fixedPackageOnly: false,
    antiLead: false,
    door: "event",
    prominence: "secondary",
    chips: [
      {
        id: "attr_1",
        label: "אטרקציה אחת",
        catalogId: "event_attraction_1",
      },
      {
        id: "attr_2",
        label: "2 אטרקציות",
        catalogId: "event_attraction_2",
      },
      {
        id: "attr_3",
        label: "3 אטרקציות",
        catalogId: "event_attraction_3",
      },
      {
        id: "effect",
        label: "אטרקציה בודדת",
        upsellCatalogId: "event_attraction_1",
        tooltip: "עשן, זיקוקים קרים, בועות או קצף",
      },
      {
        id: "slideshow",
        label: "מצגת קולנועית",
        upsellCatalogId: "cinematic_slideshow",
      },
      {
        id: "pre_prod",
        label: "תיאום מקדים",
        upsellCatalogId: "pre_event_production",
      },
    ],
  },
  {
    id: "pro_single",
    title: "סינגל / פרו",
    catalogId: "single_production",
    bookCategory: "studio",
    reassurance:
      "מקליטים בלי לחץ. עורכים ביחד בישיבה - יוצאים עם קובץ מוכן, בלי המתנה ארוכה.",
    fixedPackageOnly: false,
    antiLead: false,
    /* הפקת סינגל בשורת "עוד" (D85, D93) */
    door: "more",
    prominence: "secondary",
    chips: [
      {
        id: "single",
        label: "סינגל מלא",
        catalogId: "single_production",
        tooltip: "הקלטה, מיקס ומאסטרינג בסיסי לשיר אחד",
      },
      {
        id: "full_clip",
        label: "הפקה + קליפ",
        catalogId: "full_production_clip",
        tooltip: "שיר מוגמר יחד עם קליפ וידאו",
      },
      {
        id: "mastering",
        label: "מאסטרינג חיצוני",
        upsellCatalogId: "external_mix_master",
        tooltip: "מיקס ומאסטרינג מתקדמים לכל הפורמטים",
      },
      {
        id: "express_pro",
        label: "VIP Rush (עד 48 שעות)",
        upsellCatalogId: "express_delivery",
        tooltip: "מסירה מזורזת - פרמיה על לוח זמנים דחוף",
      },
      {
        id: "voiceover",
        label: "קריינות / Voiceover",
        catalogId: "studio_half_hour",
        tooltip: "חצי שעה באולפן לקריינות או תוכן קולי",
      },
    ],
  },
  {
    id: "clips",
    title: "קליפים",
    catalogId: "full_production_clip",
    bookCategory: "clips",
    reassurance: "יעד מסירה: עד 5 ימי עסקים (בפועל לרוב קודם).",
    fixedPackageOnly: false,
    antiLead: false,
    door: "more",
    prominence: "secondary",
    chips: [
      {
        id: "prod_clip",
        label: "הפקה + קליפ",
        catalogId: "full_production_clip",
      },
      {
        id: "reel",
        label: "רילס בודד",
        catalogId: "reel_factory_single",
      },
      {
        id: "summary",
        label: "קליפ סיכום",
        catalogId: "quick_summary_clip",
      },
      {
        id: "express_clip",
        label: "VIP Rush (עד 48 שעות)",
        upsellCatalogId: "express_delivery",
        tooltip: "מסירה מזורזת - פרמיה על לוח זמנים דחוף",
      },
      {
        id: "retouch",
        label: "ריטוש",
        upsellCatalogId: "photo_retouch",
      },
    ],
  },
  {
    id: "unsupported_rehearsal",
    title: "חדר חזרות",
    catalogId: null,
    bookCategory: null,
    reassurance: "",
    fixedPackageOnly: false,
    antiLead: true,
    antiLeadMessage: SMART_FORM_ANTI_LEAD_MESSAGE,
    door: "more",
    prominence: "secondary",
    chips: [],
  },
] as const;

export function getSmartFormCategory(
  id: SmartFormCategoryId,
): SmartFormCategory | undefined {
  return SMART_FORM_CATEGORIES.find((c) => c.id === id);
}

/** כרטיסים שמוצגים ב-Step 1 (כולל trap) */
export const SMART_FORM_STEP1_CATEGORIES = SMART_FORM_CATEGORIES;

/** D93: שני הכרטיסים הגדולים, ואחריהם כל השאר בקטן */
export const SMART_FORM_STEP1_PRIMARY = SMART_FORM_STEP1_CATEGORIES.filter(
  (c) => c.prominence === "primary",
);
export const SMART_FORM_STEP1_SECONDARY = SMART_FORM_STEP1_CATEGORIES.filter(
  (c) => c.prominence === "secondary",
);
