/**
 * מפת מילות מפתח → URL לקישורים פנימיים (AEO / anchor text).
 * הוספה בלבד — לא מחליפה קישורים קיימים בעמודים.
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
};

export function getKeywordLink(keyword: string): KeywordLink | undefined {
  return KEYWORD_LINK_MAP[keyword.trim()];
}
