import { buildBookHref, type BookCategoryId } from "@/lib/book-url";
import { CTA_LABELS, consumerBookCtaLabel, hubBookCtaLabel } from "@/lib/data/conversion-copy";
import { resolveEventItemIdFromPath } from "@/lib/data/attraction-book-pricing";
import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import { getPriceAudience } from "@/lib/data/pricing-display";

export type ServiceBookCta = {
  bookHref: string;
  bookLabel: string;
  bookCategory: BookCategoryId;
  /** מחיר התחלתי לפני מע״מ - לתג [YC:] ולקופי. null בעמוד בלי מוצר מתומחר משלו */
  priceExVat: number | null;
  /** מזהה הקטלוג שהמחיר בכפתור לקוח ממנו (שלב 4, סעיף 2G) */
  priceCatalogId: PriceItemId | null;
};

type BookMapEntry = {
  bookCategory: BookCategoryId;
  /**
   * המוצר של העמוד עצמו. בלי מזהה, הכפתור הוא "הזמנה מקוונת" בלי מחיר: עמוד
   * שאין לו מחיר משלו לא מציג מחיר של מוצר אחר (WP5, PB-03, PB-04, OAC-01).
   */
  priceCatalogId?: PriceItemId;
  /**
   * escape hatch: מחיר שאין לו עדיין מזהה בקטלוג. כל שימוש חייב הערה עם
   * הסיבה והשאלה שפתוחה אצל הבעלים.
   */
  priceExVat?: number;
  /**
   * עמוד שמציג את טופס הקלטת השיר: הכפתור מציג "מ-590 ₪ כולל מע״מ" בלבד,
   * כמו הטופס (החלטת הבעלים 2.10.2026). שאר עמודי הצרכן מציגים כולל מע״מ
   * ובסוגריים לפני מע״מ.
   */
  consumerVat?: true;
  /** עמוד בלי כפתור הזמנה בכלל (רק וואטסאפ) */
  noBook?: true;
};

const attraction = (slug: string): [string, BookMapEntry] => [
  slug,
  { bookCategory: "events", priceCatalogId: "event_attraction_1" },
];

/**
 * slug (בלי / בהתחלה) -> קטגוריית /book + המוצר של העמוד.
 *
 * WP5 (שלב 4): SLUG_PREFIX_FALLBACK נמחק. הוא נתן לכל עמוד בלי שורה מחיר של
 * מוצר אחר: עמודי קריינות הציגו את מחיר הברכה, ציוד ומנחה הציגו אטרקציה,
 * וכל עמודי הפודקאסט הציגו פיילוט אודיו. עכשיו כל עמוד חייב שורה מפורשת, ועמוד
 * בלי שורה לא מקבל כפתור (נבדק ב-service-book-map.test.ts).
 */
const SERVICE_BOOK_MAP: Record<string, BookMapEntry> = {
  // ─── אולפן ───
  studio: { bookCategory: "studio", priceCatalogId: "blessing_recording", consumerVat: true },
  "studio/pricing": { bookCategory: "studio", priceCatalogId: "blessing_recording", consumerVat: true },
  "studio/blessings": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/blessings/bar-mitzvah": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/blessings/bride-groom-blessing": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  /* קליפ לשיר/ברכה וקליפ בת מצווה: אין להם מזהה במחיר משלהם (שאלת בעלים:
     קליפ בת מצווה 2,590). הכפתור בלי מחיר. */
  "studio/blessings/video-clip": { bookCategory: "studio" },
  "studio/blessings/bat-mitzvah-clip": { bookCategory: "studio" },
  "studio/recording-song-modiin": {
    bookCategory: "studio",
    priceCatalogId: "song_recording",
    consumerVat: true,
  },
  "studio/recording-studio": { bookCategory: "studio", priceCatalogId: "studio_hour" },
  "studio/mobile-studio": { bookCategory: "studio", priceCatalogId: "mobile_podcast_at_home" },
  /* עמודי הערים מובילים לאותו אולפן במודיעין: ברכה היא נקודת הכניסה */
  "studio/studio-jerusalem": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/studio-shoham": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/studio-rehovot": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  "studio/studio-beit-shemesh": { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  voucher: { bookCategory: "studio", priceCatalogId: "blessing_recording" },
  matanot: { bookCategory: "studio" },

  // ─── קריינות: אין מחיר קריינות בקטלוג (שאלת בעלים: IVR, פרסומת, דקת קריינות) ───
  voiceover: { bookCategory: "studio" },
  "voiceover/services": { bookCategory: "studio" },
  /* קורס הקריינות נמכר כשיעורים פרטיים באולפן */
  "voiceover/course": { bookCategory: "academy", priceCatalogId: "academy_private_hour" },

  // ─── פודקאסט: כל עמוד המוצר שלו ───
  podcast: { bookCategory: "podcast", priceCatalogId: "podcast_audio" },
  "podcast/faq": { bookCategory: "podcast", priceCatalogId: "podcast_audio" },
  "podcast/podcast-recording": { bookCategory: "podcast", priceCatalogId: "full_podcast_production" },
  "podcast/podcast-production": { bookCategory: "podcast", priceCatalogId: "full_podcast_production" },
  "podcast/podcast-editing": { bookCategory: "online", priceCatalogId: "podcast_editing_hour" },
  "podcast/podcast-studio-modiin": { bookCategory: "podcast", priceCatalogId: "studio_half_hour" },
  "podcast/podcast-studio": { bookCategory: "podcast", priceCatalogId: "studio_half_hour" },
  "podcast/mobile-podcast-at-home": { bookCategory: "podcast", priceCatalogId: "mobile_podcast_at_home" },
  "podcast/self-service-studio": { bookCategory: "podcast", priceCatalogId: "studio_self_service_hour" },
  /* החלטות 5.10.2026 (פודקאסט): פודקאסט עם סבא וסבתא עולה כמו פודקאסט רגיל */
  "podcast/podcast-with-grandpa": { bookCategory: "podcast", priceCatalogId: "podcast_audio" },
  "podcast/studio-in-a-box": { bookCategory: "podcast", priceCatalogId: "studio_in_box_consult" },
  "podcast/bulk-production": { bookCategory: "podcast", priceCatalogId: "bulk_podcast_episode" },

  // ─── אירועים ───
  events: { bookCategory: "events", priceCatalogId: "event_attraction_1" },
  ...Object.fromEntries(
    [
      "events/attractions",
      "events/attractions/bubble-machine",
      "events/attractions/bubble-machine/smoke-bubble-machine-events",
      "events/attractions/cold-fireworks",
      "events/attractions/confetti-cannon",
      "events/attractions/giant-balloons",
      "events/attractions/smoke-cannons-for-events",
      "events/attractions/wedding-smoking-machine",
      "events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
      "events/stage-led-dj",
    ].map(attraction),
  ),
  "events/dj-events": { bookCategory: "dj", priceCatalogId: "dj_premium" },
  /* בר מצווה נכנס דרך אשף ה-DJ: ה-CTA הראשי הוא תקליטן, והאטרקציות אחריו */
  "events/bar-mitzvah": { bookCategory: "dj", priceCatalogId: "dj_premium" },
  /* חבילות החתונה נמכרות כחבילה בהצעה, לא כאטרקציה בודדת */
  "events/wedding-attractions-packages": { bookCategory: "events" },
  /* ציוד והנחיה: אין להם מחיר פתיחה בקטלוג (שאלת בעלים: מנחה, עמדת LED) */
  /* event_sound_rental (החלטת הבעלים 3.10.2026, סבב שני). אשף האירועים הוא
     שמוכר את השכרת ההגברה במחיר הזה, ולכן הכפתור מוביל אליו. */
  "events/equipment": { bookCategory: "events", priceCatalogId: "event_sound_rental" },
  "events/equipment/faq": { bookCategory: "singer" },
  "events/host": { bookCategory: "events" },
  "events/host/faq": { bookCategory: "events" },
  "events/equipment/singer-amplification": { bookCategory: "singer", priceCatalogId: "singer_amp_basic" },
  "events/equipment/dry-hire": { bookCategory: "singer", priceCatalogId: "dry_hire_day" },
  "events/equipment/system-tuning": { bookCategory: "singer", priceCatalogId: "system_tuning_ease" },
  "events/dj/voice-tags": { bookCategory: "dj", priceCatalogId: "dj_voice_tag_single" },
  "events/dj/pre-built-sets": { bookCategory: "dj", priceCatalogId: "prebuilt_set_corporate" },

  // ─── צילום ווידאו ───
  photography: { bookCategory: "photography", priceCatalogId: "event_photo_hourly" },
  "photography/events": { bookCategory: "photography", priceCatalogId: "event_photo_hourly" },
  "photography/wedding": { bookCategory: "photography", priceCatalogId: "full_event_photo_8h" },
  "photo-slideshow": { bookCategory: "events", priceCatalogId: "growth_slideshow_30" },
  video: { bookCategory: "clips", priceCatalogId: "quick_summary_clip" },
  "video/corporate-video": { bookCategory: "clips" },
  "video/event-filming": { bookCategory: "clips" },
  "video/presentation": { bookCategory: "clips" },

  // ─── אונליין ───
  online: { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" },
  "online/online-ai-pricing": { bookCategory: "online", priceCatalogId: "damaged_recording_rescue" },
  /* החלטת הבעלים D75, 7.10.2026: העמוד מוכר שיפור קול מהנייד (vocal_fix_short).
     היה ai_voice_enhance (450), מחיר שלא מופיע בעמוד */
  "online/vocal-fix": { bookCategory: "online", priceCatalogId: "vocal_fix_short" },
  "online/vocal-fix/pitch-correction": { bookCategory: "online", priceCatalogId: "studio_pitch_correction" },
  "online/vocal-fix/noise-removal": { bookCategory: "online", priceCatalogId: "noise_removal_segment" },
  "online/vocal-fix/eq-fix": { bookCategory: "online", priceCatalogId: "eq_freq_fix" },
  "online/vocal-fix/volume-balance": { bookCategory: "online", priceCatalogId: "volume_balance_full" },
  /* החלטת הבעלים D73, 7.10.2026: שני מוצרים. עמוד המיקס מוכר את online_home_mix
     (500), ו-external_mix_master (1,750) נשאר שירות נפרד. עד אז escape hatch של 500 */
  "online/vocal-fix/mixing": { bookCategory: "online", priceCatalogId: "online_home_mix" },
  /* תיקון סאונד לפודקאסט: הבסיס הוא ניקוי רעשים */
  "online/vocal-fix/podcast-repair": { bookCategory: "online", priceCatalogId: "noise_removal_segment" },
  "online/mashup-fixer": { bookCategory: "online", priceCatalogId: "mashup_custom_planned" },
  "online/legacy-digitization": { bookCategory: "online", priceCatalogId: "legacy_dig_basic" },
  "online/transcription": { bookCategory: "online", priceCatalogId: "transcribe_hour" },
  "online/voice-cloning": { bookCategory: "online", priceCatalogId: "voice_clone_setup" },

  // ─── אקדמיה: שיעור פרטי הוא המוצר המתומחר ───
  academy: { bookCategory: "academy", priceCatalogId: "academy_private_hour" },
  "academy/private-lessons": { bookCategory: "academy", priceCatalogId: "academy_private_hour" },
  "academy/music-production": { bookCategory: "academy", priceCatalogId: "academy_private_hour" },
  "academy/voiceover": { bookCategory: "academy", priceCatalogId: "academy_private_hour" },
  "academy/ai-music": { bookCategory: "academy", priceCatalogId: "academy_private_hour" },
  "academy/workshops": { bookCategory: "academy", priceCatalogId: "workshop_team_2h" },
  /* אולפן עברית: מחירון חודשי נפרד שלא בקטלוג (שאלת בעלים: 36 או 48 שיעורים) */
  "academy/ulpan": { bookCategory: "academy" },

  // ─── עסקים (לפני מע״מ קודם) ───
  pro: { bookCategory: "pro", priceCatalogId: "dj_voice_tag_single" },
  "business/reel-factory": { bookCategory: "clips", priceCatalogId: "reel_factory_rave_24h" },
  "business/content-studio": { bookCategory: "clips", priceCatalogId: "content_studio_session" },
  "business/on-site-studio": { bookCategory: "clips", priceCatalogId: "on_site_half_day" },
  "business/corporate-songs": { bookCategory: "studio", priceCatalogId: "corp_song_toast" },
  "business/audiobooks": { bookCategory: "online", priceCatalogId: "audiobook_hour" },
  "business/audio-branding": { bookCategory: "online", priceCatalogId: "audio_brand_starter" },
  "business/employer-branding": { bookCategory: "online", priceCatalogId: "employer_welcome" },
  /* קריינות לעסקים: המוצר המתומחר היחיד הוא חבילת 5 תגים (1,200). הבעלים יכול
     להטיל וטו (שאלת קריינות 2). */
  "business/professional-voiceover": { bookCategory: "pro", priceCatalogId: "dj_voice_tag_pack_5" },

  // ─── ללא /book ───
  clinic: { bookCategory: "academy", noBook: true },
};

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, "").replace(/\/+$/, "");
}

/** כל ה-slugs שיש להם שורה מפורשת (לבדיקה) */
export function getServiceBookMapSlugs(): string[] {
  return Object.keys(SERVICE_BOOK_MAP);
}

export function resolveServiceBookCta(slug: string): ServiceBookCta | null {
  const normalized = normalizeSlug(slug);
  const entry = SERVICE_BOOK_MAP[normalized];
  if (!entry || entry.noBook) return null;
  const priceCatalogId = entry.priceCatalogId ?? null;
  const priceExVat =
    entry.priceExVat ?? (priceCatalogId ? getExVat(priceCatalogId) : null);
  const pagePath = `/${normalized}`;
  const eventItemId =
    entry.bookCategory === "events" ? resolveEventItemIdFromPath(pagePath) : null;
  const audience = getPriceAudience(entry.bookCategory === "pro" ? "pro" : pagePath);
  let bookLabel: string = CTA_LABELS.bookOnline;
  if (priceExVat) {
    bookLabel = entry.consumerVat
      ? consumerBookCtaLabel(priceExVat)
      : hubBookCtaLabel(priceExVat, audience);
  }
  return {
    bookCategory: entry.bookCategory,
    bookHref: buildBookHref(
      entry.bookCategory,
      eventItemId ? { item: eventItemId } : undefined,
    ),
    bookLabel,
    priceExVat: priceExVat || null,
    priceCatalogId,
  };
}
