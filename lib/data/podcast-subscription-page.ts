/**
 * דף /podcast/subscription: שלושה מסלולי מנוי חודשי לפודקאסט.
 *
 * הדף בנוי כטיוטה. כל עוד PODCAST_SUBSCRIPTION_IS_DRAFT דלוק:
 *  - הדף לא באינדקס (robots), לא במפת האתר ולא בניווט.
 *  - הדף אומר בגלוי שהמסלולים והמחירים הם הצעה שעוד לא אושרה.
 *  - לא נפלטת סכמת Offer או FAQPage.
 *
 * מחירים לא נכתבים כסכום. כל מחיר נגזר מהקטלוג (lib/data/pricing-catalog.ts),
 * כך ששינוי שם מתעדכן גם כאן, וגם בתשובות הנפוצות.
 *
 * להוציא מטיוטה: אישור הבעלים למסלולים ולנוסח התשובות, להפוך את הדגל ל-false,
 * להוסיף את הדף למפת האתר ולניווט.
 */
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";

export const PODCAST_SUBSCRIPTION_PATH = "/podcast/subscription";
export const PODCAST_SUBSCRIPTION_TITLE = "מנוי חודשי להפקת פודקאסט";
export const PODCAST_SUBSCRIPTION_IS_DRAFT = true;

export type SubscriptionPlanId = "basic" | "extended" | "video";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  /** שורה קצרה מתחת לשם המסלול. */
  tagline: string;
  episodesPerMonth: number;
  audioEditing: boolean;
  videoEditing: boolean;
  /** לפני מע״מ, לחודש. null = עוד לא נקבע. */
  priceExVat: number | null;
};

/*
 * המסלולים הם הצעה, והבעלים העביר את הבחירה אליי (8.10.2026) ואישר "הכי נכון".
 *  - בסיס: 2 פרקי אודיו, כל אחד במחיר פרק אודיו בודד, בלי הנחה.
 *  - מורחב: חבילת 4 פרקי אודיו הקיימת (פרק בשבוע), במחירה, הנחה של 8%.
 *  - וידאו: 4 פרקי וידאו במחיר פרק וידאו בודד. הנחת ה-8% נקבעה רק לחבילות אודיו,
 *    ולכן לא הוחלה כאן בלי אישור.
 */
export const PODCAST_SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  {
    id: "basic",
    name: "בסיס",
    tagline: "פרק כל שבועיים",
    episodesPerMonth: 2,
    audioEditing: true,
    videoEditing: false,
    priceExVat: 2 * getExVat("podcast_audio"),
  },
  {
    id: "extended",
    name: "מורחב",
    tagline: "פרק בשבוע",
    episodesPerMonth: 4,
    audioEditing: true,
    videoEditing: false,
    priceExVat: getExVat("podcast_audio_pack_4"),
  },
  {
    id: "video",
    name: "וידאו",
    tagline: "פרק בשבוע, עם צילום",
    episodesPerMonth: 4,
    audioEditing: true,
    videoEditing: true,
    priceExVat: 4 * getExVat("podcast_video"),
  },
];

export type SubscriptionFaq = {
  question: string;
  /** null = המדיניות עוד לא סוכמה עם הבעלים. לא ממציאים תנאים. */
  answer: string | null;
};

/*
 * תשובות הבעלים, 8.10.2026. נוסח הביטול וההחזר הוא ניסוח שלי לפי דבריו
 * ("מחיר פודקאסט יחיד לפי החבילה, לא לפי המחיר המיוחד") ולאישורו.
 * שמירה קבועה: הקטלוג כותב "בלי תאריך תפוגה" ולא "לכל החיים" (הערה ב-
 * pricing-catalog.ts, החלטה מ-6.10), ולכן כך גם כאן.
 */
export const PODCAST_SUBSCRIPTION_FAQS: readonly SubscriptionFaq[] = [
  {
    question: "יש התחייבות לתקופה מינימלית?",
    answer: "המנוי נבנה לשנה והחיוב חודשי, אבל אף אחד לא כבול. אפשר לבטל בכל שלב ובכל דרך, ולהישאר רק כשטוב לכם.",
  },
  {
    question: "אפשר לבטל את המנוי? איך מקבלים החזר?",
    answer:
      "אפשר לבטל בכל שלב, בכל דרך שנוחה לכם. ההחזר מחושב לפי מה ששילמתם פחות הפרקים שכבר הופקו, כשכל פרק נחשב לפי מחיר פרק בודד בחבילה שלכם ולא לפי מחיר המנוי המוזל. אם הפרקים שהופקו עלו יותר ממה ששילמתם, לא גובים מכם את ההפרש.",
  },
  {
    question: "מה קורה עם פרק שלא נוצל באותו חודש?",
    answer: "פרק שלא נוצל נשמר לחודש הבא, ואפשר לנצל אותו עד שנה קדימה ממועד העסקה.",
  },
  { question: "אפשר לעבור בין מסלולים באמצע התקופה?", answer: "אפשר לעבור בין מסלולים בתחילת כל חודש." },
  {
    question: "האם הפרקים נשמרים אצלכם אחרי שנשלחו?",
    answer: `אחרי שהפרק נשלח אליכם, השירות הושלם. ברוב המקרים אנחנו שומרים גיבויים, אבל מתחייבים לשמור רק כשהובטח, או כשביקשתם שמירה כחלק מהשירות. מי שרוצה ודאות יכול להוסיף שמירה קבועה בענן שלנו, בלי תאריך תפוגה, ב-${formatPrice(getExVat("cloud_storage_permanent")).inline} לכל פרק, תשלום חד-פעמי.`,
  },
];

export const PODCAST_SUBSCRIPTION_FAQ_PLACEHOLDER = "התשובה תעודכן אחרי שהתנאים יסוכמו.";
