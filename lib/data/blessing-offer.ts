/**
 * ברכות, דרשות והקלטה מרחוק: מחיר, דוברים ותוספת הטקסט (החלטות 5.10.2026 (ברכות)).
 *
 * דובר אחד כלול בבסיס (blessing_recording או studio_remote, אותו מחיר), וכל
 * דובר נוסף blessing_extra_participant, עד 12. אותו כלל כמו בשיר, ולכן החישוב
 * עובר דרך אותן פונקציות (song-offer-quote.ts). כל הסכומים מהקטלוג, ולצרכן
 * כולל מע״מ קודם.
 */
import {
  BLESSING_NO_TIME_LIMIT_NOTE,
  BLESSING_PARTICIPANT_RULES,
  BLESSING_REMOTE_NOTE,
  BLESSING_REMOTE_TRADEOFF_NOTE,
  BLESSING_SAME_PRICE_NOTE,
  BLESSING_TEXT_POLISH_NOTE,
  CATALOG_VAT_RATE,
  getExVat,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";
import {
  buildPersonBreakdown,
  EXTRA_PERSON_COST_NOTE,
  type PersonBreakdown,
} from "@/lib/data/participant-cost-copy";
import {
  clampSongParticipants,
  nis,
  songParticipantsExtras,
  songParticipantsSurchargeExVat,
  type SongParticipantRules,
} from "@/lib/data/song-offer-quote";

export const BLESSING_BASE_ID = "blessing_recording" as const;
export const BLESSING_REMOTE_ID = "studio_remote" as const;
export const BLESSING_TEXT_REWRITE_ID = "blessing_text_rewrite" as const;

const SPEAKER_NOUN = { one: "דובר אחד", many: "דוברים" } as const;

export function getBlessingParticipantRules(): SongParticipantRules {
  return {
    included: BLESSING_PARTICIPANT_RULES.included,
    max: BLESSING_PARTICIPANT_RULES.max,
    extraExVat: getExVat(BLESSING_PARTICIPANT_RULES.extraId),
  };
}

export function clampBlessingSpeakers(value: number | string | null | undefined): number {
  return clampSongParticipants(value, getBlessingParticipantRules());
}

/** תוספת הדוברים לפני מע״מ. 4 דוברים: 3 × 99. */
export function blessingSpeakersSurchargeExVat(speakers: number): number {
  return songParticipantsSurchargeExVat(speakers, getBlessingParticipantRules());
}

/** סה״כ לפני מע״מ: בסיס + דוברים נוספים. משפחה של 4: 797. */
export function blessingTotalExVat(speakers: number, baseId: typeof BLESSING_BASE_ID | typeof BLESSING_REMOTE_ID = BLESSING_BASE_ID): number {
  return getExVat(baseId) + blessingSpeakersSurchargeExVat(speakers);
}

/** "כל דובר נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בהקלטה" */
export function blessingSpeakersPriceLine(vatRate: number = CATALOG_VAT_RATE): string {
  const rules = getBlessingParticipantRules();
  const withVat = Math.round(rules.extraExVat * (1 + vatRate));
  return `כל דובר נוסף +${nis(withVat)} כולל מע״מ (${nis(rules.extraExVat)} + מע״מ) · עד ${rules.max} בהקלטה`;
}

/** "4 דוברים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)" */
export function blessingSpeakersBreakdown(
  speakers: number,
  baseExVat: number = getExVat(BLESSING_BASE_ID),
  vatRate: number = CATALOG_VAT_RATE,
): PersonBreakdown {
  const rules = getBlessingParticipantRules();
  const count = clampSongParticipants(speakers, rules);
  return buildPersonBreakdown({
    count,
    baseExVat,
    extrasExVat: songParticipantsExtras(count, rules),
    vatRate,
    noun: SPEAKER_NOUN,
  });
}

/** "משפחה של 4: 940 ₪ כולל מע״מ (797 ₪ + מע״מ)" */
export function blessingFamilyExampleLine(speakers = 4): string {
  return `משפחה של ${speakers}: ${formatPrice(blessingTotalExVat(speakers)).inline}`;
}

/** "כתיבה מחדש של הטקסט: +177 ₪ כולל מע״מ (150 ₪ + מע״מ)" */
export function blessingTextRewriteLine(): string {
  const p = formatPrice(getExVat(BLESSING_TEXT_REWRITE_ID));
  return `כתיבה מחדש של הטקסט: +${p.headline} (${p.vatNote})`;
}

/* ─── תשובות ושורות שחוזרות בעמודי הברכות ─── */

/** "ברכה ודרשה לבר או בת מצווה באותו מחיר: 590 ₪ כולל מע״מ (500 ₪ + מע״מ)" */
export function blessingPriceLine(): string {
  return `${BLESSING_SAME_PRICE_NOTE}: ${formatPrice(getExVat(BLESSING_BASE_ID)).inline}`;
}

/** תשובת "כמה עולה" בעמודי הברכות */
export function buildBlessingPriceAnswer(): string {
  return [
    `${blessingPriceLine()}.`,
    `${BLESSING_NO_TIME_LIMIT_NOTE}.`,
    `דובר אחד כלול. ${blessingSpeakersPriceLine()}. ${blessingFamilyExampleLine()}.`,
    `${BLESSING_TEXT_POLISH_NOTE}. ${blessingTextRewriteLine()}.`,
    "תיקון זיופים בתוספת.",
  ].join(" ");
}

/** תשובת "כמה זמן" בעמודי הברכות */
export const BLESSING_DURATION_ANSWER =
  "אין הגבלת זמן, והמחיר לא תלוי באורך הברכה או הדרשה. עוצרים, חוזרים ומקליטים עוד טייק כמה שצריך, עד שמרגישים שזה מדויק.";

/** תשובת "אפשר כמה אנשים" בעמודי הברכות */
export function buildBlessingGroupAnswer(): string {
  return `כן. דובר אחד כלול בבסיס, ${blessingSpeakersPriceLine()}. ${EXTRA_PERSON_COST_NOTE}. ${blessingFamilyExampleLine()}.`;
}

/** תשובת "אולפן או מהבית" */
export function buildBlessingRemoteAnswer(): string {
  return `${BLESSING_REMOTE_NOTE}. ${BLESSING_REMOTE_TRADEOFF_NOTE}.`;
}
