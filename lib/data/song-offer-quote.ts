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

export type SongPriceLine = {
  id: string;
  label: string;
  exVat: number;
  withVat: number;
  /** פירוט לפי משתתף, רק בשורת המשתתפים: "590 + 224 + 117 ₪ כולל מע״מ (500 + 190 + 99 ₪ + מע״מ)" */
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

export function nis(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`;
}

/* ─── משתתפים ─── */

/**
 * כללי המשתתפים בשיר, מהקטלוג (SONG_PARTICIPANT_RULES ב-pricing-catalog.ts):
 * זמר אחד כלול, השני בתוספת secondExVat, מהשלישי והלאה groupExVat לכל אחד,
 * ועד max בשיר.
 */
export type SongParticipantRules = {
  included: number;
  max: number;
  secondExVat: number;
  groupExVat: number;
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

/** תוספת המשתתפים לפני מע״מ. 1 זמר: 0. 4 זמרים: 190 + 99 + 99. */
export function songParticipantsSurchargeExVat(
  participants: number,
  rules: SongParticipantRules,
): number {
  const n = clampSongParticipants(participants, rules);
  const extra = n - rules.included;
  if (extra <= 0) return 0;
  return rules.secondExVat + (extra - 1) * rules.groupExVat;
}

/** התוספת לכל משתתף מעבר לכלול, לפי הסדר. 4 זמרים: [190, 99, 99]. */
export function songParticipantsExtras(participants: number, rules: SongParticipantRules): number[] {
  const n = clampSongParticipants(participants, rules);
  const extra = n - rules.included;
  if (extra <= 0) return [];
  return [rules.secondExVat, ...Array.from({ length: extra - 1 }, () => rules.groupExVat)];
}

/**
 * הפירוט לפי משתתף (החלטת הבעלים 3.10.2026, סבב שלישי), כולל מע״מ קודם:
 * "4 משתתפים: 590 + 224 + 117 + 117 ₪ כולל מע״מ (500 + 190 + 99 + 99 ₪ + מע״מ)".
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

/**
 * שורת ההסבר מתחת לבורר, כולל מע״מ קודם:
 * "זמר נוסף +224 ₪ · מהזמר השלישי +117 ₪ לכל אחד · עד 12 בשיר"
 */
export function songParticipantsExplanation(rules: SongParticipantRules, vatRate: number): string {
  return [
    `זמר נוסף +${nis(roundWithVat(rules.secondExVat, vatRate))}`,
    `מהזמר השלישי +${nis(roundWithVat(rules.groupExVat, vatRate))} לכל אחד`,
    `עד ${rules.max} בשיר`,
  ].join(" · ");
}

/** אותו הסבר לפני מע״מ, בקטן: "(190 ₪ ו-99 ₪ + מע״מ)" */
export function songParticipantsExplanationExVat(rules: SongParticipantRules): string {
  return `(${nis(rules.secondExVat)} ו-${nis(rules.groupExVat)} + מע״מ)`;
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
};

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
  { source, giftMode = false }: Pick<SongQuoteOptions, "source" | "giftMode">,
): SongMessage {
  const opening = giftMode
    ? "שלום, אשמח להקליט שיר במתנה באולפן."
    : "שלום, אשמח להקליט שיר באולפן.";
  const text = [opening, ...songSelectionLines(calc), "מתי נוח לכם להקליט?"].join("\n");
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
  quote: Pick<SongOfferQuote, "lines" | "totalExVat" | "totalWithVat" | "ycTag" | "offerHref">,
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
    "",
    `מקור: ${input.source}`,
    quote.ycTag,
  ].join("\n");
  return {
    formId: SONG_OFFER_CALLBACK_FORM_ID,
    subject: `[יקיר כהן] שיחה חוזרת: הקלטת שיר, ${nis(quote.totalWithVat)} כולל מע״מ`,
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
