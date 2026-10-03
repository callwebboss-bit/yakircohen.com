import { getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";

/* המחירון המרכזי מוביל בכולל מע״מ (החלטת הבעלים 2.10.2026), ולכן גם התשובות */
const nis = (id: PriceItemId) => `${withVat(getExVat(id)).toLocaleString("he-IL")} ₪`;

export type PricingFaqItem = {
  id: string;
  question: string;
  /** טקסט לסכימת FAQ (ללא HTML) */
  answerPlain: string;
};

export const PRICING_FAQ_ITEMS: readonly PricingFaqItem[] = [
  {
    id: "studio-half-vs-hour",
    question: "מה ההבדל בין חצי שעה לשעה באולפן?",
    answerPlain:
      `אלה שעון חדר בלי עריכה: חצי שעה (${nis("studio_half_hour")}) לפיילוט פודקאסט או קריינות, שעה (${nis("studio_hour")}) לפרויקט ארוך יותר. לשיר במתנה לוקחים הקלטת שיר (${nis("song_recording")}, עם מיקס ומאסטר) - לא שעת חדר. כל המחירים כוללים מע״מ.`,
  },
  {
    /* 2.10.2026: חבילות השיר ירדו. שיר הוא בסיס ותוספות (lib/data/song-offer.ts) */
    id: "song-pitch-included",
    question: "האם תיקון זיופים כלול בהקלטת שיר?",
    answerPlain:
      `לא במחיר הבסיס. הקלטת שיר (${nis("song_recording")} כולל מע״מ) כוללת הקלטה, מיקס ומאסטר בסשן של שעה, והשיר אצלכם בסוף הסשן. תיקון זיופים עם טכנאי שמכוון ומנחה הוא תוספת של ${nis("song_pitch_coaching")}, וקליפ ערוך מהסשן ${nis("studio_session_clip_edited")}, כולל מע״מ.`,
  },
  {
    id: "podcast-which-package",
    question: "איזו חבילת פודקאסט מתאימה לי?",
    answerPlain:
      `פודקאסט אודיו (מ-${nis("podcast_audio")}) - פרק בודד עם הקלטה ועריכה. וידאו (מ-${nis("podcast_video")}) - אם צריך נוכחות ביוטיוב. חבילת תוכן (מ-${nis("content_package")}) - אם רוצים גם רילז מהפרק. המחירים כוללים מע״מ. לא בטוחים? שלחו הודעה ונמליץ.`,
  },
  {
    id: "unsure-which-service",
    question: "אני לא יודע איזה שירות לבחור - מה עושים?",
    answerPlain:
      "תתקשרו או תשלחו וואטסאפ. תארו מה אתם צריכים - אשאל שלוש שאלות ואמליץ על שירות אחד, בלי לחץ.",
  },
  {
    id: "need-more-time",
    question: "מה קורה אם צריך יותר זמן ממה שבחרתי?",
    answerPlain:
      "תוספת זמן באולפן - לפי מחיר חצי שעה. בפודקאסט - תוספת משתתף או זמן עריכה נספרים בנפרד ומוסברים לפני שמתחילים.",
  },
  {
    id: "vat-included",
    question: "האם המחירים כוללים מע״מ?",
    answerPlain:
      "כן. המחיר הגדול במחירון כולל מע״מ, ולידו בקטן המחיר לפני מע״מ. בטופס ההזמנה (/book) מוצג המחיר הסופי.",
  },
  {
    id: "how-to-book",
    question: "איך מזמינים שירות?",
    answerPlain:
      "דרך /book - בוחרים שירות, רואים מחיר סופי עם מע״מ, מאשרים תאריך. אפשר גם וואטסאפ אם צריך עזרה לבחור.",
  },
  {
    id: "try-before-commit",
    question: "אפשר לנסות לפני שמתחייבים לחבילה גדולה?",
    answerPlain:
      "כן. פודקאסט - חבילת פתיחה (חצי שעה) או פרק אודיו בודד. אולפן - חצי שעה. עסקים - פיילוט תוכן. פרטים ב-/packages.",
  },
] as const;
