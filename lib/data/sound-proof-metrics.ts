import type { AudioDemoId } from "@/lib/data/audio-demos";
import type { AudioShowcaseVariant } from "@/components/seo/AudioShowcase";

export type SoundProofRow = {
  metric: string;
  before: string;
  after: string;
};

export type SoundProofProfile = {
  id: SoundProofProfileId;
  rows: readonly SoundProofRow[];
  note?: string;
};

export type SoundProofProfileId =
  | AudioDemoId
  | "podcast-editing"
  | "studio-acoustic"
  | "recording-vs-production"
  | "damage-room-echo"
  | "damage-ac-noise"
  | "singer-live-pending";

const NOTE_GENERIC =
  "אלה יעדי העבודה של השירות. התוצאה בקובץ שלכם תלויה באיכות המקור.";

export const SOUND_PROOF_PROFILES: Record<SoundProofProfileId, SoundProofProfile> = {
  "podcast-zoom-cleanup": {
    id: "podcast-zoom-cleanup",
    rows: [
      { metric: "רעש רקע", before: "מזגן, חדר, תהודה", after: "ניקוי רעש קבוע" },
      { metric: "איזון דוברים", before: "פערי עוצמה", after: "עוצמה מאוזנת" },
      { metric: "עוצמה לפלטפורמות", before: "לא מנורמל", after: "יעד של כ-16- LUFS" },
      { metric: "מסירה", before: "קובץ גולמי", after: "MP3 מוכן להעלאה" },
    ],
    note: NOTE_GENERIC,
  },
  "recording-vocal-polish": {
    id: "recording-vocal-polish",
    rows: [
      { metric: "דיוק שירה", before: "סטיות טבעיות", after: "תיקון ידני לפי צורך" },
      { metric: "איזון טון", before: "ווקאל חשוף", after: "EQ וקומפרסיה" },
      { metric: "תחושת עומק", before: "יבש", after: "מיקס מרווח ומחמיא" },
      { metric: "מסירה", before: "סקיצה גולמית", after: "מיקס + מאסטר מוכן" },
    ],
    note: NOTE_GENERIC,
  },
  "pitch-correction": {
    id: "pitch-correction",
    rows: [
      { metric: "דיוק פיץ'", before: "זיופים נשמעים", after: "תיקון ידני טבעי" },
      { metric: "תחושת קול", before: "לא יציב", after: "שומר על אופי אנושי" },
      { metric: "מוכנות לקליפ/הגשה", before: "דורש טיפול", after: "קטע מוכן לשילוב" },
      { metric: "בדיקת התאמה", before: "בלי ודאות", after: "דוגמת לפני/אחרי" },
    ],
    note: NOTE_GENERIC,
  },
  "pitch-correction-remote": {
    id: "pitch-correction-remote",
    rows: [
      { metric: "דיוק פיץ'", before: "זיופים נשמעים", after: "תיקון ידני טבעי" },
      { metric: "התאמה למקור", before: "טלפון / אולפן אחר", after: "עריכה מרחוק על אותו קובץ" },
      { metric: "תחושת קול", before: "עלול לברוח", after: "נשאר טבעי" },
      { metric: "מסירה", before: "קובץ לא סגור", after: "קובץ מתוקן חזרה" },
    ],
    note: NOTE_GENERIC,
  },
  "proposal-gift-pitch": {
    id: "proposal-gift-pitch",
    rows: [
      { metric: "דיוק שירה", before: "הקלטה גולמית", after: "פיץ' קורקשן ידני" },
      { metric: "עיבוד רגשי", before: "יבש", after: "מיקס שמוכן לקליפ" },
      { metric: "התאמה למתנה", before: "סקיצה", after: "תוצר שאפשר להשמיע" },
      { metric: "מסירה", before: "לפני עריכה", after: "קובץ מוכן ללקוח" },
    ],
    note: NOTE_GENERIC,
  },
  "blessing-mix": {
    id: "blessing-mix",
    rows: [
      { metric: "ניקיון דיבור", before: "הקלטה ישירה", after: "חיתוך וריכוך" },
      { metric: "רקע מוזיקלי", before: "ללא מוזיקה", after: "מוזיקת רקע מאוזנת" },
      { metric: "קצב האזנה", before: "לא אחיד", after: "ברכה זורמת וברורה" },
      { metric: "מסירה", before: "סקיצה קולית", after: "קובץ מוכן לאירוע" },
    ],
    note: NOTE_GENERIC,
  },
  "full-production": {
    id: "full-production",
    rows: [
      { metric: "עיבוד", before: "ווקאל יבש", after: "הפקה מלאה" },
      { metric: "שכבות", before: "ללא ליווי", after: "תופים, בס והרמוניות" },
      { metric: "מיקס", before: "לא מאוזן", after: "מיקס + מאסטר" },
      { metric: "שימוש", before: "רעיון", after: "שיר מוכן" },
    ],
    note: NOTE_GENERIC,
  },
  "funny-ringtone": {
    id: "funny-ringtone",
    rows: [
      { metric: "בהירות קול", before: "הקלטה גולמית", after: "ניקוי ויישור" },
      { metric: "קצב", before: "סקיצה חופשית", after: "ערוך לטלפון" },
      { metric: "הומור עובד", before: "רעיון", after: "פאנץ' קצר וברור" },
      { metric: "מסירה", before: "קובץ לא מותאם", after: "מוכן ל-iPhone ולאנדרואיד" },
    ],
    note: NOTE_GENERIC,
  },
  "weber-restoration": {
    id: "weber-restoration",
    rows: [
      { metric: "נזק מקור", before: "פגיעה קשה", after: "שיפור מורגש" },
      { metric: "רעש והמהום", before: "מכסים את הדיבור", after: "מופחתים ככל האפשר" },
      { metric: "בהירות דיבור", before: "קשה להבין", after: "מובנות גבוהה יותר" },
      { metric: "גבול טכני", before: "ללא ודאות", after: "תלוי במקור, לא קסם" },
    ],
    note: "זהו שחזור של חומר פגום במיוחד. לא כל הקלטה חוזרת לאיכות אולפן.",
  },
  "singer-live-tuning": {
    id: "singer-live-tuning",
    rows: [
      { metric: "פידבק", before: "סיכון לשריקות", after: "חיתוך תדרים בעייתיים" },
      { metric: "קריאות קול", before: "טקסט נבלע", after: "קול יושב מעל המיקס" },
      { metric: "שליטה במערכת", before: "לפי תחושה", after: "RTA וכיוון מסודר" },
      { metric: "בדיקה לפני אירוע", before: "לא תמיד", after: "סאונד צ'ק מלא" },
    ],
    note: NOTE_GENERIC,
  },
  "podcast-editing": {
    id: "podcast-editing",
    rows: [
      { metric: "רעשי רקע", before: "מזגן, הד, חדר", after: "ניקוי רעש בלי למחוק קול" },
      { metric: "מבנה הפרק", before: "שתיקות וחזרות", after: "קצב טבעי וקצר יותר" },
      { metric: "עוצמה לפלטפורמות", before: "לא מנורמל", after: "יעד של כ-16- LUFS" },
      { metric: "מסירה", before: "חומר גלם", after: "פרק מוכן להעלאה" },
    ],
    note: NOTE_GENERIC,
  },
  "studio-acoustic": {
    id: "studio-acoustic",
    rows: [
      { metric: "החזרי חדר", before: "קירות מחזירים קול", after: "ספיגה ודיפוזיה" },
      { metric: "דיוק האזנה", before: "חדר מטעה", after: "תמונה יציבה יותר" },
      { metric: "מיקום ציוד", before: "איפה שיש מקום", after: "לפי תכנון" },
      { metric: "תוצאה", before: "ניחושים במיקס", after: "עבודה עקבית יותר" },
    ],
    note: "הטבלה מתארת שינוי תפקודי בחדר. הבדל מדויק נמדד בכל חלל בנפרד.",
  },
  "recording-vs-production": {
    id: "recording-vs-production",
    rows: [
      { metric: "דיוק שירה", before: "ללא תיקון", after: "Melodyne לפי צורך" },
      { metric: "מיקס ומאסטר", before: "בסיסי או חסר", after: "כלול" },
      { metric: "עומק והדגשה", before: "שטוח", after: "מלא ובטוח יותר" },
      { metric: "מוכנות לשיתוף", before: "סקיצה", after: "תוצר סופי" },
    ],
    note: "זו השוואה בין רמת עיבוד, לא בין שני מסלולי רכישה באתר.",
  },
  "damage-room-echo": {
    id: "damage-room-echo",
    rows: [
      { metric: "החזרי חדר", before: "הד שולט", after: "ריכוך והפחתה" },
      { metric: "מובנות", before: "מילים נמרחות", after: "דיבור ברור יותר" },
      { metric: "רעשי חלל", before: "חדר נשמע בקובץ", after: "פחות נוכח" },
      { metric: "תוצאה", before: "קשה להגיש", after: "אפשרי לשימוש" },
    ],
    note: NOTE_GENERIC,
  },
  "damage-ac-noise": {
    id: "damage-ac-noise",
    rows: [
      { metric: "רעש קבוע", before: "מזגן / המהום", after: "מופחת משמעותית" },
      { metric: "בהירות קול", before: "נבלעת ברעש", after: "קול קדמי יותר" },
      { metric: "ניקיון קטעים שקטים", before: "רחש נשאר", after: "רקע שקט יותר" },
      { metric: "מסירה", before: "קובץ גולמי", after: "מתאים לפרסום" },
    ],
    note: NOTE_GENERIC,
  },
  "singer-live-pending": {
    id: "singer-live-pending",
    rows: [
      { metric: "מדידה בחדר", before: "לפי תחושה", after: "RTA בזמן אמת" },
      { metric: "פידבק", before: "סכנת שריקות", after: "הפחתת תדרים בעייתיים" },
      { metric: "קריאות זמר", before: "תלויה בחדר", after: "קול ברור יותר" },
      { metric: "תפעול", before: "מערכת לא מכוונת", after: "סאונד צ'ק מסודר" },
    ],
    note: "קבצי הדגמה יועלו בנפרד. הטבלה מתארת את תהליך הכיוון בשטח.",
  },
};

const VARIANT_FALLBACK: Record<AudioShowcaseVariant, SoundProofProfileId> = {
  remote: "podcast-zoom-cleanup",
  vocal: "recording-vocal-polish",
  restoration: "weber-restoration",
};

export function getSoundProofProfileById(id: SoundProofProfileId): SoundProofProfile {
  return SOUND_PROOF_PROFILES[id];
}

export function getSoundProofProfileByVariant(
  variant: AudioShowcaseVariant,
): SoundProofProfile {
  return SOUND_PROOF_PROFILES[VARIANT_FALLBACK[variant]];
}
