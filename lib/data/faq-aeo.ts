/**
 * שאלות FAQ ממוקדות ביטויי חיפוש (AEO), מקור משותף ל-UI ול-JSON-LD.
 * מחירים נמשכים מ-pricing-catalog (מקור אמת יחיד).
 */

import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

export type AeoFaqItem = {
  id: string;
  question: string;
  answer: string;
};

function stripDualPrefix(formatted: string): string {
  return formatted.replace(/^כרגע: /, "החל מ-");
}

export function buildRecordingSongStudioPriceAnswer(): string {
  const blessing = stripDualPrefix(
    formatFromPriceDual(getExVat("blessing_recording")),
  );
  const cover = stripDualPrefix(formatFromPriceDual(getExVat("cover_song")));
  const package_ = stripDualPrefix(
    formatFromPriceDual(getExVat("song_package")),
  );
  return `ברכה או אמירה קצרה ${blessing}. שיר על פלייבק קיים ${cover}. חבילת שיר מתנה ${package_}. המחיר הסופי תלוי במורכבות ההפקה - מחירון מלא בעמוד זה.`;
}

export const RECORDING_SONG_STUDIO_PRICE_FAQ: AeoFaqItem = {
  id: "song-studio-price",
  question: "כמה עולה להקליט שיר באולפן?",
  answer: buildRecordingSongStudioPriceAnswer(),
};

export function buildPodcastStudioHourPriceAnswer(): string {
  const half = stripDualPrefix(formatFromPriceDual(getExVat("studio_half_hour")));
  const hour = stripDualPrefix(formatFromPriceDual(getExVat("studio_hour")));
  return `חצי שעה באולפן ${half}. שעה מלאה ${hour}. המחיר כולל ליווי טכני. עריכה מלאה או הפקת וידאו - בתוספת לפי חבילה.`;
}

export const PODCAST_STUDIO_MODIIN_PRICE_FAQ: AeoFaqItem = {
  id: "podcast-studio-modiin-price",
  question: "כמה עולה השכרת סטודיו לפודקאסט במודיעין?",
  answer: buildPodcastStudioHourPriceAnswer(),
};

export function buildPodcastRecordingPriceAnswer(): string {
  const audio = stripDualPrefix(formatFromPriceDual(getExVat("podcast_audio")));
  const video = stripDualPrefix(formatFromPriceDual(getExVat("podcast_video")));
  const full = stripDualPrefix(
    formatFromPriceDual(getExVat("full_podcast_production")),
  );
  return `פודקאסט אודיו ${audio}. פודקאסט וידאו ${video}. הפקה מלאה (צילום + הקלטה + עריכה) ${full}. המחיר תלוי בפורמט ובמשך ההקלטה.`;
}

export const PODCAST_HOW_TO_RECORD_FAQ: AeoFaqItem = {
  id: "how-to-record-podcast",
  question: "איך להקליט פודקאסט?",
  answer:
    `קובעים תאריך, מגיעים לאולפן במודיעין, מקליטים ומצלמים עד שעה, ומקבלים פרק ערוך ${TIME_CLAIMS.quote24h}. אין צורך בציוד ביתי - מספיק תוכן או נקודות לדיון. לפני ההגעה: טלפון על שקט, תסריט או שאלות מוכנות.`,
};

export const PODCAST_RECORDING_PRICE_FAQ: AeoFaqItem = {
  id: "podcast-recording-price",
  question: "כמה עולה להקליט פודקאסט?",
  answer: buildPodcastRecordingPriceAnswer(),
};

export function buildPodcastEditingPriceAnswer(): string {
  const perHour = stripDualPrefix(
    formatFromPriceDual(getExVat("podcast_editing_hour")),
  );
  return `עריכת פודקאסט עולה ${perHour} לכל שעת חומר גולמי. כולל ניקוי רעשים, סנכרון ונורמליזציה. פרק מוכן לספוטיפיי ויוטיוב - לפי היקף החומר.`;
}

export const PODCAST_EDITING_PRICE_FAQ: AeoFaqItem = {
  id: "podcast-editing-price",
  question: "כמה עולה עריכת פודקאסט?",
  answer: buildPodcastEditingPriceAnswer(),
};

export function buildDjWeddingPriceAnswer(): string {
  const premium = stripDualPrefix(formatFromPriceDual(getExVat("dj_premium")));
  const yakir = stripDualPrefix(
    formatFromPriceDual(getExVat("dj_yakir_personal")),
  );
  return `תקליטן מהצוות ${premium} (כ-4 שעות). יקיר כהן אישית על הקונסולה ${yakir}. המחיר תלוי באולם, שעות ואטרקציות - הצעה מפורטת לפני אישור.`;
}

export const DJ_WEDDING_PRICE_FAQ: AeoFaqItem = {
  id: "dj-wedding-price",
  question: "כמה עולה DJ לחתונה?",
  answer: buildDjWeddingPriceAnswer(),
};
