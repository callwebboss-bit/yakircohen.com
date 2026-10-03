/**
 * שאלות FAQ ממוקדות ביטויי חיפוש (AEO), מקור משותף ל-UI ול-JSON-LD.
 * מחירים נמשכים מ-pricing-catalog (מקור אמת יחיד).
 */

import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { getSongOfferView, getSongParticipantsExplanation } from "@/lib/data/song-offer";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildPriceFactorsAnswer } from "@/lib/data/price-factors";
import { buildEventsHubAnswer } from "@/lib/data/blog-knowledge-hubs";

export type AeoFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/* formatFromPriceDual מחזיר "מ-590 ₪ כולל מע״מ (500 ₪ + מע״מ)". כאן הוא נקרא
   "החל מ-...". קודם הפונקציה הזו הסירה ביד את "כרגע:" (WP1). */
/** "כל משתתף נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ), עד 12 בשיר" */
function songParticipantsLine(): string {
  const { withVat, exVat, limit } = getSongParticipantsExplanation();
  return `${withVat} ${exVat}, ${limit}`;
}

function stripDualPrefix(formatted: string): string {
  return `החל ${formatted}`;
}

/**
 * תשובת המחיר של הקלטת השיר נבנית מ-song-offer (הבסיס והתוספות מהקטלוג),
 * כולל מע״מ קודם, כדי שתתאים לטופס בעמוד ולא תתיישן כשמחיר משתנה.
 */
export function buildRecordingSongStudioPriceAnswer(): string {
  const { base, addons } = getSongOfferView();
  const blessing = withVat(getExVat("blessing_recording")).toLocaleString("he-IL");
  const addonLines = addons
    .map((a) => `${a.label} ${a.withVat.toLocaleString("he-IL")} ₪`)
    .join(". ");
  return `הקלטת שיר באולפן: ${base.withVat.toLocaleString("he-IL")} ₪ כולל מע״מ (${base.exVat.toLocaleString("he-IL")} ₪ + מע״מ), כולל הקלטה, מיקס ומאסטר בסשן של שעה. תיקון זיופים לא כלול. תוספות לפי בחירה, כולל מע״מ: ${addonLines}. זמר אחד כלול. ${songParticipantsLine()}. ברכה או אמירה קצרה ${blessing} ₪ כולל מע״מ.`;
}

export const RECORDING_SONG_STUDIO_PRICE_FAQ: AeoFaqItem = {
  id: "song-studio-price",
  question: "כמה עולה להקליט שיר באולפן?",
  answer: buildRecordingSongStudioPriceAnswer(),
};

/**
 * "למה זה עולה ככה", לא "כמה זה עולה".
 *
 * נמדד ב-2.10.2026: 11 מתוך 13 שאלות ה-AEO באתר שאלו "כמה עולה",
 * ואף אחת לא הסבירה מה מזיז את המספר. מבקר שגילה בארבעה מקומות
 * ששיר עולה 990 לא מצא בשום מקום למה שלו יעלה 1,480.
 */
export const STUDIO_PRICE_FACTORS_FAQ: AeoFaqItem = {
  id: "studio-price-factors",
  question: "מה משפיע על מחיר הקלטה באולפן?",
  answer: buildPriceFactorsAnswer(),
};

/** וריאנט מדובר לחיפוש קולי / AEO */
export const RECORDING_SONG_VOICE_FAQ: AeoFaqItem = {
  id: "song-studio-voice",
  question: "כמה עולה לי להקליט שיר לחתונה במודיעין?",
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
    `קובעים תאריך, מגיעים לאולפן במודיעין, מקליטים ומצלמים עד שעה, ומקבלים פרק ערוך ${TIME_CLAIMS.quoteHour}. אין צורך בציוד ביתי - מספיק תוכן או נקודות לדיון. לפני ההגעה: טלפון על שקט, תסריט או שאלות מוכנות.`,
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

/**
 * "איך יודעים שהוא טוב", לא "כמה עולה".
 *
 * DJ_WEDDING_PRICE_FAQ כבר עונה על המחיר. השאלה הזו עונה על הקריטריון,
 * והתשובה נגזרת מהתוכן שהבעלים כתב ב-3.10.2026 ושולב בארבעה פוסטים
 * בבלוג.
 */
export const DJ_HOW_TO_KNOW_FAQ: AeoFaqItem = {
  id: "dj-how-to-know",
  question: "איך יודעים שתקליטן טוב?",
  answer: buildEventsHubAnswer(),
};

export const DJ_WEDDING_PRICE_FAQ: AeoFaqItem = {
  id: "dj-wedding-price",
  question: "כמה עולה DJ לחתונה?",
  answer: buildDjWeddingPriceAnswer(),
};

export const DJ_WEDDING_VOICE_FAQ: AeoFaqItem = {
  id: "dj-wedding-voice",
  question: "כמה עולה לי תקליטן לחתונה במודיעין?",
  answer: buildDjWeddingPriceAnswer(),
};

export function buildVoucherGiftPriceAnswer(): string {
  const half = stripDualPrefix(formatFromPriceDual(getExVat("studio_half_hour")));
  return `שובר מתנה לאולפן או אירוע ${half}. טווח נפוץ לחבילה משודרגת: 2,500 עד 3,200 ₪ לפני מע״מ. המחיר הסופי לפי סוג השירות.`;
}

export const VOUCHER_GIFT_PRICE_FAQ: AeoFaqItem = {
  id: "voucher-gift-price",
  question: "כמה עולה שובר מתנה לאולפן?",
  answer: buildVoucherGiftPriceAnswer(),
};

export const VOUCHER_GIFT_VOICE_FAQ: AeoFaqItem = {
  id: "voucher-gift-voice",
  question: "אפשר לקנות שובר מתנה להקלטה באולפן?",
  answer: buildVoucherGiftPriceAnswer(),
};

export function buildAttractionsEventPriceAnswer(): string {
  const from = stripDualPrefix(
    formatFromPriceDual(getExVat("event_attraction_1")),
  );
  return `אטרקציה בודדת לאירוע ${from}. חבילות עשן וזיקוקים לפי היקף האירוע. מחיר סופי אחרי פרטי אולם ושעות.`;
}

export const ATTRACTIONS_EVENT_PRICE_FAQ: AeoFaqItem = {
  id: "attractions-event-price",
  question: "כמה עולות אטרקציות לחתונה?",
  answer: buildAttractionsEventPriceAnswer(),
};

export const ATTRACTIONS_EVENT_VOICE_FAQ: AeoFaqItem = {
  id: "attractions-event-voice",
  question: "כמה עולה עשן כבד לחתונה?",
  answer: buildAttractionsEventPriceAnswer(),
};

export function buildVocalFixOnlinePriceAnswer(): string {
  const from = stripDualPrefix(formatFromPriceDual(getExVat("ai_voice_enhance")));
  return `תיקון זיופים ושיפור ווקאלי מרחוק ${from} לקובץ קצר. מיקס ומאסטרינג לפי אורך החומר. מסירה בדרך כלל תוך 24 שעות.`;
}

export const VOCAL_FIX_ONLINE_PRICE_FAQ: AeoFaqItem = {
  id: "vocal-fix-online-price",
  question: "כמה עולה תיקון זיופים אונליין?",
  answer: buildVocalFixOnlinePriceAnswer(),
};

/** שאלות AEO מרוכזות לדפי hub ולבדיקות audit */
export const TIER1_AEO_FAQS: readonly AeoFaqItem[] = [
  RECORDING_SONG_STUDIO_PRICE_FAQ,
  RECORDING_SONG_VOICE_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
  PODCAST_RECORDING_PRICE_FAQ,
  DJ_WEDDING_PRICE_FAQ,
  DJ_WEDDING_VOICE_FAQ,
  VOUCHER_GIFT_PRICE_FAQ,
  VOUCHER_GIFT_VOICE_FAQ,
  ATTRACTIONS_EVENT_PRICE_FAQ,
  ATTRACTIONS_EVENT_VOICE_FAQ,
  VOCAL_FIX_ONLINE_PRICE_FAQ,
];
