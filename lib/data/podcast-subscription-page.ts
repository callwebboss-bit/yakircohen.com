/**
 * דף /podcast/subscription: שלושה מסלולי מנוי חודשי לפודקאסט.
 *
 * הדף בנוי כטיוטה. כל עוד PODCAST_SUBSCRIPTION_IS_DRAFT דלוק:
 *  - הדף לא באינדקס (robots), לא במפת האתר ולא בניווט.
 *  - המחירים ומספרי הפרקים הם placeholder, והדף אומר את זה בגלוי.
 *  - לא נפלטת סכמת Offer או FAQPage, כי סכמה חייבת להתאים למה שהגולש רואה,
 *    ומחיר או מדיניות ביטול שלא נקבעו הם לא עובדה.
 *
 * להוציא מטיוטה: להגדיר priceExVat לכל מסלול, להשלים את התשובות ב-
 * PODCAST_SUBSCRIPTION_FAQS ולהפוך את הדגל ל-false. מחיר אמיתי שייך בקטלוג
 * (lib/data/pricing-catalog.ts), לא כאן.
 */

export const PODCAST_SUBSCRIPTION_PATH = "/podcast/subscription";
export const PODCAST_SUBSCRIPTION_TITLE = "מנוי חודשי להפקת פודקאסט";
export const PODCAST_SUBSCRIPTION_IS_DRAFT = true;

export type SubscriptionPlanId = "basic" | "extended" | "video";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  /** placeholder עד שהבעלים קובע. */
  episodesPerMonth: number;
  audioEditing: boolean;
  videoEditing: boolean;
  /** לפני מע״מ. null = עוד לא נקבע. */
  priceExVat: number | null;
};

export const PODCAST_SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  { id: "basic", name: "בסיס", episodesPerMonth: 2, audioEditing: true, videoEditing: false, priceExVat: null },
  { id: "extended", name: "מורחב", episodesPerMonth: 4, audioEditing: true, videoEditing: false, priceExVat: null },
  { id: "video", name: "וידאו", episodesPerMonth: 4, audioEditing: true, videoEditing: true, priceExVat: null },
];

export type SubscriptionFaq = {
  question: string;
  /** null = המדיניות עוד לא סוכמה עם הבעלים. לא ממציאים תנאים. */
  answer: string | null;
};

export const PODCAST_SUBSCRIPTION_FAQS: readonly SubscriptionFaq[] = [
  /* תשובות הבעלים, 8.10.2026. ביטול עדיין לא סוכם, ולכן FAQPage לא נפלט. */
  { question: "יש התחייבות לתקופה מינימלית?", answer: "המנוי הוא למשך שנה, כמו כל עסקה אצלנו." },
  { question: "אפשר לבטל את המנוי? איך ומתי?", answer: null },
  { question: "מה קורה עם פרק שלא נוצל באותו חודש?", answer: "פרק שלא נוצל נשמר לחודש הבא." },
  { question: "אפשר לעבור בין מסלולים באמצע התקופה?", answer: "אפשר לעבור בין מסלולים בתחילת כל חודש." },
];

export const PODCAST_SUBSCRIPTION_FAQ_PLACEHOLDER = "התשובה תעודכן אחרי שהתנאים יסוכמו.";
