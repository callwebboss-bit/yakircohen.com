import type { BookCategoryId } from "@/lib/book-url";
import type { FAQItem } from "@/components/ui/FAQAccordion";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";
import type { StudioPackageId } from "@/lib/data/studio-recording-booking";
import { PODCAST_HOW_TO_RECORD_FAQ, RECORDING_SONG_STUDIO_PRICE_FAQ } from "@/lib/data/faq-aeo";
import { MOBILE_PODCAST_FAQS } from "@/lib/data/mobile-podcast-at-home-page";
import { podcastPackageToCatalogId } from "@/lib/pricing-addon-adapter";

export type WizardFaqContext = {
  category: BookCategoryId;
  packageId?: string;
  catalogId?: PriceItemId | null;
  location?: "modiin" | "mobile" | "";
};

const PODCAST_STUTTER_FAQ: FAQItem = {
  id: "wizard-podcast-stutter",
  question: "מה קורה אם מגמגמים או טועים בהקלטה?",
  answer:
    "אפשר לעצור ולהתחיל מחדש, או לערוך אחר כך. בעריכה מקצועית מסירים הפסקות ארוכות ומגמגומים בולטים - לפי מה שבחרתם בחבילה.",
};

const PODCAST_PREP_FAQ: FAQItem = {
  id: "wizard-podcast-prep",
  question: "האם צריך להכין משהו מראש?",
  answer:
    "מומלץ תסריט או נקודות לשיחה. מבחינת ציוד - אנחנו מביאים הכל. רק תבואו מוכנים לתוכן.",
};

const PODCAST_DELIVERY_AUDIO_FAQ: FAQItem = {
  id: "wizard-podcast-delivery",
  question: "תוך כמה זמן מקבלים את החומרים?",
  answer:
    "רוב הפרקים עוברים עריכה תוך 1-3 ימי עבודה. קבצים מוכנים להעלאה - בדרך כלל תוך 24 שעות עבודה מסיום ההקלטה.",
};

const PODCAST_CAMERAS_FAQ: FAQItem = {
  id: "wizard-podcast-cameras",
  question: "כמה מצלמות יש באולפן?",
  answer:
    "3 מצלמות, תאורה וסאונד מקצועיים. העריכה כוללת גרסה ליוטיוב ואודיו לספוטיפיי.",
};

const PODCAST_VIDEO_DELIVERY_FAQ: FAQItem = {
  id: "wizard-podcast-video-delivery",
  question: "תוך כמה זמן מקבלים את החומרים?",
  answer:
    "עריכת וידאו לוקחת יותר מאודיו בלבד - בדרך כלל 2-4 ימי עבודה, לפי אורך הפרק.",
};

const PODCAST_SOCIAL_PACK_FAQ: FAQItem = {
  id: "wizard-podcast-social-pack",
  question: "מה כלול בחבילת תוכן מלאה?",
  answer:
    "וידאו מלא, 3 רילס עם כתוביות, והעלאה לספוטיפיי ואפל. מתאים למי שרוצה נוכחות שוטפת ברשתות.",
};

const PODCAST_SOCIAL_DELIVERY_FAQ: FAQItem = {
  id: "wizard-podcast-social-delivery",
  question: "תוך כמה זמן מקבלים את החומרים?",
  answer:
    "לוח זמנים לפי היקף הפרק והרילס - נציין בוואטסאפ אחרי ההזמנה.",
};

function mobileFaqsForPackage(packageId: PodcastPackageId): readonly FAQItem[] {
  const base = MOBILE_PODCAST_FAQS.slice(0, 3).map((f) => ({
    id: `wizard-mobile-${f.id}`,
    question: f.question,
    answer: f.answer,
  }));

  if (packageId === "video" || packageId === "social") {
    const videoFaq = MOBILE_PODCAST_FAQS.find((f) => f.id === "video");
    if (videoFaq) {
      return [
        ...base,
        {
          id: `wizard-mobile-${videoFaq.id}`,
          question: videoFaq.question,
          answer: videoFaq.answer,
        },
      ];
    }
  }

  return base;
}

function modiinFaqsForPackage(packageId: PodcastPackageId): readonly FAQItem[] {
  switch (packageId) {
    case "starter":
      return [
        {
          id: PODCAST_HOW_TO_RECORD_FAQ.id,
          question: PODCAST_HOW_TO_RECORD_FAQ.question,
          answer: PODCAST_HOW_TO_RECORD_FAQ.answer,
        },
        PODCAST_PREP_FAQ,
        PODCAST_STUTTER_FAQ,
      ];
    case "audio":
      return [PODCAST_DELIVERY_AUDIO_FAQ, PODCAST_PREP_FAQ, PODCAST_STUTTER_FAQ];
    case "video":
      return [PODCAST_CAMERAS_FAQ, PODCAST_VIDEO_DELIVERY_FAQ, PODCAST_PREP_FAQ];
    case "social":
      return [PODCAST_SOCIAL_PACK_FAQ, PODCAST_SOCIAL_DELIVERY_FAQ, PODCAST_PREP_FAQ];
    default:
      return [];
  }
}

function podcastFaqsForPackage(
  packageId: PodcastPackageId,
  location: WizardFaqContext["location"],
): readonly FAQItem[] {
  if (location === "mobile") return mobileFaqsForPackage(packageId);
  return modiinFaqsForPackage(packageId);
}

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
      "תלוי בחבילה: ברכה קצרה - לרוב ביום-יומיים. שיר מלא - לפי לוח עריכה שמסכמים בוואטסאפ.",
  },
  {
    id: "wizard-studio-stutter",
    question: "מה קורה אם מגמגמים בהקלטה?",
    answer:
      "אפשר לעצור ולחזור על קטע. בעריכה מקצועית מסירים מגמגומים והפסקות - לפי מה שבחרתם במסלול.",
  },
];

export function getWizardStepFaqs(ctx: WizardFaqContext): readonly FAQItem[] {
  if (ctx.category === "podcast" && ctx.packageId) {
    const pkg = ctx.packageId as PodcastPackageId;
    return podcastFaqsForPackage(pkg, ctx.location);
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
    if (pkg) return podcastFaqsForPackage(pkg, ctx.location);
  }
  if (ctx.category === "podcast") {
    return modiinFaqsForPackage("audio");
  }
  return [];
}

export function getWizardFaqsForPodcastPackage(
  packageId: PodcastPackageId | "",
  options?: {
    location?: "modiin" | "mobile" | "";
  },
): readonly FAQItem[] {
  if (!packageId) return [];
  return getWizardStepFaqs({
    category: "podcast",
    packageId,
    catalogId: podcastPackageToCatalogId(packageId),
    location: options?.location ?? "",
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
      "2 אטרקציות ומעלה - מחיר חבילה. 4 אטרקציות ומעלה - מצגת תמונות מתנה. הכל מחושב אוטומטית בסיכום.",
  },
  {
    id: "wizard-events-timing",
    question: "תוך כמה זמן מגיעים לאירוע?",
    answer:
      "תיאום מראש לפי תאריך האירוע. ביום האירוע - הגעה לפי לוח הזמנים שסיכמנו בוואטסאפ.",
  },
  {
    id: "wizard-events-outdoor",
    question: "אפשר בחוץ / באולם ללא מערכת הגברה?",
    answer:
      "רוב האטרקציות דורשות חשמל ומרחק בטיחות. אם אין הגברה - אפשר להוסיף השכרת ציוד מהרשימה.",
  },
];

export function getWizardFaqsForEventsStep(): readonly FAQItem[] {
  return EVENTS_STEP_FAQS;
}
