export type PodcastPackageId = "starter" | "audio" | "video" | "social";

import { STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";

/** מחיר פתיחה  -  פרק חצי שעה (מוצג גם במרכז הפודקאסט) */
export const PODCAST_STARTER_PRICE = STUDIO_HALF_HOUR_NIS;

export type PodcastPackage = {
  id: PodcastPackageId;
  name: string;
  subtitle: string;
  price: number;
  badge?: string;
  ideal: string;
  features: string[];
  summary: string;
};

export const PODCAST_OVERTIME_RATE = STUDIO_HALF_HOUR_NIS;
export const PODCAST_OVERTIME_BLOCK_MINUTES = 30;

/** עלות כל משתתף נוסף מעבר ל-2 - מיקרופון נוסף + עריכה מוגברת */
export const PODCAST_EXTRA_PARTICIPANT_PRICE = getExVat("podcast_extra_participant");

export const PODCAST_PACKAGES: PodcastPackage[] = [
  {
    id: "starter",
    name: "פרק קצר  -  חצי שעה",
    subtitle: "התחלה משתלמת באולפן",
    price: PODCAST_STARTER_PRICE,
    badge: "התחלה",
    ideal: "פרק ראשון, פיילוט, תוכן קצר",
    features: [
      "הקלטה עד 30 דקות באולפן במודיעין",
      "ליווי טכני בהקלטה",
      "עריכה בסיסית ומסירה",
      "קובץ MP3 מוכן להעלאה",
    ],
    summary:
      "הדרך הכי נגישה להתחיל פודקאסט  -  בלי להתחייב לחבילה גדולה.",
  },
  {
    id: "audio",
    name: "פודקאסט אודיו",
    subtitle: "הקלטה ועריכה מקצועית",
    price: getExVat("podcast_audio"),
    ideal: "ראיונות, דרשות, סיפורים",
    features: [
      "הקלטה עד שעה באולפן",
      "עריכה, מיקס ומסירה לספוטיפיי",
      "קובץ מוכן להעלאה",
      "אחסון ענן עד ההקלטה הבאה",
    ],
    summary:
      "פרק אחד שממשיך לעבוד בשבילכם - תוכן שמביא פניות גם אחרי ההקלטה.",
  },
  {
    id: "video",
    name: "פודקאסט וידאו",
    subtitle: "הקלטה רב-מצלמת באולפן",
    price: getExVat("podcast_video"),
    badge: "הנבחרת",
    ideal: "בניית סמכות, שיווק, ראיונות",
    features: [
      "3 מצלמות באולפן",
      "עריכה ליוטיוב + אודיו לספוטיפיי",
      "תאורה וסאונד מקצועיים",
      "אחסון ענן עד ההקלטה הבאה",
    ],
    summary:
      "וידאו בונה אמון - הקהל מגיע מוכן לפני שמתקשרים.",
  },
  {
    id: "social",
    name: "חבילת תוכן מלאה",
    subtitle: "וידאו + רילס + הפצה",
    price: getExVat("content_package"),
    badge: "מנוע תוכן",
    ideal: "נוכחות דיגיטלית שוטפת",
    features: [
      "כל מה שבחבילת הווידאו",
      "3 קטעי רילס עם כתוביות",
      "העלאה לספוטיפיי ואפל",
      "תקציר מותאם ליוטיוב",
    ],
    summary:
      "מפרק אחד יוצאים כמה נכסי תוכן - פודקאסט, רילס וכתבה.",
  },
];
