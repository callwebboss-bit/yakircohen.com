import type { BookCategoryId } from "@/lib/book-url";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import type { StudioPackageId } from "@/lib/data/studio-recording-booking";
import {
  PODCAST_EDITING_PRICE_FAQ,
  PODCAST_HOW_TO_RECORD_FAQ,
  PODCAST_RECORDING_PRICE_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
  RECORDING_SONG_STUDIO_PRICE_FAQ,
} from "@/lib/data/faq-aeo";
import { podcastPackageToCatalogId } from "@/lib/pricing-addon-adapter";

export type WizardFaqContext = {
  category: BookCategoryId;
  packageId?: string;
  catalogId?: PriceItemId | null;
};

const PODCAST_PACKAGE_FAQS: Partial<
  Record<PodcastPackageId, readonly FAQItem[]>
> = {
  starter: [
    { id: PODCAST_HOW_TO_RECORD_FAQ.id, question: PODCAST_HOW_TO_RECORD_FAQ.question, answer: PODCAST_HOW_TO_RECORD_FAQ.answer },
    { id: PODCAST_STUDIO_MODIIN_PRICE_FAQ.id, question: PODCAST_STUDIO_MODIIN_PRICE_FAQ.question, answer: PODCAST_STUDIO_MODIIN_PRICE_FAQ.answer },
    {
      id: "wizard-podcast-stutter",
      question: "מה קורה אם מגמגמים או טועים בהקלטה?",
      answer:
        "אפשר לעצור ולהתחיל מחדש, או לערוך אחר כך. בעריכה מקצועית מסירים הפסקות ארוכות ומגמגומים בולטים — לפי מה שתבחרו בחבילה.",
    },
  ],
  audio: [
    { id: PODCAST_RECORDING_PRICE_FAQ.id, question: PODCAST_RECORDING_PRICE_FAQ.question, answer: PODCAST_RECORDING_PRICE_FAQ.answer },
    {
      id: "wizard-podcast-delivery",
      question: "תוך כמה זמן מקבלים את החומרים?",
      answer:
        "רוב הפרקים עוברים עריכה תוך 1–3 ימי עבודה. קבצים מוכנים להעלאה — בדרך כלל תוך 24 שעות עבודה מסיום ההקלטה.",
    },
    { id: PODCAST_EDITING_PRICE_FAQ.id, question: PODCAST_EDITING_PRICE_FAQ.question, answer: PODCAST_EDITING_PRICE_FAQ.answer },
  ],
  video: [
    { id: PODCAST_RECORDING_PRICE_FAQ.id, question: PODCAST_RECORDING_PRICE_FAQ.question, answer: PODCAST_RECORDING_PRICE_FAQ.answer },
    {
      id: "wizard-podcast-cameras",
      question: "כמה מצלמות יש באולפן?",
      answer: "3 מצלמות, תאורה וסאונד מקצועיים. העריכה כוללת גרסה ליוטיוב ואודיו לספוטיפיי.",
    },
    {
      id: "wizard-podcast-video-delivery",
      question: "תוך כמה זמן מקבלים את החומרים?",
      answer: "עריכת וידאו לוקחת יותר מאודיו בלבד — בדרך כלל 2–4 ימי עבודה, לפי אורך הפרק.",
    },
  ],
  social: [
    {
      id: "wizard-podcast-social-pack",
      question: "מה כלול בחבילת תוכן מלאה?",
      answer:
        "וידאו מלא, 3 רילס עם כתוביות, והעלאה לספוטיפיי ואפל. מתאים למי שרוצה נוכחות שוטפת ברשתות.",
    },
    { id: PODCAST_EDITING_PRICE_FAQ.id, question: PODCAST_EDITING_PRICE_FAQ.question, answer: PODCAST_EDITING_PRICE_FAQ.answer },
    {
      id: "wizard-podcast-social-delivery",
      question: "תוך כמה זמן מקבלים את החומרים?",
      answer: "לוח זמנים לפי היקף הפרק והרילס — נציין בוואטסאפ אחרי ההזמנה.",
    },
  ],
};

const STUDIO_PACKAGE_FAQS: readonly FAQItem[] = [
  {
    id: RECORDING_SONG_STUDIO_PRICE_FAQ.id,
    question: RECORDING_SONG_STUDIO_PRICE_FAQ.question,
    answer: RECORDING_SONG_STUDIO_PRICE_FAQ.answer,
  },
  {
    id: "wizard-studio-delivery",
    question: "תוך כמה זמן מקבלים את ההקלטה?",
    answer:
      "תלוי בחבילה: ברכה קצרה — לרוב ביום-יומיים. שיר מלא — לפי לוח עריכה שמסכמים בוואטסאפ.",
  },
  {
    id: "wizard-studio-stutter",
    question: "מה קורה אם מגמגמים בהקלטה?",
    answer:
      "אפשר לעצור ולחזור על קטע. בעריכה מקצועית מסירים מגמגומים והפסקות — לפי מה שבחרתם במסלול.",
  },
];

export function getWizardStepFaqs(ctx: WizardFaqContext): readonly FAQItem[] {
  if (ctx.category === "podcast" && ctx.packageId) {
    const pkg = ctx.packageId as PodcastPackageId;
    return PODCAST_PACKAGE_FAQS[pkg] ?? [];
  }
  if (ctx.category === "studio" && ctx.packageId) {
    return STUDIO_PACKAGE_FAQS;
  }
  if (ctx.category === "podcast" && ctx.catalogId) {
    const pkg = Object.entries({
      starter: "studio_half_hour",
      audio: "podcast_audio",
      video: "podcast_video",
      social: "content_package",
    }).find(([, cat]) => cat === ctx.catalogId)?.[0] as PodcastPackageId | undefined;
    if (pkg) return PODCAST_PACKAGE_FAQS[pkg] ?? [];
  }
  if (ctx.category === "podcast") {
    return PODCAST_PACKAGE_FAQS.audio ?? [];
  }
  return [];
}

export function getWizardFaqsForPodcastPackage(
  packageId: PodcastPackageId | "",
): readonly FAQItem[] {
  if (!packageId) return [];
  return getWizardStepFaqs({
    category: "podcast",
    packageId,
    catalogId: podcastPackageToCatalogId(packageId),
  });
}

export function getWizardFaqsForStudioPackage(
  packageId: StudioPackageId | "",
): readonly FAQItem[] {
  if (!packageId) return [];
  return getWizardStepFaqs({ category: "studio", packageId });
}

const EVENTS_STEP_FAQS: readonly FAQItem[] = [
  {
    id: "wizard-events-bundle",
    question: "מתי מתחשבת הנחת חבילה?",
    answer:
      "2 אטרקציות ומעלה — מחיר חבילה. 4 אטרקציות ומעלה — מצגת תמונות מתנה. הכל מחושב אוטומטית בסיכום.",
  },
  {
    id: "wizard-events-timing",
    question: "תוך כמה זמן מגיעים לאירוע?",
    answer:
      "תיאום מראש לפי תאריך האירוע. ביום האירוע — הגעה לפי לוח הזמנים שסיכמנו בוואטסאפ.",
  },
  {
    id: "wizard-events-outdoor",
    question: "אפשר בחוץ / באולם ללא מערכת הגברה?",
    answer:
      "רוב האטרקציות דורשות חשמל ומרחק בטיחות. אם אין הגברה — אפשר להוסיף השכרת ציוד מהרשימה.",
  },
];

export function getWizardFaqsForEventsStep(): readonly FAQItem[] {
  return EVENTS_STEP_FAQS;
}
