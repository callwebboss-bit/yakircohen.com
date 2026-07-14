import type { FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import { CENTRAL_FAQ_ITEMS } from "@/lib/data/faq-central";
import type { SmartFormCategoryId } from "@/lib/data/smart-form-matrix";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";

export type SmartFormYoutubeKey = keyof typeof YOUTUBE_SERVICE_EMBED_IDS;
export type SmartFormReturnPotential = "event_based" | "recurring_potential";

export type SmartFormProcessStep = {
  label: string;
};

export type SmartFormEnrichment = {
  prepHref: string;
  prepLabel: string;
  faqIds: readonly string[];
  demoId: AudioDemoId;
  youtubeKey: SmartFormYoutubeKey;
  returnPotential: SmartFormReturnPotential;
  processSteps: readonly SmartFormProcessStep[];
  /** השוואת סטנדרט (לא "הכי טוב") */
  standardsBullets: readonly string[];
  /** תוספת רגשית / משפחתית - לינק קיים */
  familyUpsellHref?: string;
  familyUpsellLabel?: string;
  blogRelatedHref: string;
};

const PROCESS_STUDIO: readonly SmartFormProcessStep[] = [
  { label: "הקלטה" },
  { label: "עריכה" },
  { label: "מאסטרינג" },
  { label: "מוצר ביד" },
];

const PROCESS_EVENTS: readonly SmartFormProcessStep[] = [
  { label: "תיאום" },
  { label: "הפעלה" },
  { label: "רגעי שיא" },
  { label: "סיכום" },
];

const FAQ_BY_ID = Object.fromEntries(
  CENTRAL_FAQ_ITEMS.map((item) => [item.id, item]),
) as Record<string, FaqCtaItem>;

export const SMART_FORM_DELIVERY_NOTE =
  "באותו יום, בזמן שאתם יוצאים מהאולפן עם מוצר ביד - נשלח במייל, בוואטסאפ, בקישור להורדה, ועם אפשרות לקישור צפייה לא רשום ביוטיוב.";

export const SMART_FORM_ENRICHMENT: Record<
  Exclude<SmartFormCategoryId, "unsupported_rehearsal">,
  SmartFormEnrichment
> = {
  family: {
    prepHref: "/blog/studio-session-prep-checklist",
    prepLabel: "איך להגיע לאולפן מוכנים",
    faqIds: ["studio-prep", "studio-gift", "book-online"],
    demoId: "blessing-mix",
    youtubeKey: "blessings-bride-groom",
    returnPotential: "event_based",
    processSteps: PROCESS_STUDIO,
    standardsBullets: [
      "חדר מבודד רעשים וציוד הקלטה מקצועי",
      "עריכה ומיקס בישיבה - לא שליחה הביתה בלי ביקורת",
      "מסירה בפורמט מוכן להשמעה באירוע וברשתות",
    ],
    familyUpsellHref: "/podcast/podcast-with-grandpa",
    familyUpsellLabel: "תוספת זיכרון: ראיון קצר עם סבא/סבתא",
    blogRelatedHref: "/blog/studio-session-prep-checklist",
  },
  pro_single: {
    prepHref: "/blog/original-song-what-to-prepare",
    prepLabel: "איך להגיע לאולפן מוכנים",
    faqIds: ["studio-prep", "remote-only", "book-online"],
    demoId: "full-production",
    youtubeKey: "studio-recording-studio",
    returnPotential: "recurring_potential",
    processSteps: PROCESS_STUDIO,
    standardsBullets: [
      "סטנדרט מיקס ומאסטרינג לשחרור דיגיטלי",
      "תיקוני ביצוע לפי הצורך - בלי קיצורי דרך",
      "גרסאות WAV ו-MP3 לפי היעד שלכם",
    ],
    blogRelatedHref: "/blog/mixing-mastering-explained",
  },
  events: {
    prepHref: "/about/faq#faq-events",
    prepLabel: "שאלות נפוצות לאירועים",
    faqIds: ["effects-coordination", "dj-lead-time", "book-online"],
    demoId: "blessing-mix",
    youtubeKey: "blessings-bar-mitzvah",
    returnPotential: "event_based",
    processSteps: PROCESS_EVENTS,
    standardsBullets: [
      "תיאום מראש עם הדי־ג׳יי והסאונדמן שלכם",
      "תסריט רגעים - מתי האפקטים נכנסים",
      "הפעלה בשטח לפי מה שסוכם",
    ],
    blogRelatedHref: "/about/faq#faq-events",
  },
  podcast: {
    prepHref: "/blog/prepare-voice-podcast-studio",
    prepLabel: "איך להגיע לאולפן מוכנים",
    faqIds: ["podcast-timing", "studio-prep", "remote-only"],
    demoId: "podcast-zoom-cleanup",
    youtubeKey: "studio-hub",
    returnPotential: "recurring_potential",
    processSteps: PROCESS_STUDIO,
    standardsBullets: [
      "אודיו נקי לפרסום - לא רק הקלטה גולמית",
      "עריכה ועקביות עוצמות בין פרקים",
      "מסירה מוכנה לספוטיפיי / יוטיוב",
    ],
    familyUpsellHref: "/podcast/podcast-with-grandpa",
    familyUpsellLabel: "פודקאסט עם סבא - מסלול משפחתי",
    blogRelatedHref: "/blog/prepare-voice-podcast-studio",
  },
  clips: {
    prepHref: "/blog/studio-session-prep-checklist",
    prepLabel: "איך להגיע מוכנים לצילום / קליפ",
    faqIds: ["studio-prep", "book-online"],
    demoId: "full-production",
    youtubeKey: "blessings-video-clip",
    returnPotential: "recurring_potential",
    processSteps: [
      { label: "צילום" },
      { label: "עריכה" },
      { label: "סאונד" },
      { label: "מוצר ביד" },
    ],
    standardsBullets: [
      "עריכה שמחזקת את הסאונד, לא רק חיתוך",
      "יעד מסירה ברור בימי עסקים",
      "פורמט מוכן לרשתות",
    ],
    blogRelatedHref: "/blog/mixing-mastering-explained",
  },
};

export function getSmartFormEnrichment(
  categoryId: SmartFormCategoryId | null,
): SmartFormEnrichment | null {
  if (!categoryId || categoryId === "unsupported_rehearsal") return null;
  return SMART_FORM_ENRICHMENT[categoryId] ?? null;
}

export function getSmartFormFaqs(
  categoryId: SmartFormCategoryId | null,
): FaqCtaItem[] {
  const enrichment = getSmartFormEnrichment(categoryId);
  if (!enrichment) return [];
  return enrichment.faqIds
    .map((id) => FAQ_BY_ID[id])
    .filter((item): item is FaqCtaItem => Boolean(item));
}

export function returnPotentialLabel(
  value: SmartFormReturnPotential,
): string {
  return value === "recurring_potential"
    ? "Recurring-Potential"
    : "Event-Based";
}
