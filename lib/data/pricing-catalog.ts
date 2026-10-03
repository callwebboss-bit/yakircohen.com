/**
 * מקור אמת יחיד לכל מחירי השירות (לפני מע״מ).
 * עדכון מחירים: ערכו כאן בלבד, והריצו `npm run audit:pricing`.
 *
 * CONTENT_REVIEW: overlay 2026-08-19 - רשימות ברכה מאושרות במחיר. תיקון
 * זיופים בברכה ובהקלטה מרחוק לא כלול. מ-3.10.2026 שתיהן 500 (היו 590). תוספת: studio_pitch_correction 300 ₪.
 *
 * CONTENT_REVIEW: overlay 2026-10-02 (docs/OWNER-DECISIONS-2026-10-02.md) -
 * הקלטת שיר היא בסיס ותוספות בלבד: song_recording 500 (הקלטה, מיקס ומאסטר,
 * סשן של שעה, התוצאה ביד בסוף הסשן, בלי תיקון זיופים). תוספות:
 * song_pitch_coaching 300, studio_session_clip_edited 750,
 * song_pre_session_interview 500 (משולב בקליפ, ולכן רק יחד איתו). החבילות
 * cover_song, song_package, studio_viral ו-studio_all_in נמחקו, ואין מסירה
 * מזורזת לשירים. קישורים ישנים ממופים ב-LEGACY_SONG_ALIASES (song-offer.ts).
 * single_production ו-full_production_clip נשארים. studio_session_clip (450,
 * גלם) נשאר לברכה ולאולפן הנייד.
 *
 * CONTENT_REVIEW: overlay 2026-10-03 (סבב רביעי) - משתתפים בשיר: אחד כלול,
 * וכל משתתף נוסף 99 (song_group_participant), עד 12. אין יותר 190 לזמר השני.
 * ראו SONG_PARTICIPANT_RULES. studio_extra_participant (190) נשאר לברכה,
 * לשעת חדר ולהקלטה מרחוק.
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

export type PriceScope = {
  duration?: string;
  includes?: string;
  excludes?: string;
  /** תשלום חד-פעמי / לכל פרק / חודשי */
  billingLabel?: string;
};

export type PriceTransparencyMode = "fixed" | "from" | "custom";

export type PriceTransparency = {
  included: readonly string[];
  excluded: readonly string[];
  addons: readonly PriceItemId[];
  scopeNote?: string;
  pricingMode: PriceTransparencyMode;
  glossaryTermSlugs?: readonly string[];
};

export type PriceWithEditing = {
  label: string;
  exVat: number;
};

export type PriceItem = {
  id: string;
  label: string;
  exVat: number;
  category: PriceCategory;
  context?: string;
  scope?: PriceScope;
  /** למי השירות מתאים - שורה קצרה ליד המחיר */
  suitedFor?: string;
  /** מחיר חלופי עם עריכה בסיסית */
  withEditing?: PriceWithEditing;
  /** מחיר התחלה - לא מחיר סופי קבוע */
  priceFrom?: boolean;
  /** תוספת שאפשר לבחור רק יחד עם תוספת אחרת (מזהה קטלוג) */
  requires?: string;
};

/**
 * תקרת הנחה (החלטת הבעלים 3.10.2026, סבב שני): "כרגע אין הנחה מעל 8%".
 * חלה על חבילות בקטלוג, קופונים, מבצעים ומחיר ייחוס מוצג. נאכף ב-
 * validateDiscountPolicy (lib/data/discount-policy.ts, רץ ב-audit:pricing)
 * ובאחוזים בפרוזה ב-audit:trust-claims. מחיר למשתתף נוסף (99 בשיר) אינו
 * הנחה באחוזים ולא נבדק כאן.
 */
export const MAX_DISCOUNT_RATE = 0.08;
export const MAX_DISCOUNT_PERCENT = Math.round(MAX_DISCOUNT_RATE * 100);

/** אורך הראיון לפני סשן השיר (החלטת הבעלים 3.10.2026, סבב שני) */
export const SONG_INTERVIEW_DURATION = "עד 10 דקות";

/** כל מחירי השירות - לפני מע״מ */
/* בלי ההערה `: readonly PriceItem[]` כאן במכוון. היא גברה על ה-as const שבסוף
   המערך, ולכן PriceItemId התרחב ל-string פשוט: מזהה מומצא לחלוטין עבר
   קומפילציה, ומחיקת פריט מהקטלוג לא ייצרה אף שגיאה אלא זריקה בזמן ריצה
   בתוך הפרירנדר. satisfies בסוף שומר על אותה בדיקת צורה בלי להרחיב. */
export const PRICING_CATALOG = [
  // ─── אולפן ───
  {
    id: "studio_half_hour",
    label: "חצי שעה באולפן",
    exVat: 750,
    category: "studio",
    context: "הקלטה קצרה / פודקאסט פיילוט",
    scope: { duration: "30 דקות", includes: "ליווי טכני במקום" },
    suitedFor: "פיילוט פודקאסט, קריינות קצרה, חדר בלי עריכה",
    withEditing: { label: "חצי שעה + עריכה בסיסית", exVat: 1100 },
  },
  {
    id: "studio_hour",
    label: "שעת אולפן גמישה",
    exVat: 1500,
    category: "studio",
    context: "60 דקות חדר - קריינות, דיבור או פרויקט בלי מיקס",
    scope: { duration: "60 דקות", includes: "הנדסת הקלטה", excludes: "עריכה" },
    suitedFor: "קריינות, דרשה ארוכה, שעת חדר בלי מיקס",
    withEditing: { label: "שעת אולפן + עריכה", exVat: 2000 },
  },
  {
    id: "blessing_recording",
    label: "ברכה / אמירה",
    exVat: 500,
    category: "studio",
    context: "עד חצי שעה באולפן או מרחוק, הנחיה, עריכה בסיסית וקובץ מוכן",
    scope: { duration: "עד חצי שעה", includes: "הנחיה ועריכה בסיסית" },
    suitedFor: "ברכת כלה, דרשה, אמירה לחתונה או בר/בת מצווה",
  },
  {
    id: "studio_remote",
    label: "הקלטה מרחוק",
    exVat: 500,
    category: "studio",
    context: "הקלטה מהטלפון בבית - ניקוי רעשים ומיקס. בלי תיקון זיופים.",
    scope: { includes: "ניקוי רעשים ומיקס" },
    suitedFor: "ברכה או אמירה בלי להגיע לאולפן",
  },
  {
    id: "song_recording",
    label: "הקלטת שיר באולפן",
    exVat: 500,
    category: "studio",
    context: "הקלטה, מיקס ומאסטר בסשן של שעה. השיר אצלכם בסוף הסשן. תיקון זיופים לא כלול.",
    scope: { duration: "סשן של שעה", includes: "הקלטה, מיקס ומאסטר", excludes: "תיקון זיופים" },
    suitedFor: "שיר במתנה, קאבר, חופה, בר/בת מצווה",
  },
  {
    id: "single_production",
    label: "הפקת סינגל מלא",
    exVat: 3500,
    category: "studio",
    context: "עד 6 שעות אולפן כולל עיבוד ומאסטר מסחרי",
    scope: { duration: "עד 6 שעות אולפן", includes: "עיבוד, מיקס ומאסטר מסחרי" },
    suitedFor: "זמרים שרוצים סינגל מוכן לסטרימינג",
  },
  { id: "full_production_clip", label: "הפקה מלאה וקליפ וידאו", exVat: 4500, category: "studio", context: "שיר מוגמר וקליפ וידאו לשיתוף. כולל כתיבה, עיבוד, מיקס ועריכת וידאו" },
  {
    id: "studio_session_clip",
    label: "צילום קליפ מהסשן באולפן",
    exVat: 450,
    category: "studio",
    context: "צילום ההקלטה בזמן אמת, בלי עריכה",
    scope: { includes: "צילום הסשן באולפן וקובץ גלם" },
    suitedFor: "ברכה או אולפן נייד, למי שרוצה את הצילום בלי עריכה",
  },
  {
    id: "studio_extra_participant",
    label: "משתתף נוסף",
    exVat: 190,
    category: "addons",
    context: "הקלטה נוספת וערבוב בסיסי",
    suitedFor: "דואט, הורה, או מקליט נוסף באותו סשן, בברכה או בשעת חדר. לא בשיר",
  },
  {
    id: "song_group_participant",
    label: "משתתף נוסף בשיר",
    exVat: 99,
    category: "addons",
    context: "לכל משתתף נוסף בשיר, מהשני והלאה. עד 12 משתתפים בשיר אחד.",
    suitedFor: "שיר משפחתי או קבוצתי",
  },
  {
    id: "studio_extra_revision",
    label: "סבב תיקונים נוסף",
    exVat: 580,
    category: "addons",
    context: "עריכה נוספת מלאה מעבר לסבב הכלול",
    suitedFor: "אחרי שהסבב הכלול במסלול כבר נוצל",
  },
  {
    id: "studio_pitch_correction",
    label: "תיקון זיופים",
    exVat: 300,
    category: "addons",
    context: "Pitch Correction לשיר או ברכה. לא קדימות בשיבוץ (express).",
    suitedFor: "ברכה או הקלטה מרחוק שרוצים גם תיקון זיופים",
  },
  {
    id: "song_pitch_coaching",
    label: "תיקון זיופים וטכנאי שמכוון ומנחה",
    exVat: 300,
    category: "addons",
    context: "טכנאי סאונד שמכוון ומנחה אתכם בזמן ההקלטה, ותיקון זיופים בשיר.",
    suitedFor: "תוספת להקלטת שיר באולפן",
  },
  {
    id: "studio_session_clip_edited",
    label: "קליפ ערוך מהסשן באולפן",
    exVat: 750,
    category: "addons",
    context: "צילום הסשן באולפן, ערוך לקליפ מוכן לשיתוף.",
    suitedFor: "תוספת להקלטת שיר באולפן",
  },
  {
    id: "song_pre_session_interview",
    label: "ראיון קצר במתחם הפודקאסט",
    exVat: 500,
    category: "addons",
    /* החלטת הבעלים 3.10.2026 (סבב שני): עד 10 דקות (היה "כ-5 דקות"). עדיין
       בלי מחיר רגיל, ולכן בלי מחיר מחוק ובלי "מבצע". */
    context: "עד 10 דקות במתחם הפודקאסט בחוץ לפני הסשן, על השיר או על החוגג/ת. עוזרים עם השאלות. הראיון משולב בקליפ הערוך.",
    scope: { duration: SONG_INTERVIEW_DURATION, includes: "ראיון במתחם הפודקאסט, משולב בקליפ הערוך" },
    suitedFor: "תוספת לקליפ הערוך מהסשן",
    requires: "studio_session_clip_edited",
  },

  // ─── פודקאסט ───
  { id: "podcast_pilot", label: "פודקאסט פיילוט אודיו", exVat: 950, category: "podcast", context: "הקלטה של עד שעה כולל עריכה, מיקס והפצה" },
  {
    id: "podcast_audio",
    label: "פודקאסט אודיו מוכן להפצה",
    exVat: 950,
    category: "podcast",
    context: "הקלטה עד שעה, עריכה, מיקס ומסירה לספוטיפיי",
    scope: { duration: "עד שעה", includes: "הקלטה באולפן, עריכה, מיקס, מסירה לספוטיפיי" },
    suitedFor: "פרק ראשון או סדרה - בלי לנהל הפצה לבד",
  },
  {
    id: "podcast_video",
    label: "פודקאסט וידאו",
    exVat: 1650,
    category: "podcast",
    context: "הקלטה רב-מצלמת באולפן, 3 מצלמות ותאורה",
    suitedFor: "פודקאסטים עם נוכחות ויזואלית ביוטיוב",
  },
  {
    id: "content_package",
    label: "חבילת תוכן מלאה",
    exVat: 2800,
    category: "podcast",
    context: "וידאו, 3 רילס עם כתוביות והעלאה לפלטפורמות",
    suitedFor: "מותגים שרוצים נוכחות רשתות חברתיות",
  },
  { id: "full_podcast_production", label: "הפקת פודקאסט מלאה", exVat: 2500, category: "podcast", context: "הקלטה באולפן, עריכה מלאה והפקה עד פרק מוכן" },
  /* החלטת הבעלים 3.10.2026 (סבב שני): אולפן נייד הוא פריט אחד. 2,500 לפני
     מע״מ = הגעה עם כל הציוד, התאורה והצוות. mobile_studio (5,000) נמחק.
     באירוע: צילום פודקאסט מתומחר כפודקאסט וידאו, הקלטת אודיו כפודקאסט אודיו,
     ועל זה ההגעה. ראו MOBILE_STUDIO_EVENT_SERVICES. המזהה נשאר כדי לא לשבור
     קישורי ?catalog= קיימים. */
  {
    id: "mobile_podcast_at_home",
    label: "אולפן נייד, הגעה אליכם",
    exVat: 2500,
    category: "podcast",
    context: "הגעה עם כל הציוד, התאורה והצוות, לבית, למשרד או לאירוע. בבית או במשרד פרק פודקאסט אודיו מוגמר כלול (הקלטה, עריכה ומסירה), וכל אדם נוסף הוא ערוץ נוסף.",
    scope: { includes: "הגעה עם כל הציוד, התאורה והצוות. בבית או במשרד: פרק פודקאסט אודיו מוגמר, הקלטה, עריכה ומסירה, לאדם אחד" },
    priceFrom: true,
  },
  /* החלטת הבעלים 3.10.2026, סבב שלישי: בבית או במשרד הקלטת האודיו כלולה
     ב-2,500. כל אדם נוסף הוא ערוץ נוסף, 99 + מע״מ, עד 12 אנשים בהקלטה.
     ראו MOBILE_STUDIO_CHANNEL_RULES. */
  {
    id: "mobile_extra_channel",
    label: "ערוץ הקלטה נוסף באולפן הנייד",
    exVat: 99,
    category: "podcast",
    context: "כל אדם נוסף בהקלטה באולפן הנייד הוא ערוץ נוסף. עד 12 אנשים בהקלטה.",
    scope: { includes: "מיקרופון וערוץ הקלטה לאדם נוסף" },
    suitedFor: "הקלטה בבית או במשרד עם יותר מאדם אחד",
  },
  { id: "podcast_editing_hour", label: "עריכת פודקאסט או סרטון קצר", exVat: 750, category: "podcast", context: "ניקוי רעשים, סנכרון וכתוביות" },
  /* עד 3.10.2026 התוספת הזו בטופס הפודקאסט נקראה דרך studio_remote, כי שניהם
     היו 590. הקלטה מרחוק ירדה ל-500, והעריכה המתקדמת לא השתנתה. */
  { id: "podcast_editing_advanced", label: "עריכה מתקדמת לפודקאסט", exVat: 590, category: "podcast", context: "לכל שעה שצולמה, פתיח וסגיר" },
  { id: "podcast_extra_participant", label: "משתתף נוסף בפודקאסט", exVat: 150, category: "podcast", context: "תוספת מיקרופון ועריכה מוגברת מעל 2 אנשים" },
  {
    id: "studio_self_service_hour",
    label: "אולפן שירות עצמי",
    exVat: 650,
    category: "podcast",
    context: "שעת הקלטה בלי עריכה, הלקוח לוקח קבצים גולמיים",
    withEditing: { label: "שירות עצמי + עריכה", exVat: 1100 },
  },

  // ─── נוספו 3.10.2026 אחרי audit:prose-price-backing ───
  // כל אלה הופיעו בפרוזה ובקוד בלי גיבוי בקטלוג, ולכן לא נכנסו
  // ל-JSON-LD ולא ל-llms.txt, ואף שער לא הגן עליהם מסחיפה.
  // במיזוג ל-feature/sales-fix (3.10.2026) מול OWNER-DECISIONS-2026-10-02.md:
  // song_extended_pack (1,800) ו-blessing_pair_combined (1,000) לא נכנסו, כי
  // הקלטת שיר היא בסיס ותוספות בלבד וברכה היא 500 + 190 למשתתף. הכרטיסייה
  // הועלתה מ-4,450 ל-4,554 (תקרת 8% מול 5 x academy_private_hour, ב-CATALOG_BUNDLES).
  // בהקלטת ההופעה ירד "במקום המחיר המלא" (אין "במקום" במבצעים).
  { id: "travel_north_south", label: "תוספת הגעה לצפון או דרום", exVat: 800, category: "addons", context: "מעבר לאזור המרכז" },
  { id: "travel_eilat_golan", label: "תוספת הגעה לאילת או לגולן", exVat: 1800, category: "addons", context: "אזורים רחוקים, בתיאום מראש" },
  { id: "ulpan_trial", label: "אולפן עברית, שיעור ניסיון", exVat: 500, category: "academy", context: "שיעור יחיד אחד על אחד" },
  { id: "ulpan_monthly", label: "אולפן עברית, מסלול חודשי", exVat: 3200, category: "academy", context: "שיעור שבועי אחד על אחד" },
  { id: "ulpan_annual", label: "אולפן עברית, מסלול שנתי", exVat: 11520, category: "academy", context: "36 שיעורים אחד על אחד" },
  { id: "academy_pro_session", label: "Pro Session, 90 דקות", exVat: 1280, category: "academy", context: "צלילה לעומק וניתוח ביצוע" },
  { id: "online_extra_minutes", label: "תיקון זיופים מעל 4 דקות", exVat: 100, category: "addons", context: "תוספת לשיר ארוך" },
  { id: "online_extra_channels", label: "מיקס מעל 16 ערוצים", exVat: 100, category: "addons", context: "תוספת לפרויקט רחב" },
  { id: "online_extra_revision", label: "סבב תיקונים נוסף באונליין", exVat: 100, category: "addons", context: "מעבר לסבב הכלול" },
  { id: "photo_colorization", label: "צביעת תמונת שחור לבן", exVat: 100, category: "addons", context: "לתמונה, שירות נפרד משדרוג AI" },
  { id: "photo_enhance_20", label: "שדרוג 20 תמונות ב-AI", exVat: 600, category: "online", context: "חבילת תמונות לשיפור" },
  { id: "social_single_video", label: "צילום ועריכת סרטון אחד", exVat: 1000, category: "online", context: "כולל קריאייטיב" },
  { id: "social_bank_4", label: "צילום ועריכת 4 סרטונים", exVat: 3000, category: "online", context: "בנק סרטונים לחודש או לקמפיין" },
  { id: "social_stories_bank", label: "עריכת בנק סטוריז, 20 יחידות", exVat: 1000, category: "online", context: "עריכה בלבד" },
  { id: "social_consult_30", label: "שיחת ייעוץ תוכן, עד 30 דקות", exVat: 700, category: "online", context: "ייעוץ ממוקד לתוכן ואסטרטגיה" },
  { id: "gift_box_usb", label: "מארז דיסק און קי ועיצוב", exVat: 199, category: "addons", context: "תוספת למחיר ההפקה" },
  { id: "gift_box_full", label: "מארז מלא: דיסק און קי, אוזניות וקופסה", exVat: 399, category: "addons", context: "תוספת למחיר ההפקה" },
  { id: "funny_ringtone_promo", label: "רינגטון מצחיק, מבצע", exVat: 299, category: "studio", context: "הקלטה, עיבוד וקובץ מוכן" },
  { id: "singer_live_recording_promo", label: "הקלטת ההופעה מהמיקסר, מבצע", exVat: 399, category: "addons", context: "מבצע הרגע האחרון באשף ההגברה" },
  { id: "bat_mitzvah_clip", label: "קליפ בת מצווה", exVat: 2590, category: "studio", context: "מחיר פתיחה, לפי משתתפים וצילומי חוץ", priceFrom: true },
  { id: "academy_focused_training", label: "הכשרה ממוקדת, 90 דקות", exVat: 1470, category: "academy", context: "DJ, הפקה או קריינות, אחד על אחד" },
  { id: "academy_master_monthly", label: "Master, מסלול חודשי", exVat: 3920, category: "academy", context: "ארבעה מפגשי שעה, קו ישיר ומשוב שבועי" },
  { id: "academy_pro_partnership", label: "Pro-Partnership, 6 חודשים", exVat: 21500, category: "academy", context: "24 מפגשים, ליווי רכש וזהות מוזיקלית" },
  { id: "academy_lesson_card_5", label: "כרטיסיית 5 שיעורים פרטיים", exVat: 4554, category: "academy", context: "חמישה שיעורים של שעה, אחד על אחד", priceFrom: true },
  /* החלטות 3.10.2026, סבב רביעי: הועלה מ-8,900 ל-9,108, תקרת 8% מול 10 x academy_private_hour (CATALOG_BUNDLES). */
  { id: "academy_dj_course_full", label: "קורס DJ פרטי מלא", exVat: 9108, category: "academy", context: "10 מפגשים כולל בניית סט אישי", priceFrom: true },
  { id: "vocal_fix_short", label: "תיקון זיופים, קטע קצר", exVat: 375, category: "online", context: "עד שתי דקות" },
  { id: "studio_prep_digital", label: "חוברת הכנה דיגיטלית", exVat: 149, category: "addons", context: "מדריך הכנה לפני הסשן" },
  { id: "photography_wedding_4h", label: "צילום אירוע, 4 שעות", exVat: 6000, category: "photography", context: "חבילת פתיחה, עריכה בסיסית כלולה", priceFrom: true },
  // ─── תוכן לעסקים (B2B) ───
  { id: "content_studio_pilot", label: "סושיאל דאמפ, פיילוט", exVat: 1650, category: "online", context: "שעה באולפן + 5 רילז/שורטס ערוכים" },
  { id: "content_studio_session", label: "סושיאל דאמפ, סשן מלא", exVat: 2800, category: "online", context: "2 שעות באולפן + 12 רילז עם כתוביות" },
  {
    id: "content_studio_retainer",
    label: "סושיאל דאמפ, ריטיינר חודשי",
    exVat: 4500,
    category: "online",
    context: "סשן חודשי + 8-12 רילז, תבניות מותג",
    scope: { billingLabel: "חודשי" },
    suitedFor: "עסקים עם צורך קבוע בתוכן חודשי",
  },
  { id: "on_site_half_day", label: "אולפן זמני בחברה, חצי יום", exVat: 6500, category: "online", context: "4 שעות, חדר ישיבות, עד 4 מרואים" },
  { id: "on_site_full_day", label: "אולפן זמני בחברה, יום מלא", exVat: 10000, category: "online", context: "8 שעות, עד 8 פרקים/סרטונים גולמיים" },
  {
    id: "on_site_retainer",
    label: "אולפן זמני בחברה, ריטיינר",
    exVat: 28000,
    category: "online",
    context: "2 ימי צילום + עריכה",
    scope: { billingLabel: "חודשי" },
  },
  { id: "corp_song_toast", label: "שיר לחברה, הרמת כוסית", exVat: 5000, category: "studio", context: "שיר הומוריסטי / אירוע חברה" },
  { id: "corp_song_retirement", label: "שיר פרישה + קליפ", exVat: 8500, category: "studio", context: "הפקה מלאה לפרישת מנהל" },
  { id: "corp_song_anthem", label: "הימנון חברה", exVat: 12000, category: "studio", context: "שיר וקליפ, מיתוג ארגוני" },
  { id: "audiobook_sample", label: "ספר שמע, פרק דוגמה", exVat: 990, category: "online", context: "15 דקות הקלטה + עריכה" },
  { id: "audiobook_hour", label: "ספר שמע, שעת הקלטה", exVat: 750, category: "online", context: "הקלטה + עריכה בסיסית לשעת חומר" },
  // קריינות עסקית. נוספו 3.10.2026: המחירים הופיעו בפרוזה בבלוג ובעמודי
  // השירות בלי גיבוי בקטלוג, ולכן לא נכנסו ל-JSON-LD, ל-llms.txt, ולא
  // היה שער שמגן עליהם מסחיפה.
  { id: "voiceover_ivr", label: "קריינות למרכזייה", exVat: 450, category: "online", context: "עד 3 הודעות קצרות, קובץ בפורמט שהמרכזייה מקבלת", suitedFor: "מענה טלפוני, הודעת המתנה, הודעת חגים" },
  { id: "voiceover_promo", label: "קריינות לסרטון תדמית", exVat: 750, category: "online", context: "עד 2 דקות, כולל בחירת טון והגהה", suitedFor: "סרטון תדמית, מנשר דיגיטלי, פרסומת קצרה" },
  { id: "audio_brand_starter", label: "מיתוג קולי, בסיס", exVat: 1500, category: "online", context: "ג'ינגל 15 שניות + 2 הודעות IVR" },
  { id: "audio_brand_full", label: "מיתוג קולי, מלא", exVat: 4500, category: "online", context: "לוגו קולי + IVR + מוזיקת המתנה + אפקטים" },
  { id: "audio_brand_premium", label: "מיתוג קולי, פרימיום", exVat: 8500, category: "online", context: "חבילה מלאה + שיבוט קול לעדכונים" },
  { id: "legacy_dig_basic", label: "המרת VHS/קלטת לדיגיטל", exVat: 350, category: "online", context: "קלטת אחת → קובץ דיגיטלי" },
  { id: "legacy_dig_ai", label: "המרה + שחזור AI", exVat: 650, category: "online", context: "דיגיטל + ניקוי סאונד/תמונה ב-AI" },

  // ─── שלב 4: סדנאות, AI, HR ───
  { id: "workshop_team_2h", label: "סדנה לצוות, 2 שעות", exVat: 2800, category: "academy", context: "עד 12 משתתפים, טיקטוק/תוכן/מול מצלמה" },
  { id: "workshop_full_day", label: "סדנה יום שלם", exVat: 6500, category: "academy", context: "יום מעשי באולפן או בחברה" },
  { id: "workshop_series_3", label: "סדרת 3 סדנאות", exVat: 7500, category: "academy", context: "3 מפגשים, אותו צוות" },
  {
    id: "academy_trial_lesson",
    label: "שיעור ניסיון באקדמיה",
    exVat: 500,
    category: "academy",
    context: "שיעור התנסות אחד - עברית / אולפן",
  },
  {
    id: "academy_private_hour",
    label: "שיעור פרטי 60 דקות",
    exVat: 990,
    category: "academy",
    context: "שיעור 1:1 באולפן או בזום",
  },
  { id: "transcribe_30min", label: "תמלול AI, חצי שעה", exVat: 180, category: "online", context: "טיוטה אוטומטית, בדיקה מהירה" },
  { id: "transcribe_hour", label: "תמלול + עריכה, שעה", exVat: 450, category: "online", context: "AI + עריכה אנושית, טקסט נקי" },
  { id: "transcribe_hour_srt", label: "תמלול + כתוביות SRT", exVat: 650, category: "online", context: "שעת אודיו/וידאו, קובץ כתוביות מוכן" },
  { id: "voice_clone_setup", label: "הקמת מודל קול", exVat: 2500, category: "online", context: "הקלטת דגימות + אימון מודל" },
  { id: "voice_clone_clip", label: "קlip ממודל קול, עד דקה", exVat: 450, category: "online", context: "טקסט חדש בקול שכבר הוקם" },
  { id: "voice_clone_ivr_pack", label: "5 עדכוני IVR ממודל קול", exVat: 1200, category: "online", context: "לאחר הקמת מודל" },
  { id: "employer_welcome", label: "סרטון ברוכים הבאים", exVat: 4500, category: "online", context: "הקלטה + עריכה, עד 3 דקות" },
  { id: "employer_onboard_day", label: "יום צילום onboarding", exVat: 9500, category: "online", context: "ראיונות, סיור וירטואלי, 5-8 סרטונים גולמיים" },
  {
    id: "employer_monthly",
    label: "ריטיינר תוכן HR",
    exVat: 18500,
    category: "online",
    context: "סשן חודשי + עריכה, סרטוני קליטה שוטפים",
    scope: { billingLabel: "חודשי" },
  },

  // ─── DJ ואירועים ───
  {
    id: "dj_premium",
    label: "תקליטן פרימיום מהצוות",
    exVat: 5000,
    category: "dj",
    context: "4 שעות תקלוט של דיג׳יי מנוסה",
    /* החלטת הבעלים ED-04: תקליטן מהצוות, 4 שעות, עד 300 מוזמנים */
    scope: { duration: "4 שעות תקלוט", includes: "תקליטן מהצוות" },
    suitedFor: "אירוע עד 300 מוזמנים",
  },
  {
    id: "dj_yakir_personal",
    label: "תקליטן יקיר כהן אישית",
    /* החלטת הבעלים 3.10.2026 (סבב שני): 9,800 הוא לפני מע״מ (11,564 כולל).
       עד אז 8,305, כי 9,800 נקרא כמחיר כולל מע״מ. */
    exVat: 9800,
    category: "dj",
    context: "5 שעות VIP עם יקיר על הקונסולה",
    scope: { duration: "5 שעות תקלוט", includes: "יקיר כהן על הקונסולה" },
    suitedFor: "חתונות VIP, אירועי חברה",
  },
  {
    id: "festival_all_in",
    label: "חבילת פסטיבל הכל כלול",
    exVat: 15000,
    category: "events",
    context: "DJ פרימיום, אולפן נייד, 3 אטרקציות ומצגת",
    scope: { duration: "5 שעות DJ", includes: "אולפן נייד + 3 אטרקציות" },
    suitedFor: "חתונות ובר/בת מצווה עם הכל כלול",
  },
  { id: "pre_event_production", label: "הפקה מקדימה ותיאום מוזיקלי", exVat: 980, category: "events", context: "תיאום מלא עם הדיג׳יי" },
  { id: "cinematic_slideshow", label: "מצגת תמונות קולנועית", exVat: 750, category: "events", context: "סיפור ויזואלי מרגש על מסכים באירוע" },
  { id: "growth_slideshow_30", label: "מצגת גדילה AI - 30 תמונות", exVat: 750, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_50", label: "מצגת גדילה AI - 50 תמונות", exVat: 1100, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_70", label: "מצגת גדילה AI - 70 תמונות", exVat: 1450, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "growth_slideshow_100", label: "מצגת גדילה AI - 100 תמונות", exVat: 1900, category: "events", context: "פתיחה + סגירה, שיפור AI, מוזיקה, Full HD" },
  { id: "led_lighting", label: "עמדת תאורת LED", exVat: 1750, category: "events", context: "תאורה דקורטיבית או הקרנת לוגו" },
  { id: "electronic_drummer", label: "מתופף אלקטרוני מקצועי", exVat: 1500, category: "events", context: "ליווי מוזיקלי חי לרחבת הריקודים" },
  /* הפעלה נוספת לזיקוקים קרים או קונפטי (act_2, act_3). המחיר נקבע ע״י
     הבעלים ב-8.9.2026 וישב עד עכשיו כמספר ב-events-booking.ts. WP4 */
  { id: "event_extra_activation", label: "הפעלה נוספת לאטרקציה", exVat: 1200, category: "events", context: "רגע שיא נוסף: מיכל או מנועים חדשים לכל הפעלה" },
  { id: "event_attraction_1", label: "אטרקציה בודדת", exVat: 1695, category: "events", context: "2,000 ₪ כולל מע״מ" },
  /* החלטת הבעלים 3.10.2026 (סבב שני): אין הנחה מעל 8%. החבילות היו 10%,
     15% ו-20% (3,051 / 4,322 / 5,424). עכשיו כל אחת היא N x event_attraction_1
     פחות 8%, מעוגל למעלה כדי לא לעבור את התקרה (CATALOG_BUNDLES). */
  { id: "event_attraction_2", label: "2 אטרקציות", exVat: 3119, category: "events", context: "חבילה: 8% פחות משתי אטרקציות בודדות" },
  { id: "event_attraction_3", label: "3 אטרקציות", exVat: 4679, category: "events", context: "חבילה: 8% פחות משלוש אטרקציות בודדות" },
  { id: "event_attraction_4", label: "4 אטרקציות ומעלה", exVat: 6238, category: "events", priceFrom: true, context: "מחיר פתיחה לארבע, 8% פחות מארבע בודדות, וקליפ היילייטס מתנה. מעבר לזה הצעה אישית" },
  // ─── הגברה לזמרים ───
  /* החלטת הבעלים 3.10.2026 (סבב שני): השכרת הגברה לאירוע 2,500 לפני מע״מ.
     עד אז 1,750 כתוב באשף האירועים, בלי מזהה. */
  {
    id: "event_sound_rental",
    label: "השכרת הגברה לאירוע",
    exVat: 2500,
    category: "events",
    context: "2 רמקולי RCF וסאב, הובלה, הקמה, כיוונון ופירוק. עד 250 אורחים",
    scope: { includes: "2 רמקולי RCF וסאב, הובלה, הקמה, כיוונון ופירוק" },
    suitedFor: "אירוע עד 250 אורחים",
  },
  { id: "singer_amp_basic", label: "הגברת זמר, בסיס מקצועי", exVat: 2800, category: "events", context: "2 מיקרופונים, זוג RCF, סאב 15, מיקסר, טכנאי", suitedFor: "סולו או דואט, עד 150 אורחים" },
  { id: "singer_amp_premium", label: "הגברת זמר, פרימיום", exVat: 5800, category: "events", context: "מערכת מורחבת עם מוניטורים ותאורה" },
  { id: "singer_amp_vip", label: "הגברת זמר, VIP", exVat: 7800, category: "events", context: "מערכת מלאה לאירוע גדול" },
  { id: "singer_extra_mic", label: "מיקרופון נוסף", exVat: 150, category: "addons" },
  { id: "singer_extra_monitor", label: "מוניטור אישי נוסף", exVat: 200, category: "addons" },
  { id: "singer_remote_mix", label: "שליטה מרחוק על המיקס", exVat: 300, category: "addons", context: "אפליקציה" },
  { id: "singer_live_recording", label: "הקלטת ההופעה מהמיקסר", exVat: 500, category: "addons" },
  { id: "singer_extra_hour", label: "שעת הגברה נוספת", exVat: 300, category: "addons" },

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
  { id: "damaged_recording_rescue", label: "הצלת הקלטות פגומות", exVat: 250, category: "online", context: "שחזור ושיפור איכות לכל 5 דקות", priceFrom: true },
  { id: "ai_photo_upgrade", label: "שדרוג תמונות ב-AI", exVat: 250, category: "online", context: "שיפור רזולוציה, צבע וחדות ל-10 תמונות" },
  { id: "volume_balance", label: "התאמת ווליום ואיזון דינמי", exVat: 250, category: "online", context: "איזון עוצמות קול עד שעת הקלטה" },
  { id: "reel_factory_single", label: "פרומו רילס בודד לספק", exVat: 950, category: "online", context: "חיתוך + כתוביות בסיסיות מחומר גולמי" },
  { id: "reel_factory_rave_24h", label: "רילס Rave ערוך תוך 24 שעות", exVat: 1400, category: "online", context: "ביט-סינק, אפקטים, צבע וסאונד מנורמל" },
  {
    id: "reel_factory_starter_monthly",
    label: "Content Hub בסיס לספקים",
    exVat: 2800,
    category: "online",
    context: "4 פרומואים + פוסטים שיווקיים בחודש",
    scope: { billingLabel: "חודשי" },
  },
  {
    id: "reel_factory_pro_monthly",
    label: "Content Hub פרו לספקים",
    exVat: 4500,
    category: "online",
    context: "8 פרומואים + פוסטים + כיתובים לכל פלטפורמה",
    scope: { billingLabel: "חודשי" },
  },
  { id: "volume_balance_full", label: "איזון ווליומין", exVat: 500, category: "online", context: "איזון עוצמות קול לקטע עד 5 דקות" },
  { id: "noise_removal_segment", label: "ניקוי רעשים", exVat: 500, category: "online", context: "הסרת רעשי רקע לקטע עד 5 דקות" },
  { id: "eq_freq_fix", label: "תיקון תדרים ו-EQ", exVat: 500, category: "online", context: "שיפור איכות סאונד ותדרים לקטע עד 5 דקות" },

  // ─── שירותים מקצועיים לעסקים ───
  { id: "dj_voice_tag_single", label: "תג קולי בודד לדיג'יי", exVat: 350, category: "pro", context: "קריינות ממותגת עם אפקטי מועדון" },
  /* החבילות כאן ובמאשאפים: N x מחיר בודד פחות 8% (החלטת הבעלים 3.10.2026,
     סבב שני). היו 31% (תגים), 10%, 15%, 20% ו-9% (מאשאפים). */
  { id: "dj_voice_tag_pack_5", label: "חבילת 5 תגים קוליים", exVat: 1610, category: "pro", context: "חמישה תגים מותאמים עם אפקטים" },
  { id: "mashup_custom_planned", label: "מאשאפ מותאם (עד 3 ימי עסקים)", exVat: 1650, category: "pro", context: "שילוב שני שירים - עריכה ידנית, סבב תיקון אחד" },
  { id: "mashup_creative_plus", label: "שילוב יצירתי / דרוג+", exVat: 2200, category: "pro", context: "stems, משקל, מודולציה - הפקה מלאה באולפן" },
  { id: "mashup_ready_single", label: "מאשאפ מוכן לרכישה", exVat: 650, category: "pro", context: "גרסה ערוכה מהמאגר, נבדקה באירוע" },
  { id: "mashup_ready_pack_3", label: "חבילת 3 מאשאפים מוכנים", exVat: 1794, category: "pro", context: "שלושה שילובים מהמאגר" },
  { id: "mashup_ready_pack_5", label: "חבילת 5 מאשאפים מוכנים", exVat: 2990, category: "pro", context: "חמישה שילובים - עונת אירועים" },
  { id: "mashup_ready_pack_10", label: "חבילת 10 מאשאפים מוכנים", exVat: 5980, category: "pro", context: "מאגר אישי לדיג'יי" },
  { id: "mashup_custom_pack_3", label: "חבילת 3 מאשאפים מותאמים", exVat: 4554, category: "pro", context: "שלושה שילובים לפי בקשה" },
  { id: "mashup_fixer_express", label: "מאשאפ מזורז (לפי זמינות)", exVat: 2400, category: "pro", context: "לא מובטח - רק אם יש מקום ביומן" },
  { id: "gym_music_set", label: "סט מוזיקה לחדר כושר", exVat: 750, category: "pro", context: "פלייליסט מחובר בקצב לשיעור או אימון" },
  { id: "ambience_space_set", label: "פלייליסט לאווירת חלל", exVat: 850, category: "pro", context: "מוזיקת רקע לפי סוג עסק ושעות פעילות" },
  { id: "prebuilt_set_corporate", label: "סט מוזיקה מוכן לפי קטגוריה", exVat: 450, category: "pro", context: "מוזיקה ערוכה ומחוברת בקצב קבוע" },
  { id: "studio_in_box_consult", label: "אולפן בקופסה - ייעוץ + עשרה פרקים", exVat: 2500, category: "pro", context: "תכנון אקוסטי, מפרט ציוד ועריכה לעשרה פרקים" },
  {
    id: "bulk_podcast_episode",
    label: "פס ייצור - פרק ושלושה סרטונים קצרים",
    exVat: 950,
    category: "pro",
    context: "עריכה, עוצמת שמע אחידה, פתיח/סגיר וסרטונים לרשתות",
    scope: { billingLabel: "לכל פרק" },
  },
  { id: "corp_podcast_pilot", label: "פיילוט פודקאסט ארגוני", exVat: 6500, category: "pro", context: "2 פרקים + אסטרטגיה + setup ספוטיפיי + מיתוג שמע" },
  {
    id: "corp_podcast_retainer",
    label: "ריטיינר פודקאסט ארגוני",
    exVat: 4800,
    category: "pro",
    context: "2 פרקים/חודש + רילס + הפצה + חשבונית מס",
    scope: { billingLabel: "חודשי" },
    suitedFor: "ארגונים עם ערוץ פודקאסט שוטף",
  },
  {
    id: "dry_hire_day",
    label: "השכרת ציוד - יום אחד",
    exVat: 450,
    category: "pro",
    context: "השכרת ציוד בלבד לפי פריט ויום",
    scope: { billingLabel: "ליום" },
    priceFrom: true,
  },
  { id: "system_tuning_ease", label: "תכנון הגברה ומדידות", exVat: 3500, category: "pro", context: "מודל פריסה ומדידות לאירוע מורכב" },
] as const satisfies readonly PriceItem[];

export type PriceItemId = (typeof PRICING_CATALOG)[number]["id"];

/** פלייבק בהקלטת שיר (עובדה שהבעלים אישר, 3.10.2026 סבב שני) */
export const SONG_PLAYBACK_HELP = "אין לכם פלייבק? נעזור לכם להשיג";

/**
 * חבילות שהן N יחידות של פריט בודד. המחיר שלהן חייב להיות לפחות
 * N x מחיר בודד x (1 - MAX_DISCOUNT_RATE). שורה חדשה כאן נבדקת אוטומטית.
 */
export const CATALOG_BUNDLES = [
  { bundleId: "event_attraction_2", singleId: "event_attraction_1", count: 2 },
  { bundleId: "event_attraction_3", singleId: "event_attraction_1", count: 3 },
  { bundleId: "event_attraction_4", singleId: "event_attraction_1", count: 4 },
  { bundleId: "mashup_ready_pack_3", singleId: "mashup_ready_single", count: 3 },
  { bundleId: "mashup_ready_pack_5", singleId: "mashup_ready_single", count: 5 },
  { bundleId: "mashup_ready_pack_10", singleId: "mashup_ready_single", count: 10 },
  { bundleId: "mashup_custom_pack_3", singleId: "mashup_custom_planned", count: 3 },
  { bundleId: "dj_voice_tag_pack_5", singleId: "dj_voice_tag_single", count: 5 },
  { bundleId: "academy_lesson_card_5", singleId: "academy_private_hour", count: 5 },
  { bundleId: "academy_dj_course_full", singleId: "academy_private_hour", count: 10 },
] as const satisfies readonly { bundleId: PriceItemId; singleId: PriceItemId; count: number }[];

export type CatalogBundle = (typeof CATALOG_BUNDLES)[number];

/** שיעור ההנחה של חבילה מול קנייה בנפרד, מהקטלוג */
export function catalogBundleDiscountRate(bundle: CatalogBundle): number {
  const separate = getExVat(bundle.singleId) * bundle.count;
  return (separate - getExVat(bundle.bundleId)) / separate;
}

/** אחוז הנחת חבילת האטרקציות, לתצוגה ("הנחה 8%"). מעוגל, ולכן לעולם לא מעל התקרה. */
export function attractionBundleDiscountPercent(): number {
  const rates = CATALOG_BUNDLES.filter((b) => b.singleId === "event_attraction_1").map(
    catalogBundleDiscountRate,
  );
  return Math.round(Math.max(...rates) * 100);
}

/** מה כלול ב-2,500 של האולפן הנייד (החלטת הבעלים 3.10.2026, סבב שני) */
export const MOBILE_STUDIO_ARRIVAL_COPY = "הגעה עם כל הציוד, התאורה והצוות";

/**
 * החלטות 3.10.2026, סבב רביעי: באולפן הנייד בבית או במשרד, פרק פודקאסט אודיו
 * מוגמר כלול ב-2,500, כולל הקלטה, עריכה ומסירה. ערוץ לכל אדם נוסף נשאר 99 עד 12.
 */
export const MOBILE_STUDIO_EPISODE_INCLUDED_COPY =
  "פרק פודקאסט אודיו מוגמר כלול במחיר ההגעה: הקלטה, עריכה ומסירה";

/**
 * אולפן נייד באירוע (החלטת הבעלים 3.10.2026, סבב שני): צילום פודקאסט
 * מתומחר כפודקאסט וידאו, הקלטת אודיו כפודקאסט אודיו, ועל כל אחד מהם
 * ההגעה (mobile_podcast_at_home). המחשבון ותוספות האירוע קוראים מכאן.
 */
export const MOBILE_STUDIO_EVENT_SERVICES = {
  arrivalId: "mobile_podcast_at_home",
  videoId: "podcast_video",
  audioId: "podcast_audio",
} as const satisfies {
  arrivalId: PriceItemId;
  videoId: PriceItemId;
  audioId: PriceItemId;
};

/** אולפן נייד באירוע, לפני מע״מ: השירות עצמו ועליו ההגעה */
export function mobileStudioEventExVat(kind: "video" | "audio"): number {
  const serviceId =
    kind === "video" ? MOBILE_STUDIO_EVENT_SERVICES.videoId : MOBILE_STUDIO_EVENT_SERVICES.audioId;
  return getExVat(serviceId) + getExVat(MOBILE_STUDIO_EVENT_SERVICES.arrivalId);
}

/**
 * אולפן נייד בבית או במשרד (החלטת הבעלים 3.10.2026, סבב שלישי): ההגעה
 * (mobile_podcast_at_home) כוללת פרק פודקאסט אודיו מוגמר לאדם אחד (סבב רביעי). כל אדם נוסף הוא ערוץ
 * נוסף (mobile_extra_channel, 99) ועד 12 אנשים בהקלטה. החישוב
 * ב-mobileChannelsSurchargeExVat (lib/data/mobile-studio-booking.ts).
 */
export const MOBILE_STUDIO_CHANNEL_RULES = {
  included: 1,
  max: 12,
  arrivalId: "mobile_podcast_at_home",
  channelId: "mobile_extra_channel",
} as const satisfies {
  included: number;
  max: number;
  arrivalId: PriceItemId;
  channelId: PriceItemId;
};

/**
 * משתתפים בהקלטת שיר (החלטות 3.10.2026, סבב רביעי): זמר אחד כלול בבסיס,
 * וכל משתתף נוסף song_group_participant (99), עד 12 בשיר אחד. 4 זמרים:
 * 500 + 3 × 99 = 797 לפני מע״מ.
 * החישוב ב-songParticipantsSurchargeExVat (lib/data/song-offer-quote.ts).
 */
export const SONG_PARTICIPANT_RULES = {
  included: 1,
  max: 12,
  extraId: "song_group_participant",
} as const satisfies {
  included: number;
  max: number;
  extraId: PriceItemId;
};

/** תוספות מוצעות לשירות בסיסי במחירון */
export const PRICING_ADDON_LINKS: Partial<
  Record<PriceItemId, readonly PriceItemId[]>
> = {
  podcast_pilot: ["podcast_extra_participant", "podcast_editing_hour", "quick_summary_clip"],
  podcast_audio: ["podcast_extra_participant", "podcast_editing_hour", "content_studio_pilot"],
  podcast_video: ["podcast_extra_participant", "quick_summary_clip", "transcribe_hour_srt"],
  content_package: ["transcribe_hour_srt", "express_delivery"],
  mobile_podcast_at_home: ["mobile_extra_channel"],
  studio_half_hour: ["podcast_editing_hour"],
  blessing_recording: ["studio_pitch_correction", "studio_extra_revision", "studio_extra_participant", "studio_session_clip"],
  studio_remote: ["studio_pitch_correction", "studio_extra_revision", "studio_session_clip"],
  /* סדר התוספות כאן הוא הסדר בטופס ההצעה (lib/data/song-offer.ts) */
  song_recording: ["song_pitch_coaching", "studio_session_clip_edited", "song_pre_session_interview"],
  event_attraction_1: ["cinematic_slideshow", "led_lighting"],
  event_attraction_2: ["cinematic_slideshow", "pre_event_production"],
  event_attraction_3: ["cinematic_slideshow", "led_lighting"],
  event_attraction_4: ["cinematic_slideshow", "pre_event_production", "led_lighting"],
  full_production_clip: ["express_delivery", "photo_retouch"],
  single_production: ["express_delivery", "external_mix_master", "studio_session_clip"],
};

type PriceTransparencyDraft = {
  included?: readonly string[];
  excluded?: readonly string[];
  addons?: readonly PriceItemId[];
  scopeNote?: string;
  pricingMode?: PriceTransparencyMode;
  glossaryTermSlugs?: readonly string[];
};

const ADDON_LABEL_TOKEN = "__ADDON_LABEL__";

const PRICE_TRANSPARENCY_BY_CATEGORY: Partial<
  Record<PriceCategory, PriceTransparencyDraft>
> = {
  studio: {
    included: ["זמן אולפן לפי המסלול", "הקלטה והנחיה מקצועית"],
    excluded: ["קליפ וידאו", "כתיבת מילים או לחן", "נגני אולפן או סשן נוסף"],
  },
  podcast: {
    included: ["הקלטה באולפן לפי המסלול", "טיפול בסיסי בסאונד לפי החבילה"],
    excluded: ["נסיעה ללוקיישן", "סרטונים קצרים נוספים", "כתמלול או כתוביות מעבר למה שמצוין"],
  },
  events: {
    /* WP6: היה "השירות או האטרקציה שבכרטיס", טקסט תבנית שהוצג ללקוח כמו שהוא */
    included: ["הציוד והמפעיל לפי מה שנבחר", "הקמה ותפעול בסיסיים לפי הסיכום"],
    excluded: ["נסיעה חריגה", "שעות נוספות", "ציוד/אפקטים שלא נבחרו"],
  },
  dj: {
    included: ["תקלוט לפי המסלול", "פגישת תיאום בסיסית"],
    excluded: ["אפקטים", "שעות נוספות", "לוגיסטיקה חריגה או גיבוי מורחב"],
  },
  photography: {
    included: ["צילום לפי היקף המסלול", "עריכה בסיסית ומסירה דיגיטלית"],
    excluded: ["אלבומים מודפסים", "שעות נוספות", "רחפן או צוות נוסף"],
  },
  online: {
    included: ["עיבוד דיגיטלי לפי המסלול", "קובץ מסירה דיגיטלי"],
    excluded: ["איסוף פיזי", "עבודת עומק מעבר להיקף המצוין", "מסירה מזורזת אם לא צוינה"],
  },
  academy: {
    included: ["שיעור או סדנה לפי ההיקף", "ליווי מקצועי בזמן המפגש"],
    excluded: ["חבילות המשך", "ציוד אישי לבית", "שעות נוספות מעבר למסלול"],
  },
  pro: {
    included: ["השירות המקצועי המוגדר במסלול", "מסירה דיגיטלית לפי הסיכום"],
    excluded: ["תוספות דחופות", "רישוי צד ג׳", "עבודת המשך מעבר למסלול"],
  },
  addons: {
    /* היה "התוספת שבכרטיס", טקסט תבנית. getPriceTransparencyById שם כאן את
       שם התוספת עצמה (ראו ADDON_LABEL_TOKEN). WP6 */
    included: [ADDON_LABEL_TOKEN],
    excluded: ["מסלול בסיס שלא נרכש"],
  },
};

const PRICE_TRANSPARENCY_OVERRIDES: Partial<
  Record<PriceItemId, PriceTransparencyDraft>
> = {
  studio_half_hour: {
    included: ["30 דקות אולפן", "ליווי טכני במקום", "זמן חדר נקי בלבד"],
    excluded: ["עריכה", "תיקון זיופים", "מיקס ומאסטר", "קליפ וידאו"],
  },
  studio_hour: {
    included: ["60 דקות אולפן", "הנדסת הקלטה", "זמן חדר נקי בלבד"],
    excluded: ["עריכה", "תיקון זיופים", "מיקס ומאסטר מלאים", "קליפ או צילום"],
  },
  blessing_recording: {
    included: [
      "עד חצי שעה באולפן או מרחוק",
      "הנחיה אישית רגועה (גם למי שמעולם לא דיבר מול מיקרופון)",
      "הקלטה נקייה עם מיקרופונים מקצועיים",
      "עריכת סאונד בסיסית (ניקוי רעשים, איזון ווליום)",
      "תיקון קל של טעויות דיבור",
      "קובץ MP3 + WAV מוכן",
      "שליחה בוואטסאפ + מייל",
      "אפשרות לגיבוי בשרתים שלנו או מחיקה מיידית",
      "יחס אישי ודיסקרטיות מלאה",
    ],
    excluded: [
      "כתיבת טקסט",
      "מוזיקה ברקע",
      "קליפ",
      "תיקון זיופים",
      "תיקונים נוספים מעבר לסבב אחד",
    ],
    glossaryTermSlugs: ["wav", "mp3"],
  },
  studio_remote: {
    included: [
      "הקלטה מהטלפון בבית",
      "ניקוי רעשים",
      "מיקס",
      "קובץ מוכן",
    ],
    excluded: [
      "הגעה לאולפן",
      "תיקון זיופים",
      "קליפ וידאו",
      "שעת חדר",
    ],
    glossaryTermSlugs: ["mixing", "pitch-correction"],
  },
  song_recording: {
    /* "הקלטה, מיקס ומאסטר" מגיע מ-scope.includes ומופיע ראשון ברשימה */
    included: ["סשן של שעה באולפן במודיעין", "השיר המוכן אצלכם בסוף הסשן", SONG_PLAYBACK_HELP],
    excluded: [
      "תיקון זיופים",
      "קליפ וידאו",
      "כתיבת מילים או לחן",
      "עיבוד מוזיקלי חדש",
    ],
    /* אותו מונחון שהיה לכרטיס "שיר מוכן" שירד (cover_song), כדי שהקישורים
       למילון לא ירדו עם החבילות (seo-diff 3.10.2026). מוצג במחירון, ב-/packages
       ומתחת לטופס השיר (SongOfferSection showGlossary). */
    glossaryTermSlugs: ["mixing", "mastering", "pitch-correction", "autotune", "wav", "mp3"],
  },
  song_pitch_coaching: {
    included: ["טכנאי סאונד שמכוון ומנחה בזמן ההקלטה", "תיקון זיופים בשיר"],
    excluded: ["הקלטת השיר עצמה (מסלול הבסיס)", "סבב תיקונים נוסף"],
    glossaryTermSlugs: ["pitch-correction"],
  },
  studio_session_clip_edited: {
    included: ["צילום הסשן באולפן", "עריכה לקליפ מוכן לשיתוף"],
    excluded: ["צילום חוץ", "יום צילום נפרד"],
  },
  song_pre_session_interview: {
    included: [
      `ראיון של ${SONG_INTERVIEW_DURATION} במתחם הפודקאסט בחוץ, לפני הסשן`,
      "עזרה בהכנת השאלות",
      "הראיון משולב בקליפ הערוך",
    ],
    excluded: ["הקליפ הערוך עצמו (תוספת נפרדת, חובה עם הראיון)", "פרק פודקאסט מלא"],
  },
  /* מ-bat-mitzvah-gifts-page.ts (FAQ "מה כולל קליפ בת מצווה?") */
  bat_mitzvah_clip: {
    included: ["שאלון סיפור אישי וכתיבת מילים", "הקלטה באולפן וצילום", "שילוב תמונות ילדות וסרטונים מהבית", "עריכה ומיקס עד קובץ מוכן להקרנה ולרשתות"],
    excluded: ["צילומי חוץ (לפי היקף)", "משתתפים נוספים (לפי מספר)"],
  },
  studio_session_clip: {
    included: ["צילום הסשן באולפן", "קובץ גלם"],
    excluded: ["עריכה", "קליפ מוכן לרשתות", "זוויות נוספות אם לא סוכמו"],
  },
  studio_extra_participant: {
    included: ["הקלטה נוספת", "ערבוב בסיסי"],
    excluded: ["מסלול בסיס", "קליפ", "סבב תיקונים נוסף"],
  },
  song_group_participant: {
    included: ["הקלטת משתתף נוסף באותו סשן", "שילוב בשיר"],
    excluded: ["הקלטת השיר עצמה (מסלול הבסיס)"],
  },
  studio_extra_revision: {
    included: ["עריכה נוספת מלאה"],
    excluded: ["הקלטה חדשה", "שדרוג מסלול"],
  },
  studio_pitch_correction: {
    included: ["תיקון זיופים ידני לשיר או ברכה", "שמירה על קול טבעי (לא Auto-Tune רובוטי)"],
    excluded: ["קדימות בשיבוץ", "סבב תיקונים נוסף", "מיקס ומאסטר אם לא נרכשו במסלול"],
    glossaryTermSlugs: ["pitch-correction", "autotune"],
  },
  single_production: {
    included: ["עד 6 שעות אולפן", "עיבוד", "מיקס", "מאסטר"],
    excluded: ["קליפ וידאו", "קמפיין הפצה", "נגנים או שינויים חריגים שלא תומחרו"],
  },
  /* S02: בלי הדריסה הזו הכרטיס ירש מהקטגוריה "לא כולל קליפ וידאו" ו"כתיבת
     מילים או לחן", בדיוק מה שהמוצר כן כולל. התיאור תואם ל-services.ts. */
  full_production_clip: {
    included: ["כתיבת השיר", "עיבוד", "מיקס ומאסטר", "צילום ועריכת קליפ וידאו לשיתוף"],
    excluded: ["יום צילום נוסף או צילום חוץ שלא סוכמו", "נגני אולפן שלא תומחרו", "קמפיין הפצה"],
  },
  /* WP6: שירי החברה ירשו מקטגוריית האולפן "לא כולל קליפ וידאו" ו"כתיבת מילים
     או לחן", בזמן שהם נמכרים ככתיבה (ושיר הפרישה וההימנון גם כקליפ) */
  corp_song_toast: {
    included: ["כתיבת שיר הומוריסטי לאירוע", "הקלטה, מיקס ומאסטר"],
    excluded: ["קליפ וידאו", "הופעה חיה באירוע"],
  },
  corp_song_retirement: {
    included: ["כתיבת השיר", "הקלטה, מיקס ומאסטר", "קליפ לשיר"],
    excluded: ["יום צילום נוסף שלא סוכם", "הופעה חיה באירוע"],
  },
  corp_song_anthem: {
    included: ["כתיבת השיר", "הקלטה, מיקס ומאסטר", "קליפ למיתוג"],
    excluded: ["יום צילום נוסף שלא סוכם", "קמפיין הפצה"],
  },
  podcast_audio: {
    included: ["הקלטה עד שעה באולפן", "עריכה ומיקס", "מסירה לספוטיפיי"],
    excluded: ["וידאו", "משתתפים נוספים מעבר לבסיס", "כתוביות SRT"],
  },
  podcast_video: {
    included: ["הקלטה רב-מצלמת", "3 מצלמות", "תאורה באולפן"],
    excluded: ["רילס נוספים", "תמלול/כתוביות מלאים", "נסיעה ללוקיישן"],
  },
  content_package: {
    included: ["וידאו", "3 רילס עם כתוביות", "העלאה לפלטפורמות"],
    excluded: ["ימי צילום נוספים", "ניהול חודשי שוטף", "מסירה מזורזת אם לא נרכשה"],
  },
  mobile_podcast_at_home: {
    included: [MOBILE_STUDIO_ARRIVAL_COPY, "בבית או במשרד: הקלטת אודיו לאדם אחד"],
    excluded: ["תוספת אזור/נסיעה", "כל אדם נוסף: ערוץ הקלטה נוסף, עד 12", "וידאו אם לא נרכש", "שעות חריגות"],
    scopeNote: "מחיר התחלה. המחיר הסופי תלוי במרחק, בהיקף ההקמה ובפורמט.",
    pricingMode: "from",
  },
  mobile_extra_channel: {
    included: ["מיקרופון וערוץ הקלטה לאדם נוסף", "שילוב בהקלטה באותו מפגש"],
    excluded: ["ההגעה עצמה (אולפן נייד)", "יותר מ-12 אנשים בהקלטה אחת"],
  },
  dj_premium: {
    included: ["DJ מנוסה", "עד 4 שעות תקלוט"],
    excluded: ["אפקטים", "שעה נוספת", "הגברה חריגה או ספקי משנה"],
  },
  dj_yakir_personal: {
    included: ["DJ יקיר כהן", "עד 5 שעות", "ליווי VIP"],
    excluded: ["אפקטים", "שעות נוספות", "לוגיסטיקה מיוחדת או נסיעה חריגה"],
  },
  event_attraction_1: {
    included: ["אטרקציה אחת", "הפעלה אחת", "תפעול בסיסי"],
    excluded: ["הפעלה שנייה/שלישית", "אטרקציה נוספת", "ציוד הגברה נפרד"],
  },
  event_attraction_2: {
    included: ["2 אטרקציות", "תפעול בסיסי לפי הסיכום"],
    excluded: ["הפעלות נוספות", "הגברה", "נסיעה חריגה או אפקטים נוספים"],
  },
  event_attraction_3: {
    included: ["3 אטרקציות", "תפעול בסיסי לפי הסיכום"],
    excluded: ["אטרקציה רביעית", "הפעלות נוספות", "ציוד משלים שלא נבחר"],
  },
  event_attraction_4: {
    included: ["4 אטרקציות ומעלה", "קליפ היילייטס 60 שניות במתנה", "מחיר פתיחה, הסופי נסגר בשיחה"],
    excluded: ["הפעלות נוספות מעבר לסיכום", "הגברה", "נסיעה חריגה או ציוד נוסף"],
  },
  full_event_photo_8h: {
    excluded: ["שעות נוספות", "רחפן", "אלבומים מודפסים או מסירה אקספרס"],
  },
  event_photo_hourly: {
    excluded: ["עריכת עומק מעבר למסלול", "שעות נוספות", "אלבומים מודפסים"],
    scopeNote: "המחיר תלוי במספר השעות הסופי.",
  },
  ai_voice_restore: {
    excluded: ["שחזור קבצים מרובים", "מסירה מזורזת", "עבודת מאסטרינג מלאה"],
    scopeNote: "המחיר משתנה לפי מצב החומר הגולמי.",
    pricingMode: "from",
  },
  ai_voice_enhance: {
    excluded: ["תיקון זיופים", "שחזור עמוק", "מסירה מזורזת אם לא סוכמה"],
    scopeNote: "המחיר משתנה לפי אורך ואיכות הקובץ.",
    pricingMode: "from",
  },
  damaged_recording_rescue: {
    excluded: ["קבצים ארוכים מעבר ל-5 דקות", "מסירה דחופה", "שחזור וידאו/תמונה"],
    scopeNote: "מחיר התחלה לכל 5 דקות. חומר קשה במיוחד מתומחר בנפרד.",
    pricingMode: "from",
  },
  noise_removal_segment: {
    included: ["ניקוי רעשי רקע לקטע עד 5 דקות"],
    excluded: ["הקלטה חדשה באולפן", "מיקס ומאסטר מלאים", "קליפ וידאו"],
  },
  event_sound_rental: {
    included: ["2 רמקולי RCF וסאב", "הובלה, הקמה, כיוונון ופירוק", "עד 250 אורחים"],
    excluded: ["טכנאי לכל האירוע אם לא סוכם", "תאורה", "DJ"],
  },
  dry_hire_day: {
    excluded: ["הובלה", "טכנאי", "ביטוח או הפקדה", "ציוד נוסף מעבר לפריט שנבחר"],
    scopeNote: "מחיר התחלה לפריט ליום. הסופי תלוי במפרט ובהובלה.",
    pricingMode: "from",
  },
};

const catalogById = new Map<string, PriceItem>(
  PRICING_CATALOG.map((item) => [item.id, item]),
);

/** היקף מחיר לפי מזהה קטלוג (אם הוגדר) */
export function getScopeById(id: PriceItemId): PriceScope | undefined {
  return getPriceById(id).scope;
}

/** למי מתאים - לפי מזהה קטלוג */
export function getSuitedForById(id: PriceItemId): string | undefined {
  return getPriceById(id).suitedFor;
}

/** מחיר עם עריכה - לפי מזהה קטלוג */
export function getWithEditingById(id: PriceItemId): PriceWithEditing | undefined {
  return getPriceById(id).withEditing;
}

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

/** האם המחיר במחירון הוא מחיר התחלה */
export function getPriceFromById(id: PriceItemId): boolean {
  return getPriceById(id).priceFrom === true;
}

/** תוספות לפי מזהה שירות בסיסי במחירון */
export function getAddonsForBaseId(baseId: PriceItemId): readonly PriceItem[] {
  const ids = PRICING_ADDON_LINKS[baseId];
  if (!ids?.length) return [];
  return ids.map((id) => getPriceById(id));
}

function normalizeLine(text: string | null | undefined): string | null {
  const line = text?.trim();
  if (!line) return null;
  return line.startsWith("לא כולל ") || line.startsWith("כולל ")
    ? line.replace(/^(לא כולל |כולל )/, "")
    : line;
}

function uniqueLines(lines: readonly (string | null | undefined)[]): string[] {
  const normalized = lines
    .map((line) => normalizeLine(line))
    .filter((line): line is string => line != null);
  return Array.from(new Set(normalized));
}

export function getPriceTransparencyById(id: PriceItemId): PriceTransparency {
  const item = getPriceById(id);
  const categoryDraft = PRICE_TRANSPARENCY_BY_CATEGORY[item.category] || {};
  const override = PRICE_TRANSPARENCY_OVERRIDES[id] || {};
  const addons = override.addons ?? PRICING_ADDON_LINKS[id] ?? [];
  const pricingMode =
    override.pricingMode ?? (item.priceFrom ? "from" : "fixed");

  return {
    included: uniqueLines([
      item.scope?.includes,
      ...(override.included ?? categoryDraft.included ?? []).map((line) =>
        line === ADDON_LABEL_TOKEN ? item.label : line,
      ),
    ]),
    excluded: uniqueLines([
      item.scope?.excludes,
      ...(override.excluded ?? categoryDraft.excluded ?? []),
    ]),
    addons,
    scopeNote:
      override.scopeNote ??
      categoryDraft.scopeNote ??
      (pricingMode === "from"
        ? "מחיר התחלה. המחיר הסופי נקבע לפי היקף, לוגיסטיקה או חומרים."
        : undefined),
    pricingMode,
    glossaryTermSlugs:
      override.glossaryTermSlugs ?? categoryDraft.glossaryTermSlugs,
  };
}

/** סכום מע״מ בלבד */
export function vatAmount(exVat: number): number {
  return withVatLocal(exVat) - exVat;
}

/**
 * שורת מחיר לוואטסאפ: "שיר: ₪750 + מע״מ ₪135 = ₪885 סופי".
 * בלי "כרגע:" (WP1, ED-08, OE-27, S15): הקידומת הודבקה בכפתורים לתוך "מ-"
 * ויצרה "מ-כרגע: מ-990". הסדר ex-VAT ואז הסכום הסופי נשאר כאן בכוונה: זו הודעה
 * שהלקוח שולח לנו, והחשבון המפורש בה הוא מה שהבעלים מאשר בטלפון.
 */
export function formatPriceLine(exVat: number, label?: string): string {
  const vat = vatAmount(exVat);
  const total = withVatLocal(exVat);
  const base = label
    ? `${label}: ${formatNisLocal(exVat)}`
    : formatNisLocal(exVat);
  return `${base} + מע״מ ${formatNisLocal(vat)} = ${formatNisLocal(total)} סופי`;
}

/** קהל המחיר: צרכן רואה כולל מע״מ קודם, עסק רואה לפני מע״מ קודם (החלטת הבעלים 2.10.2026) */
export type PriceAudience = "consumer" | "business";

/** תצוגת "מ-X ₪ כולל מע״מ" */
export function formatFromPriceExVat(exVat: number): string {
  return `מ-${withVatLocal(exVat).toLocaleString("he-IL")} ₪ כולל מע״מ`;
}

/**
 * "מ-590 ₪ כולל מע״מ (500 ₪ + מע״מ)" לצרכן, "מ-500 ₪ + מע״מ (590 ₪ כולל מע״מ)"
 * לעסקים (/business, /pro). מתחיל תמיד ב-"מ-", ולכן הקוראים לא מוסיפים "מ-"
 * משלהם. אותו פורמט כמו formatPrice ב-pricing-display.ts (נבדק בבדיקה).
 */
export function formatFromPriceDual(
  exVat: number,
  audience: PriceAudience = "consumer",
): string {
  const ex = exVat.toLocaleString("he-IL");
  const total = withVatLocal(exVat).toLocaleString("he-IL");
  return audience === "business"
    ? `מ-${ex} ₪ + מע״מ (${total} ₪ כולל מע״מ)`
    : `מ-${total} ₪ כולל מע״מ (${ex} ₪ + מע״מ)`;
}

/**
 * החלטת הבעלים ED-04: התקליטן מהצוות (dj_premium), 4 שעות, עד 300 מוזמנים.
 * כאן ולא במודול נפרד: book-audience-routes נשלח לכל עמוד, והקטלוג כבר במטען
 * (audit:client-data-weight).
 */
export const DJ_TEAM_NOTE = "תקליטן מהצוות, 4 שעות, עד 300 מוזמנים";

export const CATALOG_VAT_RATE = VAT_RATE_LOCAL;
export { withVatLocal as catalogWithVat };
