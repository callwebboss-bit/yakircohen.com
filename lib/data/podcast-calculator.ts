export type PodcastPackageId = "starter" | "audio" | "video" | "social";

import { STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";
import {
  CATALOG_BUNDLES,
  CATALOG_VAT_RATE,
  catalogWithVat,
  getExVat,
  getPriceById,
  PODCAST_AUDIO_PACK_IDS,
  PODCAST_PACK_NOTE,
  PODCAST_PARTICIPANT_RULES,
} from "@/lib/data/pricing-catalog";
import { buildPersonBreakdown, formatPerPersonPrice } from "@/lib/data/participant-cost-copy";
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

/** עלות כל משתתף נוסף מעבר ל-2 (החלטות 5.10.2026 (פודקאסט): 99, כמו בשיר ובברכה) */
export const PODCAST_EXTRA_PARTICIPANT_PRICE = getExVat(PODCAST_PARTICIPANT_RULES.extraId);

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
    /* החלטת הבעלים D63, 7.10.2026: הפרק המלא בסוף ההקלטה. עריכה נוספת היא
       ההפקה המלאה (full_podcast_production), ולכן "עריכה ליוטיוב" ירד מכאן */
    features: [
      "3 מצלמות באולפן",
      "הפרק המלא אצלכם מיד בסוף ההקלטה",
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
      "הקלטה עד שעה, עריכת ההקלטה וחלל האולפן",
      "או שיפור סאונד להקלטה קיימת שאתם מביאים",
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

/** באולפן: 2 משתתפים כלולים, וכל משתתף נוסף podcast_extra_participant (99), עד 12 */
export const PODCAST_INCLUDED_PARTICIPANTS = PODCAST_PARTICIPANT_RULES.included;
export const PODCAST_MAX_PARTICIPANTS = PODCAST_PARTICIPANT_RULES.max;

/** מספר משתתפים באולפן בין 1 ל-12 */
export function clampPodcastParticipants(participants: number): number {
  const n = Math.trunc(Number.isFinite(participants) ? participants : 1);
  return Math.min(PODCAST_MAX_PARTICIPANTS, Math.max(1, n));
}

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
  const extra = Math.max(0, clampPodcastParticipants(participants) - PODCAST_INCLUDED_PARTICIPANTS);
  return Array.from({ length: extra }, () => PODCAST_EXTRA_PARTICIPANT_PRICE);
}

/** תוספת המשתתפים לפני מע״מ. באולפן מהשלישי, באולפן הנייד מהשני (ערוץ לכל אדם). */
export function podcastParticipantsCostExVat(participants: number, mobile: boolean): number {
  return podcastParticipantExtras(participants, mobile).reduce((sum, x) => sum + x, 0);
}

/** "2 משתתפים כלולים. כל משתתף נוסף: +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בפרק" */
export function podcastParticipantPriceLine(): string {
  return `${PODCAST_INCLUDED_PARTICIPANTS} משתתפים כלולים. ${formatPerPersonPrice(PODCAST_EXTRA_PARTICIPANT_PRICE, CATALOG_VAT_RATE)} · עד ${PODCAST_MAX_PARTICIPANTS} בפרק`;
}

/* ─── חבילות פרקי אודיו (החלטות 5.10.2026 (פודקאסט)) ─── */

export type PodcastAudioPack = {
  id: (typeof PODCAST_AUDIO_PACK_IDS)[number];
  label: string;
  episodes: number;
  exVat: number;
  /** כמה עולים אותם פרקים בנפרד, לפני מע״מ */
  separateExVat: number;
  suitedFor: string;
};

export const PODCAST_AUDIO_PACKS: readonly PodcastAudioPack[] = PODCAST_AUDIO_PACK_IDS.map((id) => {
  const bundle = CATALOG_BUNDLES.find((b) => b.bundleId === id);
  if (!bundle) throw new Error(`podcast pack ${id} missing from CATALOG_BUNDLES`);
  const item = getPriceById(id);
  return {
    id,
    label: item.label,
    episodes: bundle.count,
    exVat: item.exVat,
    separateExVat: getExVat(bundle.singleId) * bundle.count,
    suitedFor: item.suitedFor ?? "",
  };
});

function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/**
 * "חבילת 4 פרקי אודיו: 4,125 ₪ כולל מע״מ (3,496 ₪ + מע״מ)". בלי מחיר לפרק:
 * הוא לא מגובה בקטלוג (audit:price-literals).
 */
export function podcastAudioPackLine(pack: PodcastAudioPack): string {
  return `${pack.label}: ${nis(catalogWithVat(pack.exVat))} כולל מע״מ (${nis(pack.exVat)} + מע״מ)`;
}

/** "1,121 ₪ כולל מע״מ (950 ₪ + מע״מ)" */
export function podcastDualPrice(exVat: number): string {
  return `${nis(catalogWithVat(exVat))} כולל מע״מ (${nis(exVat)} + מע״מ)`;
}

/** דוגמה: 4 משתתפים בפרק אודיו באולפן, פירוט לפי משתתף כולל מע״מ קודם */
export function podcastParticipantExampleLine(count = 4): string {
  const audio = getExVat("podcast_audio");
  return buildPersonBreakdown({
    count,
    baseExVat: audio,
    extrasExVat: podcastParticipantExtras(count, false),
    vatRate: CATALOG_VAT_RATE,
  }).line;
}

/** תשובה ל"יש הנחה על סדרת פרקים?" (עמודי הערים ומרכז הפודקאסט) */
export function podcastSeriesAnswer(): string {
  return `כן, יש שתי חבילות קבועות. ${PODCAST_AUDIO_PACKS.map(podcastAudioPackLine).join(". ")}. ${PODCAST_PACK_NOTE}. לסדרת וידאו בונים הצעה לפי מספר הפרקים.`;
}
