/**
 * מטריצת התאמת שירותים - additive בלבד על pathnames קיימים.
 * מזינה HubAudienceFitBlock, ServiceFitSnapshot, PageRelatedFooter.
 * לא יוצרת URLs חדשים ולא משנה canonical.
 */

import type { PriceItemId } from "@/lib/data/pricing-catalog";
import { getDecisionPaths } from "@/lib/data/service-decision-paths";
import { getNextUpSuggestion } from "@/lib/data/next-up";
import { getSameCategoryLinks } from "@/lib/site-architecture";


export type FitAudience = "families" | "creators" | "business";
/* studio_or_mobile: לשירות שבאמת מוכר את שתי הדרכים באותו עמוד (ליווי הפקת
   פודקאסט, אישור הבעלים 7.10.2026). עמודים שמוכרים רק אולפן או רק נייד נשארים
   in_studio או mobile, לפי כלל ההפרדה ב-docs/SERVICE-FIT-MATRIX.md. */
export type FitDelivery =
  | "in_studio"
  | "mobile"
  | "studio_or_mobile"
  | "on_site"
  | "self_service";
export type FitGuidance = "self_service" | "assisted" | "full_production";
/* guided_podcast: ליווי שלם מהאפיון ועד הפרק, לא פרק בודד מוכן (אישור הבעלים
   7.10.2026, שלבי הליווי ב-lib/data/podcast-production-page.ts).
   studio_raw_or_switched: השכרת האולפן. תשובות הבעלים 8.10.2026: קובץ גולמי,
   ועם מצלמות שימוש במתקני האולפן, הדרכה וליווי של איש טכני. לא "פרק פודקאסט
   מוכן", כי חצי שעה באולפן היא קובץ גולמי בלי עריכה. */
export type FitOutcome =
  | "ready_song"
  | "recorded_blessing"
  | "finished_podcast_episode"
  | "studio_raw_or_switched"
  | "guided_podcast"
  | "video_clip"
  | "finished_audiobook"
  | "business_content_day";

export type ServiceFitEntry = {
  pathname: string;
  hubPath: string;
  titleHe: string;
  primaryAudience: FitAudience;
  secondaryAudience?: FitAudience;
  delivery: FitDelivery;
  guidance: FitGuidance;
  outcome: FitOutcome;
  /** דף מומלץ הבא - pathname קיים בלבד */
  nextPath: string;
  /**
   * עוגן מחיר מהקטלוג (שלב 4, סעיף 2B). היה priceAnchorExVat, מספר כתוב, ובפועל
   * 36 מספרים: 990 לשיר אחרי שהמחיר ירד ל-500, 1,750 לאטרקציות, 750 (חצי שעה
   * גלם) לעמוד הקלטת הפודקאסט. עמוד בלי מוצר מתומחר משלו לא מקבל עוגן.
   */
  priceAnchorId?: PriceItemId;
  notes?: string;
};

export const FIT_AUDIENCE_LABEL: Record<FitAudience, string> = {
  families: "משפחות ופרטיים",
  creators: "יוצרים ופודקאסטרים",
  business: "עסקים וצוותים",
};

export const FIT_DELIVERY_LABEL: Record<FitDelivery, string> = {
  in_studio: "באולפן",
  mobile: "נייד - מגיע אליכם",
  studio_or_mobile: "באולפן במודיעין או נייד",
  on_site: "אצל הלקוח",
  self_service: "עצמאי / מרחוק",
};

export const FIT_GUIDANCE_LABEL: Record<FitGuidance, string> = {
  self_service: "שירות עצמי",
  assisted: "עם ליווי",
  full_production: "הפקה מלאה",
};

export const FIT_OUTCOME_LABEL: Record<FitOutcome, string> = {
  ready_song: "שיר מוכן",
  recorded_blessing: "ברכה מוקלטת",
  finished_podcast_episode: "פרק פודקאסט מוכן",
  studio_raw_or_switched: "קובץ גולמי, עם ליווי טכני ומתקני האולפן",
  guided_podcast: "פודקאסט בליווי מלא, מהאפיון ועד הפרק",
  video_clip: "וידאו / קליפ",
  finished_audiobook: "ספר שמע מוכן",
  business_content_day: "יום תוכן לעסק",
};

/** מחירון לפי hub - להשוואה ב-PageRelatedFooter */
const HUB_PRICING_PATH: Record<string, string> = {
  "/studio": "/studio/pricing",
  "/podcast": "/pricing",
  "/events": "/pricing",
  "/business": "/pricing",
  "/academy": "/pricing",
  "/online": "/online/online-ai-pricing",
  "/voiceover": "/pricing",
  "/video": "/pricing",
  "/photography": "/pricing",
};

/**
 * שירותים ראשיים בלבד (לא כל עלי האטרקציות / FAQ).
 * קהל ראשי אחד; secondary רק כשמשפר בהירות.
 */
export const SERVICE_FIT_MATRIX: readonly ServiceFitEntry[] = [
  // ── Studio ──
  {
    pathname: "/studio/recording-song-modiin",
    hubPath: "/studio",
    titleHe: "הקלטת שיר",
    primaryAudience: "families",
    secondaryAudience: "creators",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/studio/blessings/video-clip",
    priceAnchorId: "song_recording",
  },
  {
    pathname: "/studio/recording-song-modiin/gifts",
    hubPath: "/studio",
    titleHe: "שיר במתנה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/studio/blessings",
    hubPath: "/studio",
    titleHe: "הקלטת ברכה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorId: "blessing_recording",
    notes: "אפשר גם מהבית - עדיין אותו outcome",
  },
  {
    pathname: "/studio/blessings/video-clip",
    hubPath: "/studio",
    titleHe: "שיר + קליפ",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/studio/blessings/bar-mitzvah",
    hubPath: "/studio",
    titleHe: "ברכה לבר/בת מצווה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/studio/blessings/video-clip",
    priceAnchorId: "blessing_recording",
  },
  {
    pathname: "/studio/blessings/bride-groom-blessing",
    hubPath: "/studio",
    titleHe: "ברכת חתן וכלה",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorId: "blessing_recording",
  },
  {
    pathname: "/studio/mobile-studio",
    hubPath: "/studio",
    titleHe: "אולפן נייד",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "mobile",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/pricing",
    priceAnchorId: "mobile_podcast_at_home",
    notes: "לא לערבב עם הקלטה באולפן מודיעין",
  },
  {
    pathname: "/studio/recording-studio",
    hubPath: "/studio",
    titleHe: "אולפן הקלטות",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/pricing",
    priceAnchorId: "studio_half_hour",
  },
  {
    pathname: "/studio/studio-jerusalem",
    hubPath: "/studio",
    titleHe: "אולפן לירושלים",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO - האולפן הפיזי במודיעין",
  },
  {
    pathname: "/studio/studio-shoham",
    hubPath: "/studio",
    titleHe: "אולפן לשוהם",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO - האולפן הפיזי במודיעין",
  },
  {
    pathname: "/studio/studio-rehovot",
    hubPath: "/studio",
    titleHe: "אולפן לרחובות",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    notes: "GEO - האולפן הפיזי במודיעין",
  },

  // ── Podcast ──
  {
    pathname: "/podcast/podcast-recording",
    hubPath: "/podcast",
    titleHe: "הקלטת פודקאסט",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-editing",
    priceAnchorId: "full_podcast_production",
  },
  {
    pathname: "/podcast/podcast-production",
    hubPath: "/podcast",
    titleHe: "הפקת פודקאסט",
    primaryAudience: "creators",
    secondaryAudience: "business",
    /* אישור הבעלים 7.10.2026: העמוד מוכר ליווי שלם, מקליטים באולפן במודיעין
       או בנייד, והעריכה כלולה. לכן לא "פרק מוכן", לא "באולפן" בלבד, והצעד
       הבא כבר לא עריכת פודקאסט. פס הייצור הוא ההמשך למי שכבר יש לו פורמט,
       כמו בהשוואת המסלולים בעמוד. שיחת האפיון עצמה לא יכולה להופיע כאן:
       nextPath הוא עמוד מהמטריצה בלבד, והכפתור שלה כבר בעמוד. */
    delivery: "studio_or_mobile",
    guidance: "full_production",
    outcome: "guided_podcast",
    nextPath: "/podcast/bulk-production",
    /* בלי priceAnchorId (היה podcast_video), אישור הבעלים 7.10.2026: לליווי
       אין מחיר התחלה אחד, "קודם מבינים מה אתם צריכים, ורק אחר כך מדברים על
       מחיר". השדה אופציונלי, כמו בכל עמוד בלי מוצר מתומחר משלו. */
  },
  {
    pathname: "/podcast/podcast-editing",
    hubPath: "/podcast",
    titleHe: "עריכת פודקאסט",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-recording",
    priceAnchorId: "podcast_editing_hour",
    notes: "מרחוק על קובץ קיים - לא סשן אולפן",
  },
  {
    pathname: "/podcast/podcast-studio-modiin",
    hubPath: "/podcast",
    titleHe: "השכרת אולפן פודקאסט",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    /* היה finished_podcast_episode, "פרק פודקאסט מוכן", ליד עוגן של חצי שעה
       גלם. תשובות הבעלים 8.10.2026, תשובה 5 */
    outcome: "studio_raw_or_switched",
    nextPath: "/podcast/podcast-recording",
    priceAnchorId: "studio_half_hour",
    notes: "חדר+ציוד בלי הפקה מלאה",
  },
  {
    pathname: "/podcast/self-service-studio",
    hubPath: "/podcast",
    titleHe: "אולפן שירות עצמי",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "self_service",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-editing",
    priceAnchorId: "studio_self_service_hour",
  },
  {
    pathname: "/podcast/mobile-podcast-at-home",
    hubPath: "/podcast",
    titleHe: "פודקאסט נייד",
    primaryAudience: "creators",
    secondaryAudience: "families",
    delivery: "mobile",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/pricing",
    priceAnchorId: "mobile_podcast_at_home",
    notes: "לא לערבב עם הקלטה באולפן",
  },
  {
    pathname: "/podcast/podcast-with-grandpa",
    hubPath: "/podcast",
    titleHe: "פודקאסט עם סבא וסבתא",
    primaryAudience: "families",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/podcast-recording",
  },
  {
    pathname: "/podcast/corporate-podcast",
    hubPath: "/podcast",
    titleHe: "פודקאסט ארגוני",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/business",
    priceAnchorId: "corp_podcast_retainer",
    notes: "נפרד מפודקאסט ליוצרים פרטיים",
  },
  {
    pathname: "/podcast/bulk-production",
    hubPath: "/podcast",
    titleHe: "פס ייצור פודקאסט",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/corporate-podcast",
    priceAnchorId: "bulk_podcast_episode",
  },

  // ── Business ──
  {
    pathname: "/business/content-studio",
    hubPath: "/business",
    titleHe: "סושיאל דאמפ",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/business/on-site-studio",
    priceAnchorId: "content_studio_pilot",
  },
  {
    pathname: "/business/on-site-studio",
    hubPath: "/business",
    titleHe: "אולפן זמני בחברה",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/pricing",
    priceAnchorId: "on_site_half_day",
    notes: "on-site ≠ mobile למשפחה",
  },
  {
    pathname: "/business/reel-factory",
    hubPath: "/business",
    titleHe: "מפעל רילס",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/business/content-studio",
    priceAnchorId: "reel_factory_single",
  },
  {
    pathname: "/business/audiobooks",
    hubPath: "/business",
    titleHe: "ספרי שמע",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "finished_audiobook",
    nextPath: "/voiceover/services",
    priceAnchorId: "audiobook_hour",
  },
  {
    pathname: "/business/employer-branding",
    hubPath: "/business",
    titleHe: "תוכן HR",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/business/content-studio",
    priceAnchorId: "employer_welcome",
  },
  {
    pathname: "/business/corporate-songs",
    hubPath: "/business",
    titleHe: "שירים לחברות",
    primaryAudience: "business",
    delivery: "in_studio",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorId: "corp_song_toast",
  },

  // ── Academy ──
  {
    pathname: "/academy/dj-course",
    hubPath: "/academy",
    titleHe: "קורס DJ",
    primaryAudience: "creators",
    secondaryAudience: "families",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/academy/music-production",
  },
  {
    pathname: "/academy/music-production",
    hubPath: "/academy",
    titleHe: "הפקת מוזיקה",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/academy/voiceover",
    hubPath: "/academy",
    titleHe: "קורס קריינות",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/voiceover/services",
  },
  {
    pathname: "/academy/private-lessons",
    hubPath: "/academy",
    titleHe: "שיעור פרטי",
    primaryAudience: "creators",
    delivery: "in_studio",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/academy",
    priceAnchorId: "academy_private_hour",
  },
  {
    pathname: "/academy/workshops",
    hubPath: "/academy",
    titleHe: "סדנאות לצוותים",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "business_content_day",
    nextPath: "/business/content-studio",
    priceAnchorId: "workshop_team_2h",
  },
  {
    pathname: "/academy/ai-music",
    hubPath: "/academy",
    titleHe: "AI מוזיקה",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },

  // ── Online ──
  {
    pathname: "/online/vocal-fix",
    hubPath: "/online",
    titleHe: "שיפור קול",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/online/vocal-fix/send-file",
    priceAnchorId: "ai_voice_enhance",
  },
  {
    pathname: "/online/mashup-fixer",
    hubPath: "/online",
    titleHe: "תיקון מאשאפ",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/events/dj-events",
    priceAnchorId: "mashup_custom_planned",
  },
  {
    pathname: "/online/transcription",
    hubPath: "/online",
    titleHe: "תמלול וכתוביות",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/online",
    priceAnchorId: "transcribe_30min",
  },
  {
    pathname: "/online/vocal-fix/pitch-correction",
    hubPath: "/online",
    titleHe: "תיקון זיופים",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/online/vocal-fix/mixing",
  },
  {
    pathname: "/online/vocal-fix/mixing",
    hubPath: "/online",
    titleHe: "מיקס ומאסטרינג",
    primaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/recording-song-modiin",
  },
  {
    pathname: "/online/voice-cloning",
    hubPath: "/online",
    titleHe: "שיבוט קול",
    primaryAudience: "business",
    secondaryAudience: "creators",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "recorded_blessing",
    nextPath: "/voiceover/services",
    priceAnchorId: "voice_clone_setup",
  },
  {
    pathname: "/online/legacy-digitization",
    hubPath: "/online",
    titleHe: "החייאת זיכרונות",
    primaryAudience: "families",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/studio/blessings",
    priceAnchorId: "legacy_dig_basic",
  },
  {
    pathname: "/podcast/studio-in-a-box",
    hubPath: "/podcast",
    titleHe: "אולפן בקופסה",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "finished_podcast_episode",
    nextPath: "/podcast/corporate-podcast",
    priceAnchorId: "studio_in_box_consult",
    notes: "ציוד לעסק - לא סשן באולפן",
  },

  // ── Events (primary only) ──
  {
    pathname: "/events/dj-events",
    hubPath: "/events",
    titleHe: "DJ לאירועים",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/events/attractions",
    priceAnchorId: "dj_premium",
  },
  {
    pathname: "/events/bar-mitzvah",
    hubPath: "/events",
    titleHe: "בר מצווה ובת מצווה",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/studio/blessings/bar-mitzvah",
    priceAnchorId: "dj_premium",
    notes: "הפקת הערב בשטח. הקלטת הדרשה באולפן היא עמוד נפרד",
  },
  {
    pathname: "/events/attractions",
    hubPath: "/events",
    titleHe: "אטרקציות",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "video_clip",
    nextPath: "/events/wedding-attractions-packages",
    priceAnchorId: "event_attraction_1",
  },
  {
    pathname: "/events/wedding-attractions-packages",
    hubPath: "/events",
    titleHe: "חבילות לחתונה",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/events/dj-events",
  },
  {
    pathname: "/events/stage-led-dj",
    hubPath: "/events",
    titleHe: "עמדת LED",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "video_clip",
    nextPath: "/events/dj-events",
    priceAnchorId: "led_lighting",
  },
  {
    pathname: "/events/equipment",
    hubPath: "/events",
    titleHe: "הגברה ותאורה",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "ready_song",
    nextPath: "/events/dj-events",
  },
  {
    pathname: "/events/host",
    hubPath: "/events",
    titleHe: "מנחה אירוע",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "ready_song",
    nextPath: "/events/dj-events",
  },
  {
    pathname: "/photo-slideshow",
    hubPath: "/events",
    titleHe: "מצגת תמונות",
    primaryAudience: "families",
    delivery: "self_service",
    guidance: "assisted",
    outcome: "video_clip",
    nextPath: "/studio/recording-song-modiin",
    priceAnchorId: "growth_slideshow_30",
  },

  // ── Voiceover / Video ──
  {
    pathname: "/voiceover/services",
    hubPath: "/voiceover",
    titleHe: "שירותי קריינות",
    primaryAudience: "business",
    secondaryAudience: "creators",
    delivery: "self_service",
    guidance: "full_production",
    outcome: "recorded_blessing",
    nextPath: "/academy/voiceover",
  },
  {
    pathname: "/video/corporate-video",
    hubPath: "/video",
    titleHe: "סרט תדמית",
    primaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/business",
  },
  {
    pathname: "/video/event-filming",
    hubPath: "/video",
    titleHe: "צילום אירועים",
    primaryAudience: "families",
    secondaryAudience: "business",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/events/dj-events",
  },
  {
    pathname: "/photography/wedding",
    hubPath: "/photography",
    titleHe: "צילום חתונות",
    primaryAudience: "families",
    delivery: "on_site",
    guidance: "full_production",
    outcome: "video_clip",
    nextPath: "/events/dj-events",
    priceAnchorId: "full_event_photo_8h",
  },
  {
    pathname: "/photography/events",
    hubPath: "/photography",
    titleHe: "צילום אירועים וכנסים",
    primaryAudience: "business",
    secondaryAudience: "families",
    delivery: "on_site",
    guidance: "assisted",
    outcome: "video_clip",
    nextPath: "/photography/wedding",
    priceAnchorId: "event_photo_hourly",
  },
  {
    pathname: "/business/audio-branding",
    hubPath: "/business",
    titleHe: "מיתוג קולי",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "full_production",
    outcome: "recorded_blessing",
    nextPath: "/business/content-studio",
    priceAnchorId: "audio_brand_starter",
  },
  {
    pathname: "/business/social-media",
    hubPath: "/business",
    titleHe: "ניהול סושיאל",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "full_production",
    outcome: "business_content_day",
    nextPath: "/business/reel-factory",
  },
  {
    pathname: "/business/professional-voiceover",
    hubPath: "/business",
    titleHe: "קריינות לעסקים",
    primaryAudience: "business",
    delivery: "self_service",
    guidance: "full_production",
    outcome: "recorded_blessing",
    nextPath: "/voiceover/services",
  },
] as const;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

const BY_PATH = new Map(
  SERVICE_FIT_MATRIX.map((entry) => [entry.pathname, entry] as const),
);

export function getServiceFit(pathname: string): ServiceFitEntry | null {
  return BY_PATH.get(normalizePath(pathname)) ?? null;
}

export function getHubFitEntries(hubPath: string): ServiceFitEntry[] {
  const hub = normalizePath(hubPath);
  return SERVICE_FIT_MATRIX.filter((e) => e.hubPath === hub);
}

export function getHubFitByAudience(
  hubPath: string,
): Record<FitAudience, ServiceFitEntry[]> {
  const entries = getHubFitEntries(hubPath);
  return {
    families: entries.filter((e) => e.primaryAudience === "families"),
    creators: entries.filter((e) => e.primaryAudience === "creators"),
    business: entries.filter((e) => e.primaryAudience === "business"),
  };
}

/** כל השירותים עם קהל ראשי נתון (למסלולי /for-couples /for-creators וכו'). */
export function getFitEntriesByPrimaryAudience(
  audience: FitAudience,
): ServiceFitEntry[] {
  return SERVICE_FIT_MATRIX.filter((e) => e.primaryAudience === audience);
}

export type RelatedRole = "primary" | "complementary" | "comparative";

export type RelatedLink = {
  href: string;
  label: string;
  role: RelatedRole;
};

function titleForPath(pathname: string): string {
  const fit = getServiceFit(pathname);
  if (fit) return fit.titleHe;
  const next = getNextUpSuggestion(pathname);
  if (next && next.href === pathname) return next.label;
  return pathname.split("/").filter(Boolean).at(-1) ?? pathname;
}

/**
 * עד 3 קישורים: ראשי (next-up / nextPath) · משלים · השוואתי.
 * לא כולל book/pricing כראשי - ההמרה ב-sticky.
 */
export function getPageRelatedTrio(pathname: string): RelatedLink[] {
  const path = normalizePath(pathname);
  const fit = getServiceFit(path);
  const nextUp = getNextUpSuggestion(path);
  const result: RelatedLink[] = [];
  const used = new Set<string>([path]);

  const primaryHref = nextUp?.href ?? fit?.nextPath;
  if (primaryHref && !used.has(normalizePath(primaryHref))) {
    const href = normalizePath(primaryHref);
    used.add(href);
    result.push({
      href,
      label: nextUp?.label ?? titleForPath(href),
      role: "primary",
    });
  }

  // משלים/השוואתי: קודם service-decision-paths (קיים), אחר כך siblings
  const decisionEdges = getDecisionPaths(path);
  for (const edge of decisionEdges) {
    if (result.length >= 3) break;
    const href = normalizePath(edge.href);
    if (used.has(href)) continue;
    used.add(href);
    result.push({
      href,
      label: edge.label,
      role: result.some((r) => r.role === "complementary")
        ? "comparative"
        : "complementary",
    });
  }

  const siblings = getSameCategoryLinks(path);
  for (const sib of siblings) {
    if (result.length >= 3) break;
    const href = normalizePath(sib.href);
    if (used.has(href)) continue;
    used.add(href);
    result.push({
      href,
      label: sib.label,
      role: result.some((r) => r.role === "complementary")
        ? "comparative"
        : "complementary",
    });
  }

  if (result.length < 3) {
    const hub = fit?.hubPath ?? `/${path.split("/").filter(Boolean)[0] ?? ""}`;
    const pricingHref = HUB_PRICING_PATH[hub] ?? "/pricing";
    const href = normalizePath(pricingHref);
    if (!used.has(href)) {
      result.push({
        href,
        label: href.includes("studio/pricing") ? "מחירון אולפן" : "מחירון",
        role: "comparative",
      });
    }
  }

  return result.slice(0, 3);
}
