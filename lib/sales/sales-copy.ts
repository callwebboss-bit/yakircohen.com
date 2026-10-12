/**
 * ההודעה הראשונה ללקוח ושורת "רק לוודא" לכל כרטיס בעמדת המכירות.
 *
 * לשמונת השירותים הנפוצים יש נוסח משלהם, בקול של יקיר (הנוסחים שאושרו בתוכנית
 * עמדת המכירות, 6.10.2026). כל מספר בהם נלקח מהכרטיס, שנבנה מהקטלוג, ולכן
 * שינוי מחיר מעדכן את ההודעה בלי לגעת כאן. לכל שאר הכרטיסים יש נוסח כללי:
 * שם, מחיר (עם יחידת החיוב, למשל "לחודש"), שורה אחת על מה שמקבלים (מה שכלול,
 * או ה-context בקטלוג) ושאלת סיום שמתאימה לשירות.
 *
 * כללים: עד 350 תווים, לכל היותר מחיר אחד של שדרוג בהודעה הראשונה, שאלה בסוף,
 * ובלי סימני קריאה, מקפים ארוכים או מרכאות מעוגלות (audit:ai-tells).
 * "רק לוודא" נשלחת כהודעה שנייה, ונבנית ממה שלא כלול. כשהקטלוג משתנה ומה שהיא
 * מניחה כבר לא נכון, נופלים לנוסח הכללי מהשורה הראשונה של "לא כולל". לכל
 * "רק לוודא" יש גם נוסח של עובדה, בלי מחיר, לשורת "סיכמנו" באישור ההזמנה.
 */
import {
  BLESSING_PARTICIPANT_RULES,
  CATALOG_BUNDLES,
  DJ_PER_EVENT_SHORT,
  getPriceById,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_FULL_PRODUCTION_NOTE,
  PODCAST_PARTICIPANT_RULES,
  PODCAST_VIDEO_INCLUDES_NOTE,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import type { MorningLink } from "@/lib/sales/morning-links";
import type { SalesCardDraft } from "@/lib/sales/sales-book";

export const SALES_MESSAGE_MAX = 350;
export const CONFIRM_PREFIX = "רק לוודא: ";

/** מחיר השדרוג, כולל מע״מ קודם לצרכן (headline), או null אם השדרוג כבר לא מקושר */
function addonHeadline(card: SalesCardDraft, id: string): string | null {
  const addon = card.addons.find((a) => a.id === id);
  return addon ? formatPrice(addon.exVat, { from: addon.priceFrom, audience: card.audience }).headline : null;
}

/** הסכום של צירוף מהכרטיס, באותו פורמט (headline) */
function comboHeadline(card: SalesCardDraft, key: string): string | null {
  const combo = card.combos.find((c) => c.key === key);
  return combo ? formatPrice(combo.totalExVat, { from: combo.priceFrom, audience: card.audience }).headline : null;
}

function sentences(parts: readonly (string | null | undefined | false)[]): string {
  return parts.filter((p): p is string => Boolean(p)).join(" ");
}

/* "כל דובר נוסף (תוספת לכל אחד, עד 12)" נשמע טבעי בהודעה בלי הסוגריים */
function plainLine(text: string): string {
  return text
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[.\s]+$/, "")
    .trim();
}

function excludes(card: SalesCardDraft, word: string): boolean {
  return (card.excluded ?? []).some((line) => line.includes(word));
}

/* "a, b או c": פסיקים, ומילת החיבור רק לפני האחרון */
function joinList(parts: readonly string[], word: string): string {
  if (parts.length < 2) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} ${word}${parts[parts.length - 1]}`;
}

/*
 * שורה מהקטלוג כמשפט בהודעה. בקטלוג השורות כתובות כמו בטבלה: "הקלטה + עריכה",
 * "מצגת גדילה AI - 30 תמונות", "טיקטוק/תוכן/מול מצלמה". בוואטסאפ זה נשמע כמו
 * טופס, ולכן: " - " הופך לפסיק, "/" ל"או", ו"+" ל"ו", ברשימה עם פסיקים ומילת
 * החיבור רק לפני האחרון. לפני ספרה או אות לועזית "ו-" עם מקף ("ו-2 הודעות IVR").
 */
function sentenceText(text: string): string {
  const withOr = text
    .replace(/\s+-\s+/g, ", ")
    /* "פתיח/סגיר" בקטלוג הוא שניהם, לא אחד מהם */
    .replace(/פתיח\s*\/\s*סגיר/g, "פתיח וסגיר")
    .replace(/\S+(?:\s*\/\s*\S+)+/g, (run) => joinList(run.split(/\s*\/\s*/), "או "))
    .replace(/\s+/g, " ")
    .trim();
  const parts = withOr.split(/\s+\+\s+/);
  const last = parts[parts.length - 1] ?? "";
  return joinList(parts, /^[\dA-Za-z]/.test(last) ? "ו-" : "ו");
}

/* שם השירות בהודעה, כשהשם בקטלוג לא נשמע טוב במשפט */
const MESSAGE_TITLE: Readonly<Record<string, string>> = {
  mashup_creative_plus: "מאשאפ יצירתי בהפקה מלאה באולפן",
};

/* הסוגריים בשם נשארים: "מאשאפ מזורז (לפי זמינות)" אומר משהו שהלקוח צריך לדעת */
function messageTitle(card: SalesCardDraft): string {
  return MESSAGE_TITLE[card.id] ?? sentenceText(card.title);
}

/*
 * context בקטלוג כשורת פירוט, כשאין לפריט "כולל" משלו. לא נכנס context שמדבר
 * על מחיר, אחוזים או חשבונית (זה לא תיאור של השירות), או שכתוב בקיצור טכני
 * (חץ, 1:1). פריט שה-context שלו לא מתאים להודעה מופיע כאן עם הסיבה.
 */
const CONTEXT_SKIP = /→|1:1|לא מובטח|מחיר|חשבונית|₪|%/;
const NO_CONTEXT_IDS: Readonly<Record<string, string>> = {
  mashup_creative_plus: "השם בהודעה כבר אומר הפקה מלאה באולפן, והשאר מונחים טכניים",
};

/* context שכתוב על הלקוח בגוף שלישי, ובהודעה ממנו נשמע מוזר. בלי מספרים, כדי
   שלא יתיישן מול הקטלוג */
const MESSAGE_DETAIL: Readonly<Record<string, string>> = {
  studio_self_service_hour: "שעת הקלטה בלי עריכה, ואתם לוקחים את הקבצים הגולמיים.",
  /* החלטת הבעלים D63, 7.10.2026: המשפט המלא מהקטלוג, ולא רק השורה הראשונה של "כלול" */
  podcast_video: `${PODCAST_VIDEO_INCLUDES_NOTE}.`,
  full_podcast_production: `${PODCAST_FULL_PRODUCTION_NOTE}.`,
};

function detailSentence(card: SalesCardDraft): string | null {
  if (MESSAGE_DETAIL[card.id]) return MESSAGE_DETAIL[card.id];
  const first = card.included?.[0];
  /* "כולל וידאו" לבד לא אומר כלום. שורה של מילה אחת מפנה מקום ל-context */
  if (first && first.trim().split(/\s+/).length >= 2) return `כולל ${plainLine(sentenceText(first))}.`;
  if (NO_CONTEXT_IDS[card.id]) return null;
  const context = getPriceById(card.id as PriceItemId).context?.trim();
  if (context && !CONTEXT_SKIP.test(context)) return `${plainLine(sentenceText(context))}.`;
  return first ? `כולל ${plainLine(sentenceText(first))}.` : null;
}

/* שירותים שנקבעים ליום מסוים, גם אם הקטגוריה שלהם היא שירות שנמסר בקובץ */
const DATE_BOOKED_IDS = new Set<string>([
  "on_site_half_day",
  "on_site_full_day",
  "employer_onboard_day",
  "workshop_team_2h",
  "workshop_full_day",
]);
const RECORDING_SESSION_IDS = new Set<string>(["audiobook_hour"]);
/* עבודה על קבצים שהלקוח שולח, גם אם הקטגוריה שלה היא פודקאסט */
const DELIVERED_IDS = new Set<string>(["podcast_editing_hour", "podcast_editing_advanced"]);

/** שאלת הסיום: לפי יחידת החיוב, אחר כך לפי השירות, ואחר כך לפי הקטגוריה */
function dateQuestion(card: SalesCardDraft): string {
  const billing = getPriceById(card.id as PriceItemId).scope?.billingLabel;
  if (billing === "חודשי") return "מאיזה חודש תרצו להתחיל?";
  if (billing === "ליום" || DATE_BOOKED_IDS.has(card.id)) return "לאיזה תאריך?";
  if (RECORDING_SESSION_IDS.has(card.id)) return "מתי נוח לכם להקליט?";
  if (DELIVERED_IDS.has(card.id)) return "עד מתי צריך את זה?";
  switch (card.category) {
    case "events":
    case "dj":
    case "photography":
      return "מה תאריך האירוע?";
    case "online":
    case "pro":
    case "addons":
      return "עד מתי צריך את זה?";
    case "academy":
      return "מתי נוח לכם להתחיל?";
    default:
      return "לאיזה תאריך חשבתם?";
  }
}

/* ─── ההודעה הראשונה ─── */

type Builder = (card: SalesCardDraft) => string;

const BUNDLE_IDS = new Set<string>(CATALOG_BUNDLES.filter((b) => b.singleId === "event_attraction_1").map((b) => b.bundleId));

/** החבילה הקטנה של אטרקציות (2), שמוזכרת בהודעה על אטרקציה בודדת */
const SMALLEST_ATTRACTION_BUNDLE = [...CATALOG_BUNDLES]
  .filter((b) => b.singleId === "event_attraction_1")
  .sort((a, b) => a.count - b.count)[0];

const attractionBundleMessage: Builder = (card) =>
  sentences([`היי, ${card.title} לאירוע: ${card.priceLine}.`, buildIncludedSentence(card), buildClosingQuestion(card)]);

/*
 * שורת "מה כלול" ושאלת הסיום של שמונת הנפוצים. ההודעה הראשונה בונה מהן את
 * המשפט השני ואת הסוף, והמחשבון (selection-quote.ts) משתמש באותן שורות בדיוק,
 * כדי שלא יהיו שני נוסחים לאותו שירות.
 */
type Line = (card: SalesCardDraft) => string | null;

const MOBILE_PEOPLE_INCLUDED =
  MOBILE_STUDIO_CHANNEL_RULES.included === 1 ? "לאדם אחד" : `ל-${MOBILE_STUDIO_CHANNEL_RULES.included} אנשים`;

const ATTRACTION_INCLUDED = "כל אטרקציה עם הפעלה אחת ותפעול במקום.";

const INCLUDED_BY_ID: Readonly<Record<string, Line>> = {
  song_recording: () => "סשן של שעה עם הקלטה, מיקס ומאסטר, והשיר אצלכם בסוף הסשן.",
  blessing_recording: () => "בלי הגבלת זמן, עם הנחיה, עריכה ומוזיקת רקע, עד שזה יוצא מדויק.",
  studio_remote: () =>
    "שולחים לי הקלטה מהטלפון בוואטסאפ, ואני מנקה רעשים, עורך, מוסיף מוזיקת רקע ומחזיר קובץ מוכן.",
  podcast_audio: () =>
    `הקלטה עד שעה, עריכת ההקלטה וחלל האולפן, ו-${PODCAST_PARTICIPANT_RULES.included} משתתפים כלולים.`,
  mobile_podcast_at_home: () =>
    `מגיעים עם כל הציוד, התאורה והצוות. בבית או במשרד, פרק אודיו מוגמר ${MOBILE_PEOPLE_INCLUDED} כבר כלול במחיר.`,
  dj_premium: () => `${DJ_PER_EVENT_SHORT}, ומגיעים עד שהאירוע נגמר.`,
  dj_yakir_personal: () => `${DJ_PER_EVENT_SHORT}, ואני נשאר עד שהאירוע נגמר.`,
  event_attraction_1: () => ATTRACTION_INCLUDED,
  event_sound_rental: (card) => {
    /* הציוד והקהל מהקטלוג (scope.includes ו-suitedFor), כדי שלא יהיה כאן נוסח שני */
    const item = getPriceById(card.id as PriceItemId);
    const includes = item.scope?.includes;
    const suited = item.suitedFor;
    return includes ? `${plainLine(includes)}${suited ? `, ל${plainLine(suited)}` : ""}.` : null;
  },
};

const QUESTION_BY_ID: Readonly<Record<string, string>> = {
  song_recording: "לאיזה תאריך חשבתם?",
  blessing_recording: "לאיזה תאריך?",
  studio_remote: "עד איזה תאריך צריך את הקובץ?",
  podcast_audio: "לאיזה תאריך חשבתם?",
  mobile_podcast_at_home: "לאיזה תאריך, ובאיזו עיר?",
  dj_premium: "מה התאריך, ובאיזה אזור האולם?",
  dj_yakir_personal: "מה התאריך, ובאיזה אזור האולם?",
  event_attraction_1: "לאיזה תאריך האירוע?",
  event_sound_rental: "לאיזה תאריך?",
};

/** שורה אחת על מה שמקבלים: הנוסח של הנפוצים, או מה שכלול, או ה-context בקטלוג */
export function buildIncludedSentence(card: SalesCardDraft): string | null {
  const specific = INCLUDED_BY_ID[card.id] ?? (BUNDLE_IDS.has(card.id) ? () => ATTRACTION_INCLUDED : null);
  return specific ? specific(card) : detailSentence(card);
}

/** שאלת הסיום של ההודעה: הנוסח של הנפוצים, או לפי השירות והקטגוריה */
export function buildClosingQuestion(card: SalesCardDraft): string {
  return QUESTION_BY_ID[card.id] ?? (BUNDLE_IDS.has(card.id) ? "לאיזה תאריך האירוע?" : dateQuestion(card));
}

const MESSAGE_BY_ID: Readonly<Record<string, Builder>> = {
  song_recording: (card) => {
    const clip = addonHeadline(card, "studio_session_clip_edited");
    return sentences([
      `היי, הקלטת שיר באולפן במודיעין: ${card.priceLine}.`,
      buildIncludedSentence(card),
      clip && `רוצים גם קליפ ערוך מהסשן? עוד ${clip}.`,
      buildClosingQuestion(card),
    ]);
  },
  blessing_recording: (card) => {
    const rewrite = addonHeadline(card, "blessing_text_rewrite");
    return sentences([
      `היי, ברכה או דרשה באולפן: ${card.priceLine}.`,
      buildIncludedSentence(card),
      rewrite && `אם צריך לכתוב את הטקסט מחדש, כותבים אותו יחד ב-${rewrite}.`,
      buildClosingQuestion(card),
    ]);
  },
  studio_remote: (card) => {
    const extra = addonHeadline(card, BLESSING_PARTICIPANT_RULES.extraId);
    return sentences([
      `היי, הקלטה מרחוק: ${card.priceLine}.`,
      buildIncludedSentence(card),
      extra && `עוד דובר באותה הקלטה: ${extra}.`,
      buildClosingQuestion(card),
    ]);
  },
  podcast_audio: (card) => {
    const extra = addonHeadline(card, PODCAST_PARTICIPANT_RULES.extraId);
    return sentences([
      `היי, פרק פודקאסט אודיו באולפן במודיעין: ${card.priceLine}.`,
      buildIncludedSentence(card),
      extra && `כל משתתף נוסף: ${extra}.`,
      buildClosingQuestion(card),
    ]);
  },
  mobile_podcast_at_home: (card) => {
    const extra = addonHeadline(card, MOBILE_STUDIO_CHANNEL_RULES.channelId);
    return sentences([
      `היי, אולפן נייד אליכם: ${card.priceLine}.`,
      buildIncludedSentence(card),
      extra && `כל אדם נוסף: ${extra}.`,
      buildClosingQuestion(card),
    ]);
  },
  dj_premium: (card) =>
    sentences([
      `היי, DJ מנוסה מהצוות: ${card.priceLine}.`,
      buildIncludedSentence(card),
      "אם מוסיפים אטרקציות, DJ עם אטרקציות מגיע בהנחה לפי האולם והאירוע.",
      buildClosingQuestion(card),
    ]),
  /* יקיר שולח מהטלפון שלו, ולכן בגוף ראשון, כמו ההקלטה מרחוק והתשובות המהירות */
  dj_yakir_personal: (card) =>
    sentences([
      `היי, אני אישית על הקונסולה: ${card.priceLine}.`,
      buildIncludedSentence(card),
      buildClosingQuestion(card),
    ]),
  event_attraction_1: (card) => {
    const pack = SMALLEST_ATTRACTION_BUNDLE && comboHeadline(card, SMALLEST_ATTRACTION_BUNDLE.bundleId);
    return sentences([
      `היי, אטרקציה לאירוע: ${card.priceLine}, עם הפעלה אחת ותפעול במקום.`,
      pack && `אם לוקחים ${SMALLEST_ATTRACTION_BUNDLE.count} אטרקציות, החבילה ${pack}.`,
      buildClosingQuestion(card),
    ]);
  },
  event_sound_rental: (card) =>
    sentences([`היי, השכרת הגברה לאירוע: ${card.priceLine}.`, buildIncludedSentence(card), buildClosingQuestion(card)]),
};

/* שם, מחיר, שורה אחת על מה שמקבלים, ושאלה שמתאימה לשירות */
function genericMessage(card: SalesCardDraft): string {
  const intro = `היי, ${messageTitle(card)}: ${card.priceLine}.`;
  const question = dateQuestion(card);
  const full = sentences([intro, detailSentence(card), question]);
  return full.length <= SALES_MESSAGE_MAX ? full : sentences([intro, question]);
}

/** ההודעה הראשונה ללקוח: מחיר, מה כלול, שדרוג אחד לכל היותר ושאלה */
export function buildCardMessage(card: SalesCardDraft): string {
  const builder = MESSAGE_BY_ID[card.id] ?? (BUNDLE_IDS.has(card.id) ? attractionBundleMessage : genericMessage);
  return builder(card);
}

/* ─── רק לוודא, וסיכמנו ─── */

/*
 * כל "רק לוודא" בא בזוג: השאלה ללקוח (ask), ואותו דבר כעובדה (agreed) לשורת
 * "סיכמנו" באישור ההזמנה. השאלה יכולה לדבר על "המחיר הזה", אבל באישור אין
 * מחיר (החלטת הבעלים 6.10.2026), ולכן agreed נכתב בלי מחיר ובלי שאלה.
 */
type Confirm = { ask: string; agreed: string };
type ConfirmBuilder = (card: SalesCardDraft) => Confirm | null;

const CONFIRM_BY_ID: Readonly<Record<string, ConfirmBuilder>> = {
  song_recording: (card) =>
    excludes(card, "תיקון זיופים")
      ? {
          ask: "תיקון זיופים לא כלול, אז השיר יוצא בדיוק כמו ששרתם. מתאים לכם?",
          agreed: "בלי תיקון זיופים, השיר יוצא כמו ששרתם",
        }
      : null,
  blessing_recording: () =>
    BLESSING_PARTICIPANT_RULES.included === 1
      ? { ask: "המחיר הוא לדובר אחד. רק אחד מדבר בברכה?", agreed: "דובר אחד" }
      : null,
  studio_remote: (card) =>
    excludes(card, "הנחיה")
      ? {
          ask: "מרחוק אין הנחיה בזמן ההקלטה ואין את האקוסטיקה של האולפן. מתאים לכם ככה?",
          agreed: "הקלטה מהטלפון, בלי הנחיה בזמן ההקלטה",
        }
      : null,
  podcast_audio: (card) =>
    excludes(card, "וידאו")
      ? { ask: "זה פרק אודיו, בלי וידאו. אודיו מספיק לכם?", agreed: "פרק אודיו, בלי וידאו" }
      : null,
  mobile_podcast_at_home: (card) =>
    excludes(card, "נסיעה")
      ? {
          ask: "המחיר הזה לאזור המרכז, ומחוץ למרכז יש תוספת הגעה. אתם באזור המרכז?",
          agreed: "ההקלטה באזור המרכז",
        }
      : null,
  dj_premium: (card) =>
    excludes(card, "אפקטים")
      ? { ask: "אפקטים לא כלולים במחיר הזה. מספיק לכם DJ בלי אפקטים?", agreed: "בלי אפקטים" }
      : null,
  dj_yakir_personal: (card) =>
    excludes(card, "אפקטים")
      ? { ask: "אפקטים לא כלולים במחיר הזה. מספיק לכם בלי אפקטים?", agreed: "בלי אפקטים" }
      : null,
  event_attraction_1: (card) =>
    excludes(card, "הפעלה")
      ? {
          ask: "המחיר כולל הפעלה אחת, בכניסה או בסלואו. מספיקה לכם הפעלה אחת?",
          agreed: "הפעלה אחת, בכניסה או בסלואו",
        }
      : null,
  event_sound_rental: (card) =>
    excludes(card, "טכנאי")
      ? {
          ask: "אנחנו מקימים, מכוונים ומפרקים, בלי טכנאי שנשאר לכל האירוע. מתאים לכם ככה?",
          agreed: "הקמה, כיוון ופירוק, בלי טכנאי שנשאר לכל האירוע",
        }
      : null,
  /* שלושה שבהם השורה הכללית ("זה לא כולל X") יצאה עקומה */
  event_photo_hourly: (card) =>
    excludes(card, "עריכת עומק")
      ? {
          ask: "עריכה בסיסית כלולה, עריכת עומק לא. מספיקה לכם עריכה בסיסית?",
          agreed: "עריכה בסיסית, בלי עריכת עומק",
        }
      : null,
  /* האורך נלקח מהשורה בקטלוג ("קבצים ארוכים מעבר ל-5 דקות"), לא נכתב כאן */
  damaged_recording_rescue: (card) => {
    const limit = (card.excluded ?? []).map((l) => /קבצים ארוכים מעבר ל-?(.+)$/.exec(l)?.[1]?.trim()).find(Boolean);
    return limit
      ? { ask: `המחיר לקטע של עד ${limit}. ההקלטה שלכם באורך הזה?`, agreed: `קטע של עד ${limit}` }
      : null;
  },
  ai_voice_restore: (card) =>
    excludes(card, "קבצים מרובים")
      ? { ask: "המחיר לקובץ אחד. מדובר בקובץ אחד?", agreed: "קובץ אחד" }
      : null,
};

function bundleConfirm(card: SalesCardDraft): Confirm | null {
  return excludes(card, "הפעלות")
    ? {
        ask: "כל אטרקציה בחבילה כוללת הפעלה אחת. מספיקה לכם הפעלה אחת לכל אטרקציה?",
        agreed: "הפעלה אחת לכל אטרקציה",
      }
    : null;
}

function genericConfirm(card: SalesCardDraft): Confirm | null {
  const first = card.excluded?.[0];
  if (!first) return null;
  const text = plainLine(first);
  return { ask: `זה לא כולל ${text}. מתאים לכם?`, agreed: `בלי ${text}` };
}

function confirmFor(card: SalesCardDraft): Confirm | null {
  const specific = CONFIRM_BY_ID[card.id] ?? (BUNDLE_IDS.has(card.id) ? bundleConfirm : null);
  return specific?.(card) ?? genericConfirm(card);
}

/** "רק לוודא: ..." ממה שלא כלול, או null אם אין לכרטיס פירוט של מה לא כלול */
export function buildCardConfirmLine(card: SalesCardDraft): string | null {
  const confirm = confirmFor(card);
  return confirm ? `${CONFIRM_PREFIX}${confirm.ask}` : null;
}

/** ברירת המחדל לשורת "סיכמנו" באישור ההזמנה: אותה נקודה כעובדה, בלי מחיר */
export function buildCardAgreedLine(card: SalesCardDraft): string | null {
  return confirmFor(card)?.agreed ?? null;
}

/* ─── לינק לתשלום ─── */

/*
 * הלינק הוא ההודעה השלישית (אחרי ההודעה ו"רק לוודא"), ולכן ברירת המחדל קצרה:
 * סכום ולינק, ושורת ביטחון אחת. הסכום תמיד כולל מע״מ, כי זה מה שהלינק גובה
 * (גם לכרטיס לעסקים). "החשבונית מגיעה למייל" הוא מה שמורנינג עושה בלינק
 * לתשלום (מדריך "יצירת לינק לתשלום"). הגרסה המלאה מוסיפה "כולל / לא כולל"
 * מהכרטיס, והלינק תמיד נשאר גם כשחותכים.
 */
const PAY_AFTER = "אחרי התשלום החשבונית מגיעה למייל אוטומטית.";
const INCLUDED_MAX = 3;
const EXCLUDED_MAX = 2;

/* "590 ₪", כמו headline ב-pricing-display.ts (הסימן אחרי המספר), ועם אגורות רק כשצריך */
export function nisText(amount: number): string {
  const text = Number.isInteger(amount)
    ? amount.toLocaleString("he-IL")
    : amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${text} ₪`;
}

function inclVatText(card: Pick<SalesCardDraft, "inclVat">): string {
  return `${nisText(card.inclVat)} כולל מע״מ`;
}

function payFirstLine(card: SalesCardDraft, link: MorningLink): string {
  const title = messageTitle(card);
  if (link.kind === "fixed") return `לתשלום על ${title}, ${inclVatText(card)}: ${link.url}`;
  if (card.priceFrom) return `לתשלום על ${title}, בסכום שסיכמנו: ${link.url}`;
  return `לתשלום על ${title}, ${inclVatText(card)}, בלינק בוחרים את הסכום הזה: ${link.url}`;
}

/** ההודעה הקצרה (ברירת מחדל): סכום ולינק, ושורת ביטחון */
export function buildPaymentMessage(card: SalesCardDraft, link: MorningLink): string {
  if (link.kind === "deposit") return buildDepositMessage(link);
  return `${payFirstLine(card, link)}\n${PAY_AFTER}`;
}

/** שורת "כולל a, b, c. לא כולל d, e." מהכרטיס, או null כשאין פירוט */
export function includedLine(card: SalesCardDraft, { withExcluded = true } = {}): string | null {
  const inc = (card.included ?? []).slice(0, INCLUDED_MAX).map(plainLine).filter(Boolean);
  const exc = withExcluded ? (card.excluded ?? []).slice(0, EXCLUDED_MAX).map(plainLine).filter(Boolean) : [];
  const parts = [inc.length ? `כולל ${inc.join(", ")}.` : null, exc.length ? `לא כולל ${exc.join(", ")}.` : null];
  const text = parts.filter(Boolean).join(" ");
  return text || null;
}

/**
 * ההודעה המלאה: + "כולל / לא כולל". מעל 350 תווים משמיטים קודם את "לא כולל",
 * אחר כך את "כולל"; הלינק תמיד נשאר.
 */
export function buildPaymentMessageFull(card: SalesCardDraft, link: MorningLink): string {
  const first = payFirstLine(card, link);
  for (const detail of [includedLine(card), includedLine(card, { withExcluded: false }), null]) {
    const text = [first, detail, PAY_AFTER].filter(Boolean).join("\n");
    if (text.length <= SALES_MESSAGE_MAX) return text;
  }
  return first;
}

/** ההודעה הקצרה + "או בהעברה: ...". הטקסט של ההעברה הוא של יקיר (morning-links.json), בלי מספרים בקוד. */
export function buildPaymentWithBankMessage(card: SalesCardDraft, link: MorningLink, bankLine: string): string {
  return `${payFirstLine(card, link)}\nאו בהעברה: ${bankLine.trim()}\n${PAY_AFTER}`;
}

/** כשהלקוח אומר שהתשלום לא עבר */
export function buildPaymentFailedMessage(link: MorningLink, bankLine: string | null): string {
  const alt = bankLine?.trim() ? ", או בהעברה" : "";
  return `קורה לפעמים. נסו שוב בלינק הזה${alt}, ואני מאשר מיד: ${link.url}`;
}

/** הודעת מקדמה. רק באישור יקיר (D6: הגעה באותו יום דורשת מקדמה של 200 ש״ח; רוב הלקוחות משלמים את השירות המלא). */
export function buildDepositMessage(link: MorningLink): string {
  const amount = link.inclVat == null ? "מקדמה" : `מקדמה של ${nisText(link.inclVat)}`;
  return `${amount} לשמירת התאריך, היתרה לפי ההצעה: ${link.url}\n${PAY_AFTER}`;
}

/**
 * השדות ליצירת לינק קבוע במורנינג (תשלומים > לינקים לתשלום > לינק לעסקה רגילה),
 * להעתקה והדבקה. התיאור קצר ומפנה לתנאים באתר (החלטת הבעלים 12.10: החשבונית
 * היא מסמך, הרשימה המלאה של כלול/לא כלול נשארת ב-/whats-included).
 */
export function buildMorningLinkFields(card: SalesCardDraft): string {
  return [
    `שם הלינק: ${card.title}`,
    `מחיר: ${nisText(card.inclVat)} כולל מע״מ (${nisText(card.exVat)} לפני מע״מ)`,
    `תיאור: ${card.title}. התנאים: yakircohen.com/whats-included`,
    `קוד פריט: ${card.id}`,
    `אחרי היצירה: npm run morning:link -- --id ${card.id} --url <הלינק>`,
  ].join("\n");
}
