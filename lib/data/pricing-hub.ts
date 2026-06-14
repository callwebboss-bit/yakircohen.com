import {
  EVENT_ATTRACTION_FROM_NIS,
  PODCAST_EDITING_PER_HOUR_NIS,
  PRICES_EXCLUDE_VAT_NOTE,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";

export type PricingHubSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  bookHref?: string;
  rows: readonly { label: string; exVat: number; note?: string }[];
};

export const PRICING_HUB_SECTIONS: readonly PricingHubSection[] = [
  {
    id: "studio",
    title: "אולפן והקלטות",
    description: "שעות אולפן, ברכות ושירים לאירועים",
    href: "/studio/pricing",
    bookHref: "/book",
    rows: [
      { label: "חצי שעה באולפן", exVat: STUDIO_HALF_HOUR_NIS },
      { label: "שעת אולפן מלאה", exVat: STUDIO_ONE_HOUR_NIS },
    ],
  },
  {
    id: "podcast",
    title: "פודקאסט",
    description: "חבילות הקלטה ועריכה באולפן במודיעין",
    href: "/podcast",
    bookHref: "/book#podcast",
    rows: PODCAST_PACKAGES.map((p) => ({
      label: p.name,
      exVat: p.price,
      note: p.subtitle,
    })),
  },
  {
    id: "podcast-editing",
    title: "עריכת פודקאסט",
    description: "לפי שעת חומר גולמי",
    href: "/podcast/podcast-editing",
    rows: [
      {
        label: "עריכה לשעת חומר",
        exVat: PODCAST_EDITING_PER_HOUR_NIS,
      },
    ],
  },
  {
    id: "online",
    title: "שירותי AI מקוונים",
    description: "עריכה ושחזור קול מרחוק",
    href: "/online/online-ai-pricing",
    bookHref: "/book#online",
    rows: [
      { label: "הצלת הקלטות פגומות", exVat: getExVat("damaged_recording_rescue"), note: "שחזור לכל 5 דקות" },
      { label: "שיפור קול חכם", exVat: getExVat("ai_voice_enhance"), note: "הבהרה ועקביות לפודקאסט" },
      { label: "שחזור קול מלא", exVat: getExVat("ai_voice_restore"), note: "פרק או ראיון עד שעה" },
      { label: "ניקוי רעשים בסיסי", exVat: getExVat("ai_noise_basic"), note: "להקלטות קצרות עם רעש קבוע" },
    ],
  },
  {
    id: "events",
    title: "אטרקציות לאירועים",
    description: "עשן, בועות, זיקוקים וחבילות משולבות",
    href: "/events/attractions",
    bookHref: "/book#events",
    rows: [
      {
        label: "אטרקציה בודדת",
        exVat: EVENT_ATTRACTION_FROM_NIS,
      },
      { label: "2 אטרקציות (חבילה)", exVat: getExVat("event_attraction_2") },
      { label: "3 אטרקציות (חבילה)", exVat: getExVat("event_attraction_3") },
      { label: "4+ אטרקציות + מתנה", exVat: getExVat("event_attraction_4"), note: "מצגת תמונות חינם" },
    ],
  },
  {
    id: "slideshows",
    title: "מצגות תמונות",
    description: "מצגות קולנועיות ומצגת גדילה ב-AI",
    href: "/photo-slideshow",
    bookHref: "/book",
    rows: [
      { label: "מצגת תמונות קולנועית", exVat: getExVat("cinematic_slideshow") },
      { label: "מצגת גדילה AI - 30 תמונות", exVat: getExVat("growth_slideshow_30") },
      { label: "מצגת גדילה AI - 50 תמונות", exVat: getExVat("growth_slideshow_50") },
      { label: "מצגת גדילה AI - 70 תמונות", exVat: getExVat("growth_slideshow_70") },
      { label: "מצגת גדילה AI - 100 תמונות", exVat: getExVat("growth_slideshow_100") },
    ],
  },
  {
    id: "content-studio",
    title: "סושיאל דאמפ, רילז לעסקים",
    description: "יום צילום באולפן. רילז ושורטס ערוכים",
    href: "/business/content-studio",
    bookHref: "/book#clips",
    rows: [
      { label: "פיילוט, שעה + 5 רילז", exVat: getExVat("content_studio_pilot") },
      { label: "סשן מלא, 2 שעות + 12 רילז", exVat: getExVat("content_studio_session") },
      {
        label: "ריטיינר חודשי",
        exVat: getExVat("content_studio_retainer"),
        note: "סשן + 8–12 רילז",
      },
    ],
  },
  {
    id: "self-service",
    title: "אולפן שירות עצמי",
    description: "650 ₪ לשעה, בלי עריכה",
    href: "/podcast/self-service-studio",
    bookHref: "/book#podcast",
    rows: [
      {
        label: "שעת אולפן שירות עצמי",
        exVat: getExVat("studio_self_service_hour"),
        note: "בלי עריכה, קבצים גולמיים",
      },
    ],
  },
  {
    id: "on-site-studio",
    title: "אולפן זמני בחברה",
    description: "יום צילום בחדר ישיבות. פודקאסט, ראיונות ווידאו",
    href: "/business/on-site-studio",
    bookHref: "/book#clips",
    rows: [
      { label: "חצי יום (4 שעות)", exVat: getExVat("on_site_half_day") },
      { label: "יום מלא (8 שעות)", exVat: getExVat("on_site_full_day") },
      {
        label: "ריטיינר חודשי",
        exVat: getExVat("on_site_retainer"),
        note: "2 ימי צילום + עריכה",
      },
    ],
  },
  {
    id: "corporate-songs",
    title: "שירים לחברות",
    description: "הרמת כוסית, פרישה והימנון. הפקה וקליפ",
    href: "/business/corporate-songs",
    bookHref: "/book#studio",
    rows: [
      { label: "שיר הרמת כוסית", exVat: getExVat("corp_song_toast") },
      { label: "שיר פרישה + קליפ", exVat: getExVat("corp_song_retirement") },
      { label: "הימנון חברה", exVat: getExVat("corp_song_anthem") },
    ],
  },
  {
    id: "audiobooks",
    title: "ספרי שמע",
    description: "הקלטה ועריכה. ACX, Spotify ואייקאסט",
    href: "/business/audiobooks",
    bookHref: "/book#online",
    rows: [
      { label: "פרק דוגמה (15 דקות)", exVat: getExVat("audiobook_sample") },
      { label: "שעת הקלטה + עריכה", exVat: getExVat("audiobook_hour") },
    ],
  },
  {
    id: "audio-branding",
    title: "מיתוג קולי",
    description: "ג'ינגל, IVR, מוזיקת המתנה ואפקטים",
    href: "/business/audio-branding",
    bookHref: "/book#online",
    rows: [
      { label: "חבילת בסיס", exVat: getExVat("audio_brand_starter") },
      { label: "חבילה מלאה", exVat: getExVat("audio_brand_full") },
      { label: "פרימיום + שיבוט קול", exVat: getExVat("audio_brand_premium") },
    ],
  },
  {
    id: "legacy-digitization",
    title: "החייאת זיכרונות",
    description: "המרת VHS/קלטות לדיגיטל + שחזור AI",
    href: "/online/legacy-digitization",
    bookHref: "/book#online",
    rows: [
      { label: "המרה בסיסית (קלטת אחת)", exVat: getExVat("legacy_dig_basic") },
      { label: "המרה + שחזור AI", exVat: getExVat("legacy_dig_ai") },
    ],
  },
  {
    id: "workshops",
    title: "סדנאות לצוותים",
    description: "טיקטוק, רילז, מול מצלמה. באולפן או בחברה",
    href: "/academy/workshops",
    bookHref: "/book#academy",
    rows: [
      { label: "סדנה 2 שעות", exVat: getExVat("workshop_team_2h") },
      { label: "יום שלם", exVat: getExVat("workshop_full_day") },
      { label: "3 מפגשים", exVat: getExVat("workshop_series_3") },
    ],
  },
  {
    id: "transcription",
    title: "תמלול וכתוביות",
    description: "פודקאסט, ראיונות, SRT",
    href: "/online/transcription",
    bookHref: "/book#online",
    rows: [
      { label: "חצי שעה, AI", exVat: getExVat("transcribe_30min") },
      { label: "שעת תמלול + עריכה", exVat: getExVat("transcribe_hour") },
      { label: "שעה + SRT", exVat: getExVat("transcribe_hour_srt") },
    ],
  },
  {
    id: "voice-cloning",
    title: "שיבוט קול",
    description: "עדכוני IVR בלי הקלטה חוזרת",
    href: "/online/voice-cloning",
    bookHref: "/book#online",
    rows: [
      { label: "הקמת מודל קול", exVat: getExVat("voice_clone_setup") },
      { label: "5 עדכוני IVR", exVat: getExVat("voice_clone_ivr_pack") },
      { label: "הקלטה קצרה", exVat: getExVat("voice_clone_clip") },
    ],
  },
  {
    id: "employer-branding",
    title: "תוכן HR וקליטה",
    description: "סרטוני onboarding לעובדים",
    href: "/business/employer-branding",
    bookHref: "/book#online",
    rows: [
      { label: "סרטון ברוכים הבאים", exVat: getExVat("employer_welcome") },
      { label: "יום צילום onboarding", exVat: getExVat("employer_onboard_day") },
      { label: "ריטיינר HR חודשי", exVat: getExVat("employer_monthly") },
    ],
  },
  {
    id: "reel-factory",
    title: "מפעל רילס לספקים",
    description: "Rave 24 שעות + מנוי Content Hub ל-DJ, צלמים ומפעילי אטרקציות",
    href: "/business/reel-factory",
    bookHref: "/book#clips",
    rows: [
      { label: "פרומו רילס בודד", exVat: getExVat("reel_factory_single") },
      {
        label: "Rave ערוך תוך 24 שעות",
        exVat: getExVat("reel_factory_rave_24h"),
        note: "העלאה עד 04:00 = מסירה 12:00",
      },
      {
        label: "Content Hub בסיס",
        exVat: getExVat("reel_factory_starter_monthly"),
        note: "4 פרומואים + פוסטים - לחודש",
      },
      {
        label: "Content Hub פרו",
        exVat: getExVat("reel_factory_pro_monthly"),
        note: "8 פרומואים + כיתובים - לחודש",
      },
    ],
  },
  {
    id: "pro",
    title: "שירותים מקצועיים לעסקים",
    description: "דיג'ייז, פודקאסט לעסקים והגברה מקצועית",
    href: "/pro",
    bookHref: "/book#pro",
    rows: [
      { label: "תג קולי בודד לדיג'יי", exVat: getExVat("dj_voice_tag_single") },
      { label: "חבילת 5 תגים קוליים", exVat: getExVat("dj_voice_tag_pack_5") },
      { label: "מאשאפ חירום - עד 24 שעות", exVat: getExVat("mashup_fixer_express") },
      { label: "סט מוזיקה מוכן לדיג'יי", exVat: getExVat("prebuilt_set_corporate") },
      { label: "אולפן בקופסה + עשרה פרקים", exVat: getExVat("studio_in_box_consult") },
      { label: "פס ייצור - פרק ושלושה סרטונים קצרים", exVat: getExVat("bulk_podcast_episode") },
      { label: "השכרת ציוד - יום אחד", exVat: getExVat("dry_hire_day"), note: "לפי פריט" },
      { label: "תכנון הגברה ומדידות", exVat: getExVat("system_tuning_ease") },
    ],
  },
] as const;

export function formatHubPriceRow(exVat: number): string {
  return formatFromPriceDual(exVat).replace("כרגע: ", "החל ");
}

export { PRICES_EXCLUDE_VAT_NOTE };
