import type { BookCategoryId } from "@/lib/book-url";
import type { AudioDemoId } from "@/lib/data/audio-demos";
import {
  getPriceFromById,
  getPriceTransparencyById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { resolvePricingBookTarget } from "@/lib/data/pricing-book-map";

export type BookPainId = "noise" | "sibilance" | "flat" | "no_time" | "gear";
export type BookWhereId = "studio" | "mobile";
export type BookEditId = "raw" | "basic" | "full";
export type BookMatcherShowcaseVariant = "remote" | "vocal" | "restoration";

export type BookMatcherOption<T extends string> = {
  id: T;
  label: string;
};

export const BOOK_PAIN_OPTIONS: readonly BookMatcherOption<BookPainId>[] = [
  { id: "noise", label: "רעשי רקע / רשרוש" },
  { id: "sibilance", label: "שורקים (ש / צ)" },
  { id: "flat", label: "סאונד שטוח" },
  { id: "no_time", label: "אין זמן לערוך" },
  { id: "gear", label: "לא יודע להגדיר ציוד" },
];

export const BOOK_WHERE_OPTIONS: readonly BookMatcherOption<BookWhereId>[] = [
  { id: "studio", label: "אולפן מודיעין" },
  { id: "mobile", label: "אולפן נייד" },
];

export const BOOK_EDIT_OPTIONS: readonly BookMatcherOption<BookEditId>[] = [
  { id: "raw", label: "גלם, בלי עריכה" },
  { id: "basic", label: "עריכה בסיסית" },
  { id: "full", label: "מיקס ומאסטרינג" },
];

export type BookMatcherResult = {
  id: string;
  routeId: string;
  categoryId: BookCategoryId;
  catalogId?: PriceItemId;
  ctaKind: "book" | "quote";
  title: string;
  why: string;
  outputHint: string;
  demoId: AudioDemoId;
  showcaseVariant: BookMatcherShowcaseVariant;
  testimonialIndex: number;
};

function catalogCtaKind(catalogId: PriceItemId): "book" | "quote" {
  if (!resolvePricingBookTarget(catalogId)) return "quote";
  if (getPriceFromById(catalogId)) return "quote";
  return getPriceTransparencyById(catalogId).pricingMode === "fixed"
    ? "book"
    : "quote";
}

function result(
  partial: Omit<BookMatcherResult, "ctaKind"> & { ctaKind?: "book" | "quote" },
): BookMatcherResult {
  const ctaKind =
    partial.ctaKind ??
    (partial.catalogId ? catalogCtaKind(partial.catalogId) : "quote");
  return { ...partial, ctaKind };
}

const SONG_PACKAGE = result({
  id: "song-package",
  routeId: "family-gifts",
  categoryId: "studio",
  catalogId: "cover_song",
  title: "שיר מוכן באולפן",
  why: "הקלטה בלי לחץ זמן. מיקס, מאסטר ותיקון זיופים נכנסים במחיר הקטלוג.",
  outputHint: "קובץ מוכן לשיתוף אחרי מיקס",
  demoId: "recording-vocal-polish",
  showcaseVariant: "vocal",
  testimonialIndex: 6,
});

const SINGLE_PRODUCTION = result({
  id: "single-production",
  routeId: "family-gifts",
  categoryId: "studio",
  catalogId: "single_production",
  title: "הפקת סינגל מלא",
  why: "אין זמן לערוך בבית: עיבוד, מיקס ומאסטרינג מסחרי באותו סשן.",
  outputHint: "מוכן לספוטיפיי אחרי מאסטר",
  demoId: "full-production",
  showcaseVariant: "vocal",
  testimonialIndex: 6,
});

const BLESSING = result({
  id: "blessing-recording",
  routeId: "family-gifts",
  categoryId: "studio",
  catalogId: "blessing_recording",
  title: "הקלטת ברכה באולפן",
  why: "הציוד כבר באולפן. לא מגדירים מיקרופון בבית.",
  outputHint: "קובץ מוכן לשיתוף במשפחה",
  demoId: "blessing-mix",
  showcaseVariant: "vocal",
  testimonialIndex: 5,
});

const PODCAST_AUDIO = result({
  id: "podcast-audio",
  routeId: "podcast-content",
  categoryId: "podcast",
  catalogId: "podcast_audio",
  title: "פודקאסט אודיו ערוך",
  why: "הקלטה עד שעה עם עריכה ומסירה. בלי לערוך לבד אחרי הסשן.",
  outputHint: "פרק ליוטיוב ולספוטיפיי",
  demoId: "podcast-zoom-cleanup",
  showcaseVariant: "remote",
  testimonialIndex: 1,
});

const NOISE_FILE = result({
  id: "noise-file",
  routeId: "online-restore",
  categoryId: "online",
  catalogId: "noise_removal_segment",
  title: "ניקוי רעשים לקובץ קיים",
  why: "רעשי רקע ורשרוש יורדים מהקובץ שכבר יש, בלי סשן חדש.",
  outputHint: "מתאים לקובץ קיים, בלי הקלטה באולפן",
  demoId: "podcast-zoom-cleanup",
  showcaseVariant: "remote",
  testimonialIndex: 0,
});

const SIBILANCE_FIX = result({
  id: "sibilance-fix",
  routeId: "online-restore",
  categoryId: "online",
  catalogId: "noise_removal_segment",
  title: "ליטוש שורקים בקובץ קיים",
  why: "שורקי ש' ו-צ' מטופלים בדי-אסר ומיקס, בלי הקלטה מחדש.",
  outputHint: "מתאים לקובץ קיים לפני העלאה",
  demoId: "pitch-correction",
  showcaseVariant: "vocal",
  testimonialIndex: 6,
});

const RAW_QUOTE = result({
  id: "raw-quote",
  routeId: "family-gifts",
  categoryId: "studio",
  title: "הקלטה גלם באולפן",
  why: "יוצאים עם הקלטה בלי מיקס ומאסטרינג. המחיר הסופי לפי אורך הסשן.",
  outputHint: "קובץ גלם, בלי הפצה לספוטיפיי",
  demoId: "recording-vocal-polish",
  showcaseVariant: "vocal",
  testimonialIndex: 5,
  ctaKind: "quote",
});

const MOBILE_QUOTE = result({
  id: "mobile-quote",
  routeId: "podcast-content",
  categoryId: "podcast",
  catalogId: "mobile_podcast_at_home",
  title: "אולפן נייד עד הבית",
  why: "מגיעים עם ציוד. לא מגדירים מיקרופון לבד. המחיר לפי מרחק והיקף.",
  outputHint: "הקלטה אצלכם, מחיר לפי לוגיסטיקה",
  demoId: "podcast-zoom-cleanup",
  showcaseVariant: "remote",
  testimonialIndex: 1,
  ctaKind: "quote",
});

export function needsEditQuestion(pain: BookPainId): boolean {
  return pain === "noise" || pain === "flat";
}

export function matchBookNeed(
  pain: BookPainId,
  where: BookWhereId,
  edit: BookEditId | null,
): readonly BookMatcherResult[] {
  if (where === "mobile") {
    return [MOBILE_QUOTE];
  }

  if (needsEditQuestion(pain) && !edit) {
    return [];
  }

  switch (pain) {
    case "sibilance":
      return [SIBILANCE_FIX];
    case "gear":
      return [BLESSING];
    case "no_time":
      return [SINGLE_PRODUCTION, PODCAST_AUDIO];
    case "noise":
      if (edit === "raw") return [NOISE_FILE, RAW_QUOTE];
      if (edit === "full") return [SINGLE_PRODUCTION, NOISE_FILE];
      return [SONG_PACKAGE, NOISE_FILE];
    case "flat":
      if (edit === "raw") return [RAW_QUOTE];
      if (edit === "full") return [SINGLE_PRODUCTION];
      return [SONG_PACKAGE];
    default:
      return [];
  }
}

export function matcherWhatsAppText(result: BookMatcherResult, painLabel: string): string {
  return `שלום, מה שמפריע בהקלטה: ${painLabel}.\nכיוון מומלץ: ${result.title}.`;
}
