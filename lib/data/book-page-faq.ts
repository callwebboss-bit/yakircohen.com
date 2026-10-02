export type BookPageFaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export const BOOK_PAGE_FAQ: readonly BookPageFaqItem[] = [
  {
    id: "how-booking",
    question: "איך עובדת הזמנה?",
    answer:
      "בוחרים כיוון כללי באתר ← ממלאים פרטים ראשוניים או נעזרים במחשבון המחיר ← עוברים לוואטסאפ לתיאום סופי ומסירת קבצים ← אנחנו חוזרים אליכם עם חומרים מוכנים תוך 24 עד 48 שעות.",
  },
  {
    id: "vat",
    question: "האם המחירים כוללים מע״מ?",
    answer:
      "בהקלטת שיר המחיר מוצג כולל מע״מ, ובקטן לפני מע״מ. בשאר המחירונים כתוב ליד כל מחיר אם הוא לפני מע״מ או כולל מע״מ, והמחיר הסופי והמלא מוצג בתוך טופס ההזמנה לפני האישור.",
  },
  {
    id: "cancellation",
    question: "מהי מדיניות הביטולים?",
    answer: "ניתן לבטל או לשנות מועד בקלות. לפרטים המלאים והמדויקים, עיינו בסעיף הביטולים בעמוד תנאי השימוש.",
    link: { href: "/terms#cancellation", label: "תנאי שימוש - ביטולים" },
  },
] as const;
