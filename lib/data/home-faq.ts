/**
 * Unified source for homepage FAQ — used by both JSON-LD schema and FAQAccordion UI.
 * Plain-text answers only; JSX enrichment lives in HomePageSections.tsx.
 * Prices are derived from pricing-catalog (single source of truth).
 */

import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { RECORDING_SONG_STUDIO_PRICE_FAQ } from "@/lib/data/faq-aeo";

export type HomeFaqItem = {
  id: string;
  question: string;
  /** Plain text used in JSON-LD schema (no HTML/JSX). */
  answerPlain: string;
};

export const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    id: "song-studio-price",
    question: RECORDING_SONG_STUDIO_PRICE_FAQ.question,
    answerPlain: RECORDING_SONG_STUDIO_PRICE_FAQ.answer,
  },
  {
    id: "location-parking",
    question: "איפה האולפן ויש חנייה?",
    answerPlain:
      "האולפן ממוקם בעמק איילון 34, מודיעין מכבים רעות. חניה פרטית בשטח.",
  },
  {
    id: "ai-restoration",
    question: "יש לכם הקלטה ישנה או רועשת?",
    answerPlain:
      "שלחו את הקובץ. מנקים רעשים, מיישרים עוצמה, ומחזירים קול שאפשר להפיץ דרך שחזור סאונד ב-AI.",
  },
  {
    id: "events-attractions",
    question: "האם השירות כולל הגעה לאירועים?",
    answerPlain:
      "כן. DJ והגברה, עשן כבד, בועות, זיקוקים קרים ועוד זמינים לאירועי שטח. החבילה נבנית לפי סוג האירוע ומיקומו.",
  },
  {
    id: "pricing",
    question: "כמה עולה הקלטה או אירוע?",
    answerPlain: `ברכה / הקלטה קצרה ${formatFromPriceDual(getExVat("blessing_recording")).replace("כרגע: ", "")}. פודקאסט פיילוט מ-${getExVat("podcast_pilot").toLocaleString("he-IL")} ₪ + מע"מ. בהזמנה מקוונת רואים מחיר סופי מיד.`,
  },
  {
    id: "delivery-time",
    question: "תוך כמה זמן מקבלים קובץ מוכן?",
    answerPlain:
      "הקלטת ברכה פשוטה: מוכן תוך 24-48 שעות. שיר מלא עם עריכה: עד 48 שעות. פודקאסט ואירועים: לפי היקף הפרויקט. לוח זמנים ברור נקבע בשיחה הראשונה.",
  },
  {
    id: "service-area",
    question: "לאיזה אזורים אתם מגיעים?",
    answerPlain:
      "האולפן במודיעין. לאירועים מגיעים לפתח תקווה, שוהם, ירושלים ולכל הארץ. הקלטות בירושלים בתיאום מראש. תוספת נסיעות מחוץ לאזור המרכז.",
  },
  {
    id: "payment",
    question: "איך משלמים?",
    answerPlain:
      "אשראי, Bit, PayBox, Apple Pay ו-PayPal לפי תיאום. חשבונית מס מסודרת. פרטי כרטיס אשראי לא נשמרים באתר.",
  },
  {
    id: "cancellation",
    question: "מה קורה אם צריך לבטל או לשנות תאריך?",
    answerPlain:
      "עדכנו אותנו בהקדם בוואטסאפ. ננסה לתאם מועד חלופי. מדיניות ביטולים מפורטת בתנאי השירות.",
  },
  {
    id: "remote-fix",
    question: "אפשר לשפר הקלטה בלי להגיע לאולפן?",
    answerPlain:
      "כן. שולחים קובץ בוואטסאפ, במייל או ב-Drive - ומחזירים קובץ מטופל תוך שעות. תיקון זיופים, ניקוי רעשים, מיקס ומאסטרינג - הכל מרחוק. פרטים בשירותי עריכה מקוונים.",
  },
];
