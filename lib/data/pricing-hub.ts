import { PRICES_EXCLUDE_VAT_NOTE } from "@/lib/data/pricing";
import {
  formatFromPriceDual,
  getExVat,
  getPriceById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { PODCAST_PACKAGES, type PodcastPackageId } from "@/lib/data/podcast-calculator";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";

export type PricingHubRow = {
  label: string;
  exVat: number;
  note?: string;
  catalogId?: PriceItemId;
  /** עמוד תוכן ייעודי; ברירת מחדל = section.href */
  href?: string;
  /** דורס את catalog.context כשצריך */
  description?: string;
};

export type PricingHubSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  bookHref?: string;
  rows: readonly PricingHubRow[];
};

function hubRow(
  catalogId: PriceItemId,
  overrides?: Partial<Omit<PricingHubRow, "catalogId" | "exVat">> & { label?: string },
): PricingHubRow {
  const item = getPriceById(catalogId);
  return {
    label: overrides?.label ?? item.label,
    exVat: item.exVat,
    catalogId,
    note: overrides?.note,
    href: overrides?.href,
    description: overrides?.description,
  };
}

const PODCAST_PACKAGE_LINKS: Record<
  PodcastPackageId,
  { catalogId: PriceItemId; href: string }
> = {
  social: { catalogId: "content_package", href: "/podcast/podcast-production" },
  video: { catalogId: "podcast_video", href: "/podcast/podcast-studio-modiin" },
  audio: { catalogId: "podcast_audio", href: "/podcast" },
  starter: { catalogId: "studio_half_hour", href: "/podcast" },
};

function podcastPackageRows(): PricingHubRow[] {
  return PODCAST_PACKAGES.map((p) => {
    const link = PODCAST_PACKAGE_LINKS[p.id];
    return {
      label: p.name,
      exVat: p.price,
      note: p.subtitle,
      catalogId: link.catalogId,
      href: link.href,
      description: p.summary,
    };
  });
}

export function resolveRowDescription(row: PricingHubRow): string | undefined {
  if (row.description) return row.description;
  if (row.catalogId) {
    const context = getPriceById(row.catalogId).context;
    if (context) return context;
  }
  return row.note;
}

export function resolveRowHref(row: PricingHubRow, sectionHref: string): string {
  return row.href ?? sectionHref;
}

export function resolveRowBookHref(
  row: PricingHubRow,
  sectionBookHref?: string,
): string {
  if (row.catalogId) {
    const href = resolvePricingBookHref(row.catalogId);
    if (href) return href;
  }
  return sectionBookHref ?? "/book";
}

export const PRICING_HUB_SECTIONS: readonly PricingHubSection[] = [
  {
    id: "studio",
    title: "אולפן והקלטות",
    description: "שעות אולפן, ברכות, קאבר וחבילות שיר",
    href: "/studio/pricing",
    bookHref: "/book#studio",
    rows: [
      hubRow("studio_half_hour", {
        label: "חצי שעה באולפן",
        href: "/studio/recording-studio",
      }),
      hubRow("studio_hour", {
        label: "שעת אולפן מלאה",
        href: "/studio/recording-studio",
      }),
      hubRow("blessing_recording", {
        label: "הקלטת ברכה / אמירה",
        href: "/studio/blessings",
      }),
      hubRow("cover_song", {
        label: "הקלטת שיר קאבר",
        href: "/studio/recording-song-modiin",
      }),
      hubRow("song_package", {
        label: "חבילת הקלטת שיר",
        href: "/studio/recording-song-modiin",
      }),
      hubRow("single_production", {
        label: "הפקת סינגל מלא",
        href: "/studio/recording-song-modiin",
      }),
      hubRow("full_production_clip", {
        label: "הפקה מלאה + קליפ וידאו",
        href: "/studio/blessings/video-clip",
      }),
    ],
  },
  {
    id: "podcast",
    title: "פודקאסט",
    description: "חבילות הקלטה, עריכה, בית וארגוני באולפן במודיעין",
    href: "/podcast",
    bookHref: "/book#podcast",
    rows: [
      ...podcastPackageRows(),
      hubRow("full_podcast_production", {
        label: "הפקת פודקאסט מלאה",
        href: "/podcast/podcast-production",
      }),
      hubRow("podcast_extra_participant", {
        label: "משתתף נוסף (מעל 2)",
        note: "תוספת לכל פרק",
        href: "/podcast",
      }),
      hubRow("full_podcast_production", {
        label: "פודקאסט בבית / אולפן נייד",
        href: "/podcast/mobile-podcast-at-home",
        description: "הגעה + הקלטה + עריכה — מחיר התחלתי לפי היקף",
      }),
      hubRow("corp_podcast_pilot", {
        label: "פיילוט ארגוני",
        href: "/podcast/corporate-podcast",
      }),
      hubRow("corp_podcast_retainer", {
        label: "ריטיינר ארגוני",
        href: "/podcast/corporate-podcast",
      }),
    ],
  },
  {
    id: "podcast-editing",
    title: "עריכת פודקאסט",
    description: "לפי שעת חומר גולמי",
    href: "/podcast/podcast-editing",
    bookHref: "/book#online",
    rows: [
      hubRow("podcast_editing_hour", {
        label: "עריכה לשעת חומר",
      }),
    ],
  },
  {
    id: "online",
    title: "שירותי AI מקוונים",
    description: "עריכה ושחזור קול מרחוק",
    href: "/online/online-ai-pricing",
    bookHref: "/book#online",
    rows: [
      hubRow("damaged_recording_rescue", {
        label: "הצלת הקלטות פגומות",
        note: "שחזור לכל 5 דקות",
        href: "/online/vocal-fix",
      }),
      hubRow("ai_voice_enhance", {
        label: "שיפור קול חכם",
        note: "הבהרה ועקביות לפודקאסט",
        href: "/online/vocal-fix",
      }),
      hubRow("ai_voice_restore", {
        label: "שחזור קול מלא",
        note: "פרק או ראיון עד שעה",
        href: "/online/vocal-fix",
      }),
      hubRow("ai_noise_basic", {
        label: "ניקוי רעשים בסיסי",
        note: "להקלטות קצרות עם רעש קבוע",
        href: "/online/vocal-fix/noise-removal",
      }),
    ],
  },
  {
    id: "events",
    title: "אטרקציות לאירועים",
    description: "עשן, בועות, זיקוקים וחבילות משולבות",
    href: "/events/attractions",
    bookHref: "/book#events",
    rows: [
      hubRow("event_attraction_1", { label: "אטרקציה בודדת" }),
      hubRow("event_attraction_2", { label: "2 אטרקציות (חבילה)" }),
      hubRow("event_attraction_3", { label: "3 אטרקציות (חבילה)" }),
      hubRow("event_attraction_4", {
        label: "4+ אטרקציות + מתנה",
        note: "מצגת תמונות חינם",
      }),
    ],
  },
  {
    id: "slideshows",
    title: "מצגות תמונות",
    description: "מצגות קולנועיות ומצגת גדילה ב-AI",
    href: "/photo-slideshow",
    bookHref: "/book",
    rows: [
      hubRow("cinematic_slideshow", { label: "מצגת תמונות קולנועית" }),
      hubRow("growth_slideshow_30", { label: "מצגת גדילה AI - 30 תמונות" }),
      hubRow("growth_slideshow_50", { label: "מצגת גדילה AI - 50 תמונות" }),
      hubRow("growth_slideshow_70", { label: "מצגת גדילה AI - 70 תמונות" }),
      hubRow("growth_slideshow_100", { label: "מצגת גדילה AI - 100 תמונות" }),
    ],
  },
  {
    id: "content-studio",
    title: "סושיאל דאמפ, רילז לעסקים",
    description: "יום צילום באולפן. רילז ושורטס ערוכים",
    href: "/business/content-studio",
    bookHref: "/book#clips",
    rows: [
      hubRow("content_studio_pilot", { label: "פיילוט, שעה + 5 רילז" }),
      hubRow("content_studio_session", { label: "סשן מלא, 2 שעות + 12 רילז" }),
      hubRow("content_studio_retainer", {
        label: "ריטיינר חודשי",
        note: "סשן + 8–12 רילז",
      }),
    ],
  },
  {
    id: "self-service",
    title: "אולפן שירות עצמי",
    description: "650 ₪ לשעה, בלי עריכה",
    href: "/podcast/self-service-studio",
    bookHref: "/book#podcast",
    rows: [
      hubRow("studio_self_service_hour", {
        label: "שעת אולפן שירות עצמי",
        note: "בלי עריכה, קבצים גולמיים",
      }),
    ],
  },
  {
    id: "on-site-studio",
    title: "אולפן זמני בחברה",
    description: "יום צילום בחדר ישיבות. פודקאסט, ראיונות ווידאו",
    href: "/business/on-site-studio",
    bookHref: "/book#clips",
    rows: [
      hubRow("on_site_half_day", { label: "חצי יום (4 שעות)" }),
      hubRow("on_site_full_day", { label: "יום מלא (8 שעות)" }),
      hubRow("on_site_retainer", {
        label: "ריטיינר חודשי",
        note: "2 ימי צילום + עריכה",
      }),
    ],
  },
  {
    id: "corporate-songs",
    title: "שירים לחברות",
    description: "הרמת כוסית, פרישה והימנון. הפקה וקליפ",
    href: "/business/corporate-songs",
    bookHref: "/book#studio",
    rows: [
      hubRow("corp_song_toast", { label: "שיר הרמת כוסית" }),
      hubRow("corp_song_retirement", { label: "שיר פרישה + קליפ" }),
      hubRow("corp_song_anthem", { label: "הימנון חברה" }),
    ],
  },
  {
    id: "audiobooks",
    title: "ספרי שמע",
    description: "הקלטה ועריכה. ACX, Spotify ואייקאסט",
    href: "/business/audiobooks",
    bookHref: "/book#online",
    rows: [
      hubRow("audiobook_sample", { label: "פרק דוגמה (15 דקות)" }),
      hubRow("audiobook_hour", { label: "שעת הקלטה + עריכה" }),
    ],
  },
  {
    id: "audio-branding",
    title: "מיתוג קולי",
    description: "ג'ינגל, IVR, מוזיקת המתנה ואפקטים",
    href: "/business/audio-branding",
    bookHref: "/book#online",
    rows: [
      hubRow("audio_brand_starter", { label: "חבילת בסיס" }),
      hubRow("audio_brand_full", { label: "חבילה מלאה" }),
      hubRow("audio_brand_premium", { label: "פרימיום + שיבוט קול" }),
    ],
  },
  {
    id: "legacy-digitization",
    title: "החייאת זיכרונות",
    description: "המרת VHS/קלטות לדיגיטל + שחזור AI",
    href: "/online/legacy-digitization",
    bookHref: "/book#online",
    rows: [
      hubRow("legacy_dig_basic", { label: "המרה בסיסית (קלטת אחת)" }),
      hubRow("legacy_dig_ai", { label: "המרה + שחזור AI" }),
    ],
  },
  {
    id: "workshops",
    title: "סדנאות לצוותים",
    description: "טיקטוק, רילז, מול מצלמה. באולפן או בחברה",
    href: "/academy/workshops",
    bookHref: "/book#academy",
    rows: [
      hubRow("workshop_team_2h", { label: "סדנה 2 שעות" }),
      hubRow("workshop_full_day", { label: "יום שלם" }),
      hubRow("workshop_series_3", { label: "3 מפגשים" }),
    ],
  },
  {
    id: "transcription",
    title: "תמלול וכתוביות",
    description: "פודקאסט, ראיונות, SRT",
    href: "/online/transcription",
    bookHref: "/book#online",
    rows: [
      hubRow("transcribe_30min", { label: "חצי שעה, AI" }),
      hubRow("transcribe_hour", { label: "שעת תמלול + עריכה" }),
      hubRow("transcribe_hour_srt", { label: "שעה + SRT" }),
    ],
  },
  {
    id: "voice-cloning",
    title: "שיבוט קול",
    description: "עדכוני IVR בלי הקלטה חוזרת",
    href: "/online/voice-cloning",
    bookHref: "/book#online",
    rows: [
      hubRow("voice_clone_setup", { label: "הקמת מודל קול" }),
      hubRow("voice_clone_ivr_pack", { label: "5 עדכוני IVR" }),
      hubRow("voice_clone_clip", { label: "הקלטה קצרה" }),
    ],
  },
  {
    id: "employer-branding",
    title: "תוכן HR וקליטה",
    description: "סרטוני onboarding לעובדים",
    href: "/business/employer-branding",
    bookHref: "/book#online",
    rows: [
      hubRow("employer_welcome", { label: "סרטון ברוכים הבאים" }),
      hubRow("employer_onboard_day", { label: "יום צילום onboarding" }),
      hubRow("employer_monthly", { label: "ריטיינר HR חודשי" }),
    ],
  },
  {
    id: "reel-factory",
    title: "מפעל רילס לספקים",
    description: "Rave 24 שעות + מנוי Content Hub ל-DJ, צלמים ומפעילי אטרקציות",
    href: "/business/reel-factory",
    bookHref: "/book#clips",
    rows: [
      hubRow("reel_factory_single", { label: "פרומו רילס בודד" }),
      hubRow("reel_factory_rave_24h", {
        label: "Rave ערוך תוך 24 שעות",
        note: "העלאה עד 04:00 = מסירה 12:00",
      }),
      hubRow("reel_factory_starter_monthly", {
        label: "Content Hub בסיס",
        note: "4 פרומואים + פוסטים - לחודש",
      }),
      hubRow("reel_factory_pro_monthly", {
        label: "Content Hub פרו",
        note: "8 פרומואים + כיתובים - לחודש",
      }),
    ],
  },
  {
    id: "pro",
    title: "שירותים מקצועיים לעסקים",
    description: "דיג'ייז, פודקאסט לעסקים והגברה מקצועית",
    href: "/pro",
    bookHref: "/book#pro",
    rows: [
      hubRow("dj_voice_tag_single", {
        label: "תג קולי בודד לדיג'יי",
        href: "/events/dj/voice-tags",
      }),
      hubRow("dj_voice_tag_pack_5", {
        label: "חבילת 5 תגים קוליים",
        href: "/events/dj/voice-tags",
      }),
      hubRow("mashup_ready_single", {
        label: "מאשאפ מוכן לרכישה",
        href: "/online/mashup-fixer",
      }),
      hubRow("mashup_custom_planned", {
        label: "מאשאפ מותאם (עד 3 ימי עסקים)",
        href: "/online/mashup-fixer",
      }),
      hubRow("mashup_creative_plus", {
        label: "שילוב יצירתי / דרוג+",
        href: "/online/mashup-fixer",
      }),
      hubRow("mashup_ready_pack_5", {
        label: "חבילת 5 מאשאפים מוכנים",
        href: "/online/mashup-fixer",
      }),
      hubRow("gym_music_set", {
        label: "סט מוזיקה לחדר כושר",
        href: "/events/dj/pre-built-sets",
      }),
      hubRow("ambience_space_set", {
        label: "פלייליסט לאווירת חלל",
        href: "/events/dj/pre-built-sets",
      }),
      hubRow("prebuilt_set_corporate", {
        label: "סט מוזיקה מוכן לדיג'יי",
        href: "/events/dj/pre-built-sets",
      }),
      hubRow("studio_in_box_consult", {
        label: "אולפן בקופסה + עשרה פרקים",
        href: "/podcast/studio-in-a-box",
      }),
      hubRow("bulk_podcast_episode", {
        label: "פס ייצור - פרק ושלושה סרטונים קצרים",
        href: "/podcast/bulk-production",
      }),
      hubRow("dry_hire_day", {
        label: "השכרת ציוד - יום אחד",
        note: "לפי פריט",
        href: "/events/equipment/dry-hire",
      }),
      hubRow("system_tuning_ease", {
        label: "תכנון הגברה ומדידות",
        href: "/events/equipment/system-tuning",
      }),
    ],
  },
] as const;

export function formatHubPriceRow(exVat: number): string {
  return formatFromPriceDual(exVat).replace("כרגע: ", "החל ");
}

export const PRICES_LAST_UPDATED = "יוני 2026";

export { PRICES_EXCLUDE_VAT_NOTE };
