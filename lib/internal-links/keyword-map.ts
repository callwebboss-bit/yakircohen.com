/**
 * מפת מילות מפתח → URL לקישורים פנימיים (AEO / anchor text).
 * הוספה בלבד - לא מחליפה קישורים קיימים בעמודים.
 */

export type KeywordLink = {
  href: string;
  /** טקסט עוגן מומלץ בעברית */
  anchor: string;
};

/** מילת מפתח (או ביטוי) → יעד */
export const KEYWORD_LINK_MAP: Readonly<Record<string, KeywordLink>> = {
  "תיקון זיופים": { href: "/online/vocal-fix", anchor: "תיקון זיופים" },
  "שחזור הקלטות": { href: "/online", anchor: "שחזור הקלטות" },
  "שיפור קול": { href: "/online/vocal-fix", anchor: "שיפור קול" },
  "DJ לחתונות": { href: "/events/dj-events", anchor: "DJ לחתונות" },
  "תקליטן לחתונה": { href: "/events/dj-events", anchor: "תקליטן לחתונה" },
  "הגברה לאירוע": { href: "/events/equipment", anchor: "הגברה לאירוע" },
  "אטרקציות לחתונה": { href: "/events/attractions", anchor: "אטרקציות לחתונה" },
  "זיקוקים קרים": { href: "/events/attractions/cold-fireworks", anchor: "זיקוקים קרים" },
  "הקלטת שיר": { href: "/studio/recording-song-modiin", anchor: "הקלטת שיר" },
  "שיר לחתונה": { href: "/studio/recording-song-modiin", anchor: "שיר לחתונה" },
  "ברכה מוקלטת": { href: "/studio/blessings", anchor: "ברכה מוקלטת" },
  "הקלטת פודקאסט": { href: "/podcast/podcast-recording", anchor: "הקלטת פודקאסט" },
  "עריכת פודקאסט": { href: "/podcast/podcast-editing", anchor: "עריכת פודקאסט" },
  "אולפן פודקאסט": { href: "/podcast/podcast-studio-modiin", anchor: "אולפן פודקאסט" },
  קריינות: { href: "/voiceover", anchor: "קריינות" },
  "קריינות מקצועית": { href: "/voiceover", anchor: "קריינות מקצועית" },
  "קריינות לעסק": { href: "/business/professional-voiceover", anchor: "קריינות לעסק" },
  "הפקה מוזיקלית": { href: "/academy/music-production", anchor: "הפקה מוזיקלית" },
  "קורס DJ": { href: "/academy/dj-course", anchor: "קורס DJ" },
  מחירון: { href: "/pricing", anchor: "מחירון" },
  "הזמנה מקוונת": { href: "/book", anchor: "הזמנה מקוונת" },
  "הזמנת אולפן": { href: "/book", anchor: "הזמנת אולפן" },
  "הזמנת DJ": { href: "/book", anchor: "הזמנת DJ" },
  "בדיקת מחיר": { href: "/book", anchor: "בדיקת מחיר" },
  "מחשבון מחירים": { href: "/book", anchor: "מחשבון מחירים" },
  "הזמנת פודקאסט": { href: "/book", anchor: "הזמנת פודקאסט" },
  "הצעת מחיר מקוונת": { href: "/book", anchor: "הצעת מחיר מקוונת" },
  "לבדוק תאריך פנוי": { href: "/book", anchor: "לבדוק תאריך פנוי" },
  "DJ שוהם": { href: "/dj-events/cities/shoham", anchor: "DJ בשוהם" },
  "דיגגיי בשוהם": { href: "/dj-events/cities/shoham", anchor: "דיגגיי בשוהם" },
  "DJ רחובות": { href: "/dj-events/cities/rehovot", anchor: "DJ ברחובות" },
  "דיגגיי ברחובות": { href: "/dj-events/cities/rehovot", anchor: "דיגגיי ברחובות" },
  "אולפן הקלטות שוהם": {
    href: "/studio/studio-shoham",
    anchor: "אולפן הקלטות בשוהם",
  },
  "אולפן הקלטות רחובות": {
    href: "/studio/studio-rehovot",
    anchor: "אולפן הקלטות ברחובות",
  },
  "כמה עולה להקליט שיר באולפן": {
    href: "/studio/recording-song-modiin",
    anchor: "הקלטת שיר באולפן",
  },
  "איך להקליט פודקאסט": {
    href: "/podcast/podcast-recording",
    anchor: "הקלטת פודקאסט באולפן",
  },
  "כמה עולה להקליט פודקאסט": {
    href: "/podcast/podcast-recording",
    anchor: "הקלטת פודקאסט",
  },
  "כמה עולה השכרת סטודיו לפודקאסט במודיעין": {
    href: "/podcast/podcast-studio-modiin",
    anchor: "השכרת סטודיו לפודקאסט במודיעין",
  },
  "כמה עולה עריכת פודקאסט": {
    href: "/podcast/podcast-editing",
    anchor: "עריכת פודקאסט מקצועית",
  },
  "כמה עולה DJ לחתונה": {
    href: "/events/dj-events",
    anchor: "DJ לחתונה",
  },
  "צילום חתונות": { href: "/photography/wedding", anchor: "צילום חתונות" },
  "צלם חתונה": { href: "/photography/wedding", anchor: "צלם חתונה" },
  "מנחה אירועים": { href: "/events/host", anchor: "מנחה אירועים" },
  "הגברה לזמרים": { href: "/events/equipment/singer-amplification", anchor: "הגברה לזמרים" },
  "קורס הפקה מוזיקלית": { href: "/academy/music-production", anchor: "קורס הפקה מוזיקלית" },
  "שיעורים פרטיים בעברית": { href: "/academy/hebrew-lessons", anchor: "שיעורים פרטיים בעברית" },
  "מצגת תמונות לאירוע": { href: "/photo-slideshow", anchor: "מצגת תמונות לאירוע" },
  "תותחי עשן": { href: "/events/attractions/smoke-cannons-for-events", anchor: "תותחי עשן לאירועים" },
  "בלוני ענק": { href: "/events/attractions/giant-balloons", anchor: "בלוני ענק לאירועים" },
  "מכונת בועות": { href: "/events/attractions/bubble-machine", anchor: "מכונת בועות לאירוע" },
  "הסרת רעשים": { href: "/online/vocal-fix/noise-removal", anchor: "הסרת רעשים מהקלטה" },
  "מיקס ומאסטרינג": { href: "/online/vocal-fix/mixing", anchor: "מיקס ומאסטרינג" },
  "הקלטת ברכה": { href: "/studio/blessings", anchor: "הקלטת ברכה" },
  "חיתוך לרילס": { href: "/business/content-studio", anchor: "חיתוך לרילס ושורטס" },
  "כתוביות ותרגום": { href: "/online/transcription", anchor: "תמלול וכתוביות" },
  "נורמליזציה לפלטפורמות": { href: "/online/vocal-fix/volume-balance", anchor: "נורמליזציה לפלטפורמות" },
  "דרשה לבר מצווה": { href: "/studio/blessings/bar-mitzvah", anchor: "דרשה לבר/בת מצווה" },
  "ברכת חתן וכלה": { href: "/studio/blessings/bride-groom-blessing", anchor: "ברכת חתן וכלה" },
  "השכרת סטודיו לפודקאסט": { href: "/podcast/podcast-studio-modiin", anchor: "השכרת סטודיו לפודקאסט במודיעין" },
  "מרכז דיג'יי": { href: "/online/mashup-fixer", anchor: "מרכז דיג'יי אונליין" },
  "רילז באולפן": { href: "/business/content-studio", anchor: "רילז באולפן לעסק" },
  "גמגום": { href: "/stuttering", anchor: "ליווי לגמגום" },
  "קורס גמגום": { href: "/academy/stuttering-course", anchor: "קורס גמגום" },
  "קליניקה לגמגום": { href: "/clinic", anchor: "קליניקה לגמגום" },
  "אטרקציות לאירועים בירושלים": {
    href: "/events/attractions/jerusalem",
    anchor: "אטרקציות לאירועים בירושלים",
  },
  "ציוד מקצועי למכירה": { href: "/shop#used-gear", anchor: "ציוד מקצועי למכירה" },
  "ציוד יד שנייה": { href: "/shop#used-gear", anchor: "ציוד יד שנייה" },
  "פודקאסט נייד": { href: "/podcast/mobile-podcast-at-home", anchor: "פודקאסט נייד עד הבית" },
  "הקלטת פודקאסט בבית": {
    href: "/podcast/mobile-podcast-at-home",
    anchor: "הקלטת פודקאסט בבית",
  },
  "עשן כבד לאירועים גדולים": {
    href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
    anchor: "עשן כבד לאירועים גדולים",
  },
  "מנחה לחתונה": { href: "/events/host", anchor: "מנחה לחתונה" },
  "הנחיית אירועים": { href: "/events/host", anchor: "הנחיית אירועים" },
  "תותח קונפטי": { href: "/events/attractions/confetti-cannon", anchor: "תותח קונפטי" },
  "עשן כבד לחתונה": {
    href: "/events/attractions/wedding-smoking-machine",
    anchor: "עשן כבד לחתונה",
  },
  "השכרת אולפן עצמי": {
    href: "/podcast/self-service-studio",
    anchor: "השכרת אולפן עצמי",
  },
  "DJ לחתונה": { href: "/events/dj-events", anchor: "DJ לחתונה" },
  "תקליטן לאירועים": { href: "/events/dj-events", anchor: "תקליטן לאירועים" },
  "DJ לאירועים": { href: "/events/dj-events", anchor: "DJ לאירועים" },
  "חבילות לחתונה": {
    href: "/events/wedding-attractions-packages",
    anchor: "חבילות לחתונה",
  },
  "חבילות אירוע": {
    href: "/events/wedding-attractions-packages",
    anchor: "חבילות אירוע",
  },
  "השכרת הגברה": { href: "/events/equipment", anchor: "השכרת הגברה" },
  "הגברה לאירועים": { href: "/events/equipment", anchor: "הגברה לאירועים" },
  "שובר מתנה": { href: "/shop#vouchers", anchor: "שובר מתנה" },
  "הקלטת שיר באולפן": {
    href: "/studio/recording-song-modiin",
    anchor: "הקלטת שיר באולפן",
  },
  "שיר לבר מצווה": {
    href: "/studio/recording-song-modiin",
    anchor: "שיר לבר מצווה",
  },
};

export function getKeywordLink(keyword: string): KeywordLink | undefined {
  return KEYWORD_LINK_MAP[keyword.trim()];
}
