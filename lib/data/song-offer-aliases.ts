/**
 * מזהי התוספות של הקלטת השיר ומיפוי הקישורים הישנים, בלי שום תלות.
 *
 * מודול נפרד מ-song-offer.ts בכוונה: pricing-book-map נטען דרך book-url בכל
 * עמוד באתר (audit:client-data-weight), ולכן מה שהוא מייבא חייב להיות קטן.
 * song-offer.ts מייצא מחדש את כל מה שכאן.
 */

export type SongAddonId =
  | "song_pitch_coaching"
  | "studio_session_clip_edited"
  | "song_pre_session_interview";

/**
 * קישורים ישנים מהמחירון ומהאשף, ?catalog=cover_song וכדומה. כל חבילה שירדה
 * ממופה לבסיס עם התוספות שהכי קרובות למה שהיא כללה. תיקון זיופים היה בתוך
 * כל החבילות, ולכן הוא בכולן. קליפ תמונות הגדילה של All-In אינו מוצר כרגע.
 * הסדר כאן הוא סדר הקטלוג (בדיקה ב-song-offer.test.ts).
 */
export const LEGACY_SONG_ALIASES: Readonly<Record<string, readonly SongAddonId[]>> = {
  cover_song: ["song_pitch_coaching"],
  song_package: ["song_pitch_coaching"],
  studio_viral: ["song_pitch_coaching", "studio_session_clip_edited"],
  studio_all_in: ["song_pitch_coaching"],
};

/** בחירת תוספות למזהה ישן, או null כשהמזהה אינו חבילת שיר שירדה */
export function resolveLegacySongAlias(value: string | null | undefined): SongAddonId[] | null {
  const key = value?.trim();
  if (!key || !Object.prototype.hasOwnProperty.call(LEGACY_SONG_ALIASES, key)) return null;
  return [...LEGACY_SONG_ALIASES[key]];
}
