/**
 * מקור אמת יחיד לכל מחירי השירות (לפני מע״מ).
 * עדכון מחירים: ערכו כאן בלבד, והריצו `npm run audit:pricing`.
 */

const VAT_RATE_LOCAL = 0.18;

function withVatLocal(amountExVat: number): number {
  return Math.round(amountExVat * (1 + VAT_RATE_LOCAL));
}

function formatNisLocal(amount: number): string {
  return `₪${amount.toLocaleString("he-IL")}`;
}

export type PriceCategory =
  | "studio"
  | "podcast"
  | "events"
  | "dj"
  | "photography"
  | "online"
  | "academy"
  | "addons"
  | "pro";

export type PriceItem = {
  id: string;
  label: string;
  exVat: number;
  category: PriceCategory;
  context?: string;
};

/** כל מחירי השירות - לפני מע״מ */
export const PRICING_CATALOG: readonly PriceItem[] = [
  // ─── אולפן ───
  { id: "studio_half_hour", label: "חצי שעה באולפן", exVat: 750, category: "studio", context: "הקלטה קצרה / פודקאסט פיילוט" },
  { id: "studio_hour", label: "שעת אולפן גמישה", exVat: 1500, category: "studio", context: "60 דקות הקלטה לדיבור, שירה או ברכה" },
  { id: "blessing_recording", label: "הקלטת ברכה או אמירה", exVat: 590, category: "studio", context: "דרשה קצרה או אמירה מרגשת עד חצי שעה" },
  { id: "cover_song", label: "הקלטת שיר קאבר", exVat: 1200, category: "studio", context: "הקלטה על גבי פלייבק קיים עם ליווי מקצועי" },
  { id: "song_package", label: "חבילת הקלטת שיר", exVat: 1800, category: "studio", context: "עד 3 שעות אולפן, טיונינג ווקאלי ומיקס בסיסי" },
  { id: "single_production", label: "הפקת סינגל מלא", exVat: 3500, category: "studio", context: "עד 6 שעות אולפן כולל עיבוד ומאסטר מסחרי" },
  { id: "full_production_clip", label: "הפקה מלאה וקליפ וידאו", exVat: 4500, category: "studio", context: "שיר מוגמר וקליפ וידאו לשיתוף" },

  // ─── פודקאסט ───
  { id: "podcast_pilot", label: "פודקאסט פיילוט אודיו", exVat: 950, category: "podcast", context: "הקלטה של עד שעה כולל עריכה, מיקס והפצה" },
  { id: "podcast_audio", label: "פודקאסט אודיו", exVat: 950, category: "podcast", context: "הקלטה עד שעה + עריכה ומסירה לספוטיפיי" },
  { id: "podcast_video", label: "פודקאסט וידאו", exVat: 1650, category: "podcast", context: "הקלטה רב-מצלמת באולפן, 3 מצלמות ותאורה" },
  { id: "content_package", label: "חבילת תוכן מלאה", exVat: 2800, category: "podcast", context: "וידאו, 3 רילס עם כתוביות והעלאה לפלטפורמות" },
  { id: "full_podcast_production", label: "הפקת פודקאסט מלאה", exVat: 2500, category: "podcast", context: "הגעה, בחירת חלל, הקלטה ועריכה עד פרק מוכן" },
  { id: "podcast_editing_hour", label: "עריכת פודקאסט או סרטון קצר", exVat: 750, category: "podcast", context: "ניקוי רעשים, סנכרון וכתוביות" },
  { id: "podcast_extra_participant", label: "משתתף נוסף בפודקאסט", exVat: 150, category: "podcast", context: "תוספת מיקרופון ועריכה מוגברת מעל 2 אנשים" },
  { id: "studio_self_service_hour", label: "אולפן שירות עצמי", exVat: 650, category: "podcast", context: "שעת הקלטה בלי עריכה, הלקוח לוקח קבצים גולמיים" },

  // ─── תוכן לעסקים (B2B) ───
  { id: "content_studio_pilot", label: "סושיאל דאמפ, פיילוט", exVat: 1650, category: "online", context: "שעה באולפן + 5 רילז/שורטס ערוכים" },
  { id: "content_studio_session", label: "סושיאל דאמפ, סשן מלא", exVat: 2800, category: "online", context: "2 שעות באולפן + 12 רילז עם כתוביות" },
  { id: "content_studio_retainer", label: "סושיאל דאמפ, ריטיינר חודשי", exVat: 4500, category: "online", context: "סשן חודשי + 8–12 רילז, תבניות מותג" },
  { id: "on_site_half_day", label: "אולפן זמני בחברה, חצי יום", exVat: 6500, category: "online", context: "4 שעות, חדר ישיבות, עד 4 מרואים" },
  { id: "on_site_full_day", label: "אולפן זמני בחברה, יום מלא", exVat: 10000, category: "online", context: "8 שעות, עד 8 פרקים/סרטונים גולמיים" },
  { id: "on_site_retainer", label: "אולפן זמני בחברה, ריטיינר", exVat: 28000, category: "online", context: "2 ימי צילום + עריכה" },
  { id: "corp_song_toast", label: "שיר לחברה, הרמת כוסית", exVat: 5000, category: "studio", context: "שיר הומוריסטי / אירוע חברה" },
  { id: "corp_song_retirement", label: "שיר פרישה + קליפ", exVat: 8500, category: "studio", context: "הפקה מלאה לפרישת מנהל" },
  { id: "corp_song_anthem", label: "הימנון חברה", exVat: 12000, category: "studio", context: "שיר וקליפ, מיתוג ארגוני" },
  { id: "audiobook_sample", label: "ספר שמע, פרק דוגמה", exVat: 990, category: "online", context: "15 דקות הקלטה + עריכה" },
  { id: "audiobook_hour", label: "ספר שמע, שעת הקלטה", exVat: 750, category: "online", context: "הקלטה + עריכה בסיסית לשעת חומר" },
  { id: "audio_brand_starter", label: "מיתוג קולי, בסיס", exVat: 1500, category: "online", context: "ג'ינגל 15 שניות + 2 הודעות IVR" },
  { id: "audio_brand_full", label: "מיתוג קולי, מלא", exVat: 4500, category: "online", context: "לוגו קולי + IVR + מוזיקת המתנה + אפקטים" },
  { id: "audio_brand_premium", label: "מיתוג קולי, פרימיום", exVat: 8500, category: "online", context: "חבילה מלאה + שיבוט קול לעדכונים" },
  { id: "legacy_dig_basic", label: "המרת VHS/קלטת לדיגיטל", exVat: 350, category: "online", context: "קלטת אחת → קובץ דיגיטלי" },
  { id: "legacy_dig_ai", label: "המרה + שחזור AI", exVat: 650, category: "online", context: "דיגיטל + ניקוי סאונד/תמונה ב-AI" },

  // ─── שלב 4: סדנאות, AI, HR ───
  { id: "workshop_team_2h", label: "סדנה לצוות, 2 שעות", exVat: 2800, category: "academy", context: "עד 12 משתתפים, טיקטוק/תוכן/מול מצלמה" },
  { id: "workshop_full_day", label: "סדנה יום שלם", exVat: 6500, category: "academy", context: "יום מעשי באולפן או בחברה" },
  { id: "workshop_series_3", label: "סדרת 3 סדנאות", exVat: 7500, category: "academy", context: "3 מפגשים, אותו צוות" },
  { id: "transcribe_30min", label: "תמלול AI, חצי שעה", exVat: 180, category: "online", context: "טיוטה אוטומטית, בדיקה מהירה" },
  { id: "transcribe_hour", label: "תמלול + עריכה, שעה", exVat: 450, category: "online", context: "AI + עריכה אנושית, טקסט נקי" },
  { id: "transcribe_hour_srt", label: "תמלול + כתוביות SRT", exVat: 650, category: "online", context: "שעת אודיו/וידאו, קובץ כתוביות מוכן" },
  { id: "voice_clone_setup", label: "הקמת מודל קול", exVat: 2500, category: "online", context: "הקלטת דגימות + אימון מודל" },
  { id: "voice_clone_clip", label: "קlip ממודל קול, עד דקה", exVat: 450, category: "online", context: "טקסט חדש בקול שכבר הוקם" },
  { id: "voice_clone_ivr_pack", label: "5 עדכוני IVR ממודל קול", exVat: 1200, category: "online", context: "לאחר הקמת מודל" },
  { id: "employer_welcome", label: "סרטון ברוכים הבאים", exVat: 4500, category: "online", context: "הקלטה + עריכה, עד 3 דקות" },
  { id: "employer_onboard_day", label: "יום צילום onboarding", exVat: 9500, category: "online", context: "ראיונות, סיור וירטואלי, 5–8 סרטונים גולמיים" },
  { id: "employer_monthly", label: "ריטיינר תוכן HR", exVat: 18500, category: "online", context: "סשן חודשי + עריכה, סרטוני קליטה שוטפים" },

  // ─── DJ ואירועים ───
  { id: "dj_premium", label: "תקליטן פרימיום מהצוות", exVat: 5000, category: "dj", context: "4 שעות תקלוט של דיג׳יי מנוסה" },
  { id: "dj_yakir_personal", label: "תקליטן יקיר כהן אישית", exVat: 9800, category: "dj", context: "5 שעות VIP עם יקיר על הקונסולה" },
  { id: "mobile_studio", label: "אולפן הקלטות נייד", exVat: 5000, category: "events", context: "הקמת מיקרופונים ועמדת עריכה בשטח" },
  { id: "festival_all_in", label: "חבילת פסטיבל הכל כלול", exVat: 15000, category: "events", context: "DJ פרימיום, אולפן נייד, 3 אטרקציות ומצגת" },
  { id: "pre_event_production", label: "הפקה מקדימה ותיאום מוזיקלי", exVat: 980, category: "events", context: "תיאום מלא עם הדיג׳יי" },
  { id: "cinematic_slideshow", label: "מצגת תמונות קולנועית", exVat: 750, category: "events", context: "סיפור ויזואלי מרגש על מסכים באירוע" },
  { id: "growth_slideshow_30", label: "מצגת גדילה AI - 30 תמונות", exVat: 750, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_50", label: "מצגת גדילה AI - 50 תמונות", exVat: 1100, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_70", label: "מצגת גדילה AI - 70 תמונות", exVat: 1450, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_100", label: "מצגת גדילה AI - 100 תמונות", exVat: 1900, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "led_lighting", label: "עמדת תאורת LED", exVat: 1750, category: "events", context: "תאורה דקורטיבית או הקרנת לוגו" },
  { id: "electronic_drummer", label: "מתופף אלקטרוני מקצועי", exVat: 1500, category: "events", context: "ליווי מוזיקלי חי לרחבת הריקודים" },
  { id: "single_effect", label: "אפקט בודד לאירוע", exVat: 1500, category: "events", context: "עשן כבד, זיקוקים קרים, בועות סבון או תותח קצף" },
  { id: "event_attraction_1", label: "אטרקציה בודדת", exVat: 1750, category: "events" },
  { id: "event_attraction_2", label: "2 אטרקציות (חבילה)", exVat: 3200, category: "events" },
  { id: "event_attraction_3", label: "3 אטרקציות (חבילה)", exVat: 4450, category: "events" },
  { id: "event_attraction_4", label: "4+ אטרקציות + מתנה", exVat: 5500, category: "events", context: "מצגת תמונות חינם" },

  // ─── צילום ───
  { id: "full_event_photo_8h", label: "צילום אירוע מלא 8 שעות", exVat: 12000, category: "photography", context: "מההכנות ועד שיא הלילה" },
  { id: "event_photo_hourly", label: "צילום אירוע לפי שעה", exVat: 1500, category: "photography", context: "כולל עריכה ומסירה דיגיטלית" },
  { id: "pre_wedding_photos", label: "צילומי זוגיות מקדימים", exVat: 2200, category: "photography", context: "סשן מקצועי לפני יום האירוע" },
  { id: "artistic_photo", label: "צילום אומנותי מיוחד", exVat: 3800, category: "photography", context: "סשן מורכב ומעובד לזוגות" },
  { id: "live_reels", label: "רילס בזמן אמת מהאירוע", exVat: 2800, category: "photography", context: "צילום ועריכת סרטונים קצרים במהלך האירוע" },

  // ─── שירותים מקוונים / AI ───
  { id: "express_delivery", label: "מסירה מהירה של תוצרים", exVat: 1400, category: "online", context: "עריכה מזורזת ואספקה תוך 48 שעות" },
  { id: "master_archive", label: "ארכיון מאסטר מוגן", exVat: 2800, category: "online", context: "גיבוי מאובטח ל-10 שנים" },
  { id: "ai_panoramas", label: "פנורמות רחבות ב-AI", exVat: 850, category: "online", context: "יצירת תמונות רחבות וייחודיות" },
  { id: "photo_retouch", label: "ריטוש תמונות מתקדם", exVat: 1200, category: "online", context: "ניקוי רקע ושיפור תאורה" },
  { id: "quick_summary_clip", label: "קליפ סיכום מהיר", exVat: 950, category: "online", context: "סרטון רגעי שיא מוכן לפרסום למחרת" },
  { id: "external_mix_master", label: "מיקס ומאסטרינג חיצוני", exVat: 1750, category: "online", context: "עיבוד מקצועי לכל הפורמטים" },
  { id: "ai_noise_basic", label: "ניקוי רעשים בסיסי", exVat: 350, category: "online", context: "להקלטות קצרות עם רעש קבוע" },
  { id: "ai_voice_restore", label: "שחזור קול מלא", exVat: 650, category: "online", context: "פרק או ראיון עד שעה - ניקוי + איזון" },
  { id: "ai_voice_enhance", label: "שיפור קול חכם", exVat: 450, category: "online", context: "הבהרה, נוכחות ועקביות לפודקאסט" },
  { id: "damaged_recording_rescue", label: "הצלת הקלטות פגומות", exVat: 250, category: "online", context: "שחזור ושיפור איכות לכל 5 דקות" },
  { id: "ai_photo_upgrade", label: "שדרוג תמונות ב-AI", exVat: 250, category: "online", context: "שיפור רזולוציה, צבע וחדות ל-10 תמונות" },
  { id: "volume_balance", label: "התאמת ווליום ואיזון דינמי", exVat: 250, category: "online", context: "איזון עוצמות קול עד שעת הקלטה" },
  { id: "reel_factory_single", label: "פרומו רילס בודד לספק", exVat: 950, category: "online", context: "חיתוך + כתוביות בסיסיות מחומר גולמי" },
  { id: "reel_factory_rave_24h", label: "רילס Rave ערוך תוך 24 שעות", exVat: 1400, category: "online", context: "ביט-סינק, אפקטים, צבע וסאונד מנורמל" },
  { id: "reel_factory_starter_monthly", label: "Content Hub בסיס לספקים", exVat: 2800, category: "online", context: "4 פרומואים + פוסטים שיווקיים בחודש" },
  { id: "reel_factory_pro_monthly", label: "Content Hub פרו לספקים", exVat: 4500, category: "online", context: "8 פרומואים + פוסטים + כיתובים לכל פלטפורמה" },

  // ─── שירותים מקצועיים לעסקים ───
  { id: "dj_voice_tag_single", label: "תג קולי בודד לדיג'יי", exVat: 350, category: "pro", context: "קריינות ממותגת עם אפקטי מועדון" },
  { id: "dj_voice_tag_pack_5", label: "חבילת 5 תגים קוליים", exVat: 1200, category: "pro", context: "חמישה תגים מותאמים עם אפקטים" },
  { id: "mashup_custom_planned", label: "מאשאפ מותאם (עד 3 ימי עסקים)", exVat: 1650, category: "pro", context: "שילוב שני שירים — עריכה ידנית, סבב תיקון אחד" },
  { id: "mashup_creative_plus", label: "שילוב יצירתי / דרוג+", exVat: 2200, category: "pro", context: "stems, משקל, מודולציה — הפקה מלאה באולפן" },
  { id: "mashup_ready_single", label: "מאשאפ מוכן לרכישה", exVat: 650, category: "pro", context: "גרסה ערוכה מהמאגר, נבדקה באירוע" },
  { id: "mashup_ready_pack_3", label: "חבילת 3 מאשאפים מוכנים", exVat: 1750, category: "pro", context: "שלושה שילובים מהמאגר" },
  { id: "mashup_ready_pack_5", label: "חבילת 5 מאשאפים מוכנים", exVat: 2750, category: "pro", context: "חמישה שילובים — עונת אירועים" },
  { id: "mashup_ready_pack_10", label: "חבילת 10 מאשאפים מוכנים", exVat: 5200, category: "pro", context: "מאגר אישי לדיג'יי" },
  { id: "mashup_custom_pack_3", label: "חבילת 3 מאשאפים מותאמים", exVat: 4500, category: "pro", context: "שלושה שילובים לפי בקשה" },
  { id: "mashup_fixer_express", label: "מאשאפ מזורז (לפי זמינות)", exVat: 2400, category: "pro", context: "לא מובטח — רק אם יש מקום ביומן" },
  { id: "gym_music_set", label: "סט מוזיקה לחדר כושר", exVat: 750, category: "pro", context: "פלייליסט מחובר בקצב לשיעור או אימון" },
  { id: "ambience_space_set", label: "פלייליסט לאווירת חלל", exVat: 850, category: "pro", context: "מוזיקת רקע לפי סוג עסק ושעות פעילות" },
  { id: "prebuilt_set_corporate", label: "סט מוזיקה מוכן לפי קטגוריה", exVat: 450, category: "pro", context: "מוזיקה ערוכה ומחוברת בקצב קבוע" },
  { id: "studio_in_box_consult", label: "אולפן בקופסה - ייעוץ + עשרה פרקים", exVat: 2500, category: "pro", context: "תכנון אקוסטי, מפרט ציוד ועריכה לעשרה פרקים" },
  { id: "bulk_podcast_episode", label: "פס ייצור - פרק ושלושה סרטונים קצרים", exVat: 950, category: "pro", context: "עריכה, עוצמת שמע אחידה, פתיח/סגיר וסרטונים לרשתות" },
  { id: "dry_hire_day", label: "השכרת ציוד - יום אחד", exVat: 450, category: "pro", context: "השכרת ציוד בלבד לפי פריט ויום" },
  { id: "system_tuning_ease", label: "תכנון הגברה ומדידות", exVat: 3500, category: "pro", context: "מודל פריסה ומדידות לאירוע מורכב" },
] as const;

export type PriceItemId = (typeof PRICING_CATALOG)[number]["id"];

const catalogById = new Map<string, PriceItem>(
  PRICING_CATALOG.map((item) => [item.id, item]),
);

/** מחיר לפי מזהה - זורק אם לא נמצא */
export function getPriceById(id: PriceItemId): PriceItem {
  const item = catalogById.get(id);
  if (!item) throw new Error(`Unknown price id: ${id}`);
  return item;
}

/** מחיר לפני מע״מ לפי מזהה */
export function getExVat(id: PriceItemId): number {
  return getPriceById(id).exVat;
}

/** סכום מע״מ בלבד */
export function vatAmount(exVat: number): number {
  return withVatLocal(exVat) - exVat;
}

/** שורת מחיר לוואטסאפ: "כרגע: 750 ₪ + מע״מ 135 ₪ = 885 ₪ סופי" */
export function formatPriceLine(exVat: number, label?: string): string {
  const vat = vatAmount(exVat);
  const total = withVatLocal(exVat);
  const base = label
    ? `${label}: ${formatNisLocal(exVat)}`
    : formatNisLocal(exVat);
  return `כרגע: ${base} + מע״מ ${formatNisLocal(vat)} = ${formatNisLocal(total)} סופי`;
}

/** תצוגת "מ-X ₪" כולל מע״מ */
export function formatFromPriceExVat(exVat: number): string {
  return `כרגע מ-${withVatLocal(exVat).toLocaleString("he-IL")} ₪`;
}

/** תצוגת "מ-X ₪" לפני מע״מ + כולל */
export function formatFromPriceDual(exVat: number): string {
  return `כרגע: מ-${exVat.toLocaleString("he-IL")} ₪ + מע״מ = ${withVatLocal(exVat).toLocaleString("he-IL")} ₪`;
}

export const CATALOG_VAT_RATE = VAT_RATE_LOCAL;
export { withVatLocal as catalogWithVat };
