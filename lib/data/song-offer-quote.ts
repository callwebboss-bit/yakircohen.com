/**
 * הצד הקל של הצעת השיר, בלי הקטלוג. נטען בדפדפן.
 *
 * השרת (song-offer.ts) קורא את המחירים מהקטלוג ושולח לטופס נתונים פשוטים
 * (SongQuoteData). כל החישוב, הודעת הוואטסאפ והקישורים נבנים כאן, באותה
 * פונקציה בשרת ובדפדפן (composeSongOfferQuote), ולכן בדפדפן לא מחשבים מחיר
 * בדרך אחרת. כך גם מספר המשתתפים (1 עד 12) לא מכפיל את כמות הנתונים ב-HTML.
 *
 * כלל המע״מ: הסכום הכולל הוא withVat של הסכום לפני מע״מ, כמו בחשבונית.
 * תוספת המשתתפים היא שורה אחת שהמע״מ שלה מחושב על כל התוספת ולא על כל זמר.
 * מחירי הבסיס והתוספות מתחלקים במע״מ בלי שארית, ולכן סכום השורות שווה תמיד
 * לסכום. בדיקה ב-song-offer.test.ts מוודאת את זה לכל שילוב ולכל מספר משתתפים.
 */
import type { LeadEmailPayload } from "@/lib/lead-email-notify";
import type { SongAddonId } from "@/lib/data/song-offer-aliases";
import { sanitizeLeadText } from "@/lib/form-validation";
import { buildPersonBreakdown, EXTRA_PERSON_COST_NOTE, type PersonBreakdown } from "@/lib/data/participant-cost-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export const SONG_OFFER_CALLBACK_FORM_ID = "song_offer_callback";
export const SONG_OFFER_SECTION_ID = "song-offer";
export const SONG_OFFER_PAGE_PATH = "/studio/recording-song-modiin";
/** שם הפרמטר בכתובת שזוכר את הבחירה, ?addons=id,id */
export const SONG_ADDONS_PARAM = "addons";
/** שם הפרמטר בכתובת שזוכר את מספר המשתתפים, ?participants=4 */
export const SONG_PARTICIPANTS_PARAM = "participants";
/** מזהה שורת תוספת המשתתפים (לא מזהה קטלוג, היא מחברת שני פריטים) */
export const SONG_PARTICIPANTS_LINE_ID = "song_participants";
/** אורך מקסימלי להערה החופשית של הלקוח, בהודעה ובמייל */
export const SONG_NOTES_MAX = 500;

export type SongPriceLine = {
  id: string;
  label: string;
  exVat: number;
  withVat: number;
  /** פירוט לפי משתתף, רק בשורת המשתתפים: "590 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 ₪ + מע״מ)" */
  detail?: string;
};

/** מה שצריך לשורות "מה בחרתי" ולסכום */
export type SongOfferTotals = {
  lines: readonly SongPriceLine[];
  totalExVat: number;
  totalWithVat: number;
};

/** שילוב אחד מחושב. נתונים פשוטים בלבד, כדי לעבור כ-props. */
export type SongOfferQuote = SongOfferTotals & {
  addonIds: SongAddonId[];
  participants: number;
  /** "1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)" */
  totalLine: string;
  /** ההודעה ללקוח בלי התג */
  messageText: string;
  ycTag: string;
  /** קישור wa.me מוכן */
  waHref: string;
  /** קישור חזרה לטופס עם הבחירה */
  offerHref: string;
  /** ההערה החופשית של הלקוח אחרי ניקוי, או מחרוזת ריקה */
  notes: string;
  /** הלקוח סימן בקשה מיוחדת, מעבר למה שבטופס, ומחכה להצעת מחיר. לא משנה את הסכום. */
  specialRequest: boolean;
};

/** מפתח קבוע לשילוב. הבחירה כבר מנורמלת, ולכן הסדר הוא סדר הקטלוג. */
export function songAddonKey(ids: readonly string[]): string {
  return ids.length ? ids.join(",") : "base";
}

export type SongAddonRule = { id: SongAddonId; requires: SongAddonId | null };

/**
 * ניקוי בחירה לפי רשימת התוספות שהשרת שלח (באותו סדר כמו normalizeSongAddons
 * ב-song-offer.ts): מתעלם ממזהים לא מוכרים, שומר על סדר הקטלוג, ומוריד
 * תוספת שהתנאי שלה לא נבחר. לא מוסיף תוספת בשקט.
 */
export function normalizeSongSelection(
  ids: readonly string[],
  rules: readonly SongAddonRule[],
): SongAddonId[] {
  const picked = new Set(ids);
  const ordered = rules.filter((rule) => picked.has(rule.id));
  const chosen = new Set(ordered.map((rule) => rule.id));
  return ordered
    .filter((rule) => rule.requires == null || chosen.has(rule.requires))
    .map((rule) => rule.id);
}

/* מחיר לפני מע״מ יכול להיות לא שלם: 41.5 לפני מע״מ הוא בדיוק 49 ₪ כולל מע״מ (שמירה
   קבועה בענן, 6.10.2026). אז מציגים שתי ספרות אחרי הנקודה, "1,291.50", ולא "1,291.5".
   מחיר שלם נשאר כמו שהיה. */
export function nis(amount: number): string {
  const text = Number.isInteger(amount)
    ? amount.toLocaleString("he-IL")
    : amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${text} ₪`;
}

/* ─── משתתפים ─── */

/**
 * כללי המשתתפים בשיר, מהקטלוג (SONG_PARTICIPANT_RULES ב-pricing-catalog.ts):
 * זמר אחד כלול, וכל משתתף נוסף extraExVat, עד max בשיר (החלטות 3.10.2026,
 * סבב רביעי: אין יותר מחיר נפרד לזמר השני).
 */
export type SongParticipantRules = {
  included: number;
  max: number;
  extraExVat: number;
};

/** מספר משתתפים תקין: שלם, בין המספר הכלול למקסימום. קלט לא מובן נותן את המינימום. */
export function clampSongParticipants(
  value: number | string | null | undefined,
  rules: Pick<SongParticipantRules, "included" | "max">,
): number {
  const n = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (n == null || !Number.isFinite(n)) return rules.included;
  return Math.min(rules.max, Math.max(rules.included, Math.trunc(n)));
}

/** תוספת המשתתפים לפני מע״מ. 1 זמר: 0. 4 זמרים: 3 × 99. */
export function songParticipantsSurchargeExVat(
  participants: number,
  rules: SongParticipantRules,
): number {
  const n = clampSongParticipants(participants, rules);
  const extra = n - rules.included;
  if (extra <= 0) return 0;
  return extra * rules.extraExVat;
}

/** התוספת לכל משתתף מעבר לכלול, לפי הסדר. 4 זמרים: [99, 99, 99]. */
export function songParticipantsExtras(participants: number, rules: SongParticipantRules): number[] {
  const n = clampSongParticipants(participants, rules);
  const extra = n - rules.included;
  if (extra <= 0) return [];
  return Array.from({ length: extra }, () => rules.extraExVat);
}

/**
 * הפירוט לפי משתתף, כולל מע״מ קודם:
 * "4 משתתפים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)".
 * החלק הראשון הוא בסיס השיר, שכולל זמר אחד.
 */
export function songParticipantsBreakdown(
  participants: number,
  rules: SongParticipantRules,
  baseExVat: number,
  vatRate: number,
): PersonBreakdown {
  const count = clampSongParticipants(participants, rules);
  return buildPersonBreakdown({
    count,
    baseExVat,
    extrasExVat: songParticipantsExtras(count, rules),
    vatRate,
  });
}

function roundWithVat(exVat: number, vatRate: number): number {
  return Math.round(exVat * (1 + vatRate));
}

export type SongParticipantsExplanation = {
  /** "כל משתתף נוסף +117 ₪ כולל מע״מ" */
  withVat: string;
  /** "(99 ₪ + מע״מ)" */
  exVat: string;
  /** "עד 12 בשיר" */
  limit: string;
};

/** חלקי שורת ההסבר מתחת לבורר */
export function songParticipantsExplanationParts(
  rules: SongParticipantRules,
  vatRate: number,
): SongParticipantsExplanation {
  return {
    withVat: `כל משתתף נוסף +${nis(roundWithVat(rules.extraExVat, vatRate))} כולל מע״מ`,
    exVat: `(${nis(rules.extraExVat)} + מע״מ)`,
    limit: `עד ${rules.max} בשיר`,
  };
}

/** "כל משתתף נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בשיר" */
export function songParticipantsExplanation(rules: SongParticipantRules, vatRate: number): string {
  const { withVat, exVat, limit } = songParticipantsExplanationParts(rules, vatRate);
  return `${withVat} ${exVat} · ${limit}`;
}

/* ─── חישוב, הודעה וקישורים ─── */

export type SongQuoteItem = {
  id: string;
  /** השם בשורה של ההודעה */
  label: string;
  exVat: number;
};

/** כל מה שצריך כדי לחשב הצעה, בלי הקטלוג. השרת בונה אותו ב-getSongQuoteData. */
export type SongQuoteData = {
  base: SongQuoteItem;
  addons: readonly (SongQuoteItem & { id: SongAddonId; requires: SongAddonId | null })[];
  participants: SongParticipantRules;
  vatRate: number;
};

export type SongQuoteOptions = {
  /** נתיב העמוד, נכנס רק לתג [YC:] */
  source: string;
  giftMode?: boolean;
  utmCampaign?: string;
  /* החלטת הבעלים על התג בהודעת הלקוח עדיין פתוחה (שאלה 6), ולכן כמו בשאר
     האתר אחרי שלב 1 הוא נשאר כברירת מחדל */
  includeYcTag?: boolean;
  /** נתיב הטופס לקישור החזרה, ברירת מחדל עמוד השיר */
  offerPath?: string;
  /* בקשות שאין להן שורת מחיר (למשל מה מצלמים או איך השיחה המשפחתית תיראה).
     נכנסות כשורה בהודעה ובמייל, בלי מחיר ובלי השפעה על הסכום. */
  notes?: string;
  /* החלטת הבעלים 6.10.2026: סימון נפרד לכל מה שאין לו שורה בטופס, למשל יותר מ-40
     תמונות וסרטונים מהבית. הבעלים נותן הצעת מחיר. נכנס כשורה בהודעה ובמייל, בלי מחיר
     ובלי השפעה על הסכום. */
  specialRequest?: boolean;
};

/** השורה שנכנסת להודעה ולמייל כשהלקוח סימן בקשה מיוחדת */
export const SONG_SPECIAL_REQUEST_LINE = "בקשה מיוחדת, מעבר למה שבטופס: אשמח להצעת מחיר.";

/** ההערה אחרי ניקוי וקיצור, או מחרוזת ריקה */
export function cleanSongNotes(notes: string | undefined): string {
  return sanitizeLeadText(notes ?? "", SONG_NOTES_MAX).trim();
}

export type SongOfferCalc = {
  addonIds: SongAddonId[];
  participants: number;
  lines: SongPriceLine[];
  totalExVat: number;
  totalWithVat: number;
};

function rulesOf(data: SongQuoteData): SongAddonRule[] {
  return data.addons.map((a) => ({ id: a.id, requires: a.requires }));
}

export function participantsLineLabel(participants: number): string {
  return `משתתפים: ${participants}`;
}

/** מחשב את ההצעה. הבסיס תמיד כלול, ותוספת המשתתפים היא שורה אחת אחריו. */
export function calcSongQuote(
  data: SongQuoteData,
  addonIds: readonly string[] = [],
  participants: number = data.participants.included,
): SongOfferCalc {
  const ids = normalizeSongSelection(addonIds, rulesOf(data));
  const count = clampSongParticipants(participants, data.participants);
  const line = (item: SongQuoteItem): SongPriceLine => ({
    id: item.id,
    label: item.label,
    exVat: item.exVat,
    withVat: roundWithVat(item.exVat, data.vatRate),
  });
  const surcharge = songParticipantsSurchargeExVat(count, data.participants);
  const addonLines = ids.flatMap((id) => {
    const addon = data.addons.find((a) => a.id === id);
    return addon ? [line(addon)] : [];
  });
  const breakdown = songParticipantsBreakdown(count, data.participants, data.base.exVat, data.vatRate);
  const lines: SongPriceLine[] = [
    line(data.base),
    ...(surcharge > 0
      ? [
          {
            ...line({ id: SONG_PARTICIPANTS_LINE_ID, label: participantsLineLabel(count), exVat: surcharge }),
            detail: `${breakdown.withVat} ${breakdown.exVat}`,
          },
        ]
      : []),
    ...addonLines,
  ];
  const totalExVat = lines.reduce((sum, l) => sum + l.exVat, 0);
  return {
    addonIds: ids,
    participants: count,
    lines,
    totalExVat,
    totalWithVat: roundWithVat(totalExVat, data.vatRate),
  };
}

/** "1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)" */
export function formatSongTotalLine(totals: Pick<SongOfferTotals, "totalExVat" | "totalWithVat">): string {
  return `${nis(totals.totalWithVat)} כולל מע״מ (${nis(totals.totalExVat)} + מע״מ)`;
}

/** שורות "מה בחרתי" עם מחיר כולל מע״מ לכל שורה, והסכום */
export function songSelectionLines(totals: SongOfferTotals): string[] {
  return [
    "מה בחרתי:",
    ...totals.lines.flatMap((line) =>
      line.id === SONG_PARTICIPANTS_LINE_ID
        ? [
            `• ${line.label} (כולל תוספת ${nis(line.withVat)})`,
            ...(line.detail ? [`  פירוט לפי משתתף: ${line.detail}`] : []),
            `  ${EXTRA_PERSON_COST_NOTE}.`,
          ]
        : [`• ${line.label} - ${nis(line.withVat)}`],
    ),
    `סה״כ: ${formatSongTotalLine(totals)}`,
  ];
}

export type SongMessage = {
  /** ההודעה ללקוח, בגוף ראשון, בלי התג */
  text: string;
  /** תג [YC:...] לכלי של הבעלים. מי שבונה את הקישור מחליט אם לצרף אותו. */
  ycTag: string;
};

export function buildSongMessageFromCalc(
  data: SongQuoteData,
  calc: SongOfferCalc,
  {
    source,
    giftMode = false,
    notes,
    specialRequest = false,
  }: Pick<SongQuoteOptions, "source" | "giftMode" | "notes" | "specialRequest">,
): SongMessage {
  const opening = giftMode
    ? "שלום, אשמח להקליט שיר במתנה באולפן."
    : "שלום, אשמח להקליט שיר באולפן.";
  const cleanNotes = cleanSongNotes(notes);
  const text = [
    opening,
    ...songSelectionLines(calc),
    ...(specialRequest ? [SONG_SPECIAL_REQUEST_LINE] : []),
    ...(cleanNotes ? [`הערות: ${cleanNotes}`] : []),
    "מתי נוח לכם להקליט?",
  ].join("\n");
  const ycTag = buildYcLeadTag({
    service: "recording",
    price: calc.totalExVat,
    source,
    package: [data.base.id, ...calc.addonIds].join(","),
    form: "song_offer",
    purpose: giftMode ? "gift" : null,
    recorders: calc.participants > data.participants.included ? calc.participants : null,
  });
  return { text, ycTag };
}

/** קישור לטופס בעמוד עם הבחירה, /studio/recording-song-modiin?addons=a,b&participants=4#song-offer */
export function buildSongOfferHrefFrom(
  addonIds: readonly SongAddonId[],
  participants: number,
  included: number,
  path: string = SONG_OFFER_PAGE_PATH,
): string {
  const params: string[] = [];
  if (addonIds.length) params.push(`${SONG_ADDONS_PARAM}=${addonIds.join(",")}`);
  if (participants > included) params.push(`${SONG_PARTICIPANTS_PARAM}=${participants}`);
  const qs = params.length ? `?${params.join("&")}` : "";
  return `${path}${qs}#${SONG_OFFER_SECTION_ID}`;
}

/** שילוב אחד עם כל מה שהטופס צריך: סכומים, הודעה, תג וקישורים. אותה פונקציה בשרת ובדפדפן. */
export function composeSongOfferQuote(
  data: SongQuoteData,
  addonIds: readonly string[],
  participants: number,
  options: SongQuoteOptions,
): SongOfferQuote {
  const calc = calcSongQuote(data, addonIds, participants);
  const { text, ycTag } = buildSongMessageFromCalc(data, calc, options);
  const waHref = buildWhatsAppHref({
    text: options.includeYcTag === false ? text : `${text}\n${ycTag}`,
    utm_source: "website",
    utm_campaign: options.utmCampaign ?? "song_offer",
  });
  return {
    addonIds: calc.addonIds,
    participants: calc.participants,
    lines: calc.lines,
    totalExVat: calc.totalExVat,
    totalWithVat: calc.totalWithVat,
    totalLine: formatSongTotalLine(calc),
    messageText: text,
    ycTag,
    waHref,
    offerHref: buildSongOfferHrefFrom(
      calc.addonIds,
      calc.participants,
      data.participants.included,
      options.offerPath,
    ),
    notes: cleanSongNotes(options.notes),
    specialRequest: options.specialRequest === true,
  };
}

/* ─── שיחה חוזרת ─── */

export type SongCallbackContact = {
  name: string;
  /** טלפון שכבר עבר validateIsraeliMobile */
  phone: string;
  source: string;
  giftMode?: boolean;
  /** מזהה שליחה קבוע לכל הצגה של הטופס, כדי שניסיון חוזר לא ייצור ליד כפול */
  submissionId: string;
  /** שדה ה-honeypot כפי שהוא, ריק אצל בני אדם */
  honeypot?: string;
};

/**
 * בקשת "תתקשרו אליי" בחוזה השליחה של שלב 1 (submitLeadToServer), משילוב
 * שכבר חושב. הגוף הוא אותן שורות של הודעת הוואטסאפ, כדי שהבעלים יראה בדיוק
 * מה הלקוח בחר, כולל מספר המשתתפים. השרת לא מחשב מחדש את הסכום, ולכן הוא
 * נכנס גם ל-pricingRef לפני מע״מ.
 */
export function buildSongCallbackPayload(
  quote: Pick<SongOfferQuote, "lines" | "totalExVat" | "totalWithVat" | "ycTag" | "offerHref"> &
    Partial<Pick<SongOfferQuote, "notes" | "specialRequest">>,
  input: SongCallbackContact,
): LeadEmailPayload {
  const name = sanitizeLeadText(input.name, 60);
  const phone = sanitizeLeadText(input.phone, 20);
  const body = [
    "בקשה לשיחה חוזרת מטופס הקלטת השיר",
    `שם: ${name}`,
    `טלפון: ${phone}`,
    ...(input.giftMode ? ["שיר במתנה"] : []),
    "",
    ...songSelectionLines(quote),
    ...(quote.specialRequest ? [SONG_SPECIAL_REQUEST_LINE] : []),
    ...(quote.notes ? [`הערות: ${quote.notes}`] : []),
    "",
    `מקור: ${input.source}`,
    quote.ycTag,
  ].join("\n");
  return {
    formId: SONG_OFFER_CALLBACK_FORM_ID,
    subject: `[יקיר כהן] שיחה חוזרת: הקלטת שיר, ${nis(quote.totalWithVat)} כולל מע״מ${quote.specialRequest ? ", בקשה מיוחדת" : ""}`,
    body,
    name,
    phone,
    website_verification: input.honeypot ?? "",
    submissionId: input.submissionId,
    /* הלקוח ביקש שיחה חוזרת ולא קיבל וואטסאפ. בלי זה המייל לבעלים טען שכן */
    contactChannel: "callback",
    serviceType: "studio",
    pricingRef: {
      sectionId: SONG_OFFER_SECTION_ID,
      label: quote.lines.map((line) => line.label).join(" + "),
      exVat: quote.totalExVat,
      href: quote.offerHref,
    },
  };
}
