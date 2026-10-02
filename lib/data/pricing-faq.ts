import { getExVat } from "@/lib/data/pricing-catalog";

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
      `אלה שעון חדר בלי עריכה: חצי שעה (750 ₪) לפיילוט פודקאסט או קריינות, שעה (1,500 ₪) לפרויקט ארוך יותר. לשיר במתנה לוקחים הקלטת שיר (${getExVat("song_recording").toLocaleString("he-IL")} ₪, עם מיקס ומאסטר) - לא שעת חדר.`,
  },
  {
    /* 2.10.2026: חבילות השיר ירדו. שיר הוא בסיס ותוספות (lib/data/song-offer.ts) */
    id: "song-pitch-included",
    question: "האם תיקון זיופים כלול בהקלטת שיר?",
    answerPlain:
      `לא במחיר הבסיס. הקלטת שיר (${getExVat("song_recording").toLocaleString("he-IL")} ₪ לפני מע״מ) כוללת הקלטה, מיקס ומאסטר בסשן של שעה, והשיר אצלכם בסוף הסשן. תיקון זיופים עם טכנאי שמכוון ומנחה הוא תוספת של ${getExVat("song_pitch_coaching").toLocaleString("he-IL")} ₪, וקליפ ערוך מהסשן ${getExVat("studio_session_clip_edited").toLocaleString("he-IL")} ₪.`,
  },
  {
    id: "podcast-which-package",
    question: "איזו חבילת פודקאסט מתאימה לי?",
    answerPlain:
      "פודקאסט אודיו (מ-950 ₪) - פרק בודד עם הקלטה ועריכה. וידאו (מ-1,650 ₪) - אם צריך נוכחות ביוטיוב. חבילת תוכן (מ-2,800 ₪) - אם רוצים גם רילז מהפרק. לא בטוחים? שלחו הודעה ונמליץ.",
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
      "לא - המחירים במחירון הם לפני מע״מ (+18%). בלחיצה על שורה רואים גם את המחיר כולל מע״מ. בטופס ההזמנה (/book) מוצג המחיר הסופי.",
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
