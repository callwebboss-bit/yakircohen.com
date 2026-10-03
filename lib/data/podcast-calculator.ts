export type PodcastPackageId = "starter" | "audio" | "video" | "social";

import { STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";
import { clampMobilePeople, MOBILE_STUDIO_CHANNELS } from "@/lib/data/mobile-studio-booking";

/** מחיר פתיחה, פרק חצי שעה (מוצג גם במרכז הפודקאסט) */
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
    id: "starter",
    name: "הקלטה בלבד, חצי שעה",
    subtitle: "חצי שעה חדר, קובץ גולמי, בלי עריכה",
    price: PODCAST_STARTER_PRICE,
    badge: "התחלה",
    ideal: "פרק ראשון, פיילוט, תוכן קצר",
    features: [
      "הקלטה עד 30 דקות באולפן במודיעין",
      "ליווי טכני בהקלטה",
      "קובץ גולמי, בלי עריכה",
      "עריכה בתוספת, או פרק ערוך בחבילת האודיו",
    ],
    summary:
      "הדרך הכי נגישה להתחיל פודקאסט, בלי להתחייב לחבילה גדולה.",
  },
];

/* ─── משתתפים ואולפן נייד (החלטת הבעלים 3.10.2026, סבב שלישי) ─── */

/** באולפן: 2 משתתפים כלולים, וכל משתתף נוסף podcast_extra_participant */
export const PODCAST_INCLUDED_PARTICIPANTS = 2;

/**
 * חבילות שהן הקלטת אודיו. בבית או במשרד הקלטת האודיו כלולה במחיר ההגעה
 * (mobile_podcast_at_home), ולכן באולפן הנייד מחיר החבילה עצמה 0.
 */
export const PODCAST_AUDIO_PACKAGE_IDS: readonly PodcastPackageId[] = ["audio", "starter"];

/** מחיר החבילה לפני מע״מ לפי מקום ההקלטה */
export function podcastPackageExVat(pkg: Pick<PodcastPackage, "id" | "price">, mobile: boolean): number {
  if (mobile && PODCAST_AUDIO_PACKAGE_IDS.includes(pkg.id)) return 0;
  return pkg.price;
}

/** התוספת לכל משתתף מעבר לכלולים, לפי הסדר, לפני מע״מ */
export function podcastParticipantExtras(participants: number, mobile: boolean): number[] {
  if (mobile) {
    const people = clampMobilePeople(participants);
    return Array.from({ length: people - MOBILE_STUDIO_CHANNELS.included }, () => MOBILE_STUDIO_CHANNELS.channelExVat);
  }
  const extra = Math.max(0, Math.trunc(participants) - PODCAST_INCLUDED_PARTICIPANTS);
  return Array.from({ length: extra }, () => PODCAST_EXTRA_PARTICIPANT_PRICE);
}

/** תוספת המשתתפים לפני מע״מ. באולפן מהשלישי, באולפן הנייד מהשני (ערוץ לכל אדם). */
export function podcastParticipantsCostExVat(participants: number, mobile: boolean): number {
  return podcastParticipantExtras(participants, mobile).reduce((sum, x) => sum + x, 0);
}
