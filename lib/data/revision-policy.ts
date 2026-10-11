import type { PriceItemId } from "@/lib/data/pricing-catalog";

/**
 * כמה סבבי תיקונים כלולים, לכל שירות. מקור אחד לדף /whats-included.
 *
 * החלטת הבעלים 11.10.2026: המספר נשאר לפי שירות (לא כלל אחד לכולם). המספרים
 * כאן הם מה שכבר כתוב בדפי השירות, ו-revision-policy.test.ts נכשל אם אחד
 * מהם זז בלי השני. שינוי מספר: מעדכנים כאן ובקובץ המקור שבהערה.
 */
export type RevisionPolicy = {
  id: string;
  service: string;
  href: string;
  /** null: תיקונים כלולים בלי מספר סבבים */
  rounds: number | null;
  summary: string;
  /** פריט בקטלוג לסבב נוסף, כשיש כזה */
  extraRoundId?: PriceItemId;
};

export const REVISION_POLICIES: readonly RevisionPolicy[] = [
  {
    /* D65, 7.10.2026. מקור: PRICE_TRANSPARENCY_OVERRIDES.song_recording */
    id: "song",
    service: "הקלטת שיר",
    href: "/studio/recording-song-modiin",
    rounds: 2,
    summary: "באולפן תיקונים בלי הגבלה, ואחר כך 2 סבבים תוך 24 שעות",
    extraRoundId: "studio_extra_revision",
  },
  {
    /* החלטות 5.10.2026 (ברכות). מקור: PRICE_TRANSPARENCY_OVERRIDES.blessing_recording */
    id: "blessing",
    service: "הקלטת ברכה",
    href: "/studio/blessings",
    rounds: null,
    summary: "תיקונים כלולים במחיר",
  },
  {
    /* מקור: lib/data/podcast-hub-page.ts, שאלה revisions. הבעלים 11.10.2026: סבב נוסף 100 + מע״מ */
    id: "podcast",
    service: "עריכת פודקאסט",
    href: "/podcast",
    rounds: 1,
    summary: "סבב תיקונים אחד כלול בכל חבילה",
    extraRoundId: "podcast_extra_revision",
  },
  {
    /* D73. מקור: PRICE_TRANSPARENCY_OVERRIDES.online_home_mix */
    id: "online-mix",
    service: "מיקס ומאסטרינג אונליין",
    href: "/online/vocal-fix/mixing",
    rounds: 1,
    summary: "סבב תיקונים אחד",
    extraRoundId: "online_extra_revision",
  },
  {
    /* מקור: VOICEOVER_YAKIR_NOTE ב-lib/data/voiceover-narrator-compare.ts */
    id: "voiceover",
    service: "קריינות",
    href: "/voiceover",
    rounds: 2,
    summary: "3 גרסאות לבחירה, ואחרי שבוחרים עד 2 סבבי תיקונים",
  },
  {
    /* מקור: CORPORATE_VIDEO_PROOF ב-lib/data/corporate-video-page.ts */
    id: "corporate-video",
    service: "סרט תדמית",
    href: "/video/corporate-video",
    rounds: 2,
    summary: "2 סבבי תיקונים",
  },
  {
    /* מקור: photo-slideshow-page.ts ו-growth-slideshow-page.ts */
    id: "slideshow",
    service: "מצגות תמונות",
    href: "/photo-slideshow",
    rounds: 1,
    summary: "סבב תיקונים אחד כלול",
  },
] as const;
