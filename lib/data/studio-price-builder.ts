/**
 * בונה מחיר אולפן - שעת חדר בלבד (30 דקות או שעה, גלם או עריכה, מספר
 * מקליטים), מהקטלוג בלבד. אין כפולות ואין אחוזי דחיפות.
 *
 * 2.10.2026: הקלטת שיר יצאה מהבונה. שיר הוא בסיס ותוספות (lib/data/song-offer.ts)
 * ואין בו בחירת משך. יצאו גם מיקס, 3 ו-6 שעות ושלב הדחיפות (express_delivery).
 */

import { buildBookHref } from "@/lib/book-url";
import { formatNis, withVat } from "@/lib/data/pricing";
import {
  getExVat,
  getPriceById,
  getWithEditingById,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";
import { buildSongOfferHref } from "@/lib/data/song-offer";
import { STUDIO_EXTRA_PARTICIPANT_PRICE } from "@/lib/data/studio-recording-booking";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export type PriceBuilderDuration = "30min" | "1hour";
export type PriceBuilderFinish = "raw" | "edit";
export type PriceBuilderParticipants = "solo" | "pair" | "group";

export type PriceBuilderAnswers = {
  duration: PriceBuilderDuration;
  finish: PriceBuilderFinish;
  participants: PriceBuilderParticipants;
};

export type PriceBuilderOption<T extends string> = {
  id: T;
  label: string;
  hint: string;
};

export type PriceBuilderLine = {
  label: string;
  exVat: number;
};

export type DurationFinishResolve = {
  catalogId: "studio_half_hour" | "studio_hour";
  useWithEditing: boolean;
};

export type PriceBuilderResult = {
  catalogId: PriceItemId;
  useWithEditing: boolean;
  packageExVat: number;
  extrasExVat: number;
  extraCount: number;
  exVat: number;
  withVat: number;
  lines: PriceBuilderLine[];
  notes: string[];
  bookHref: string;
  whatsappText: string;
};

/** כרטיס הקישור מהבונה לטופס הקלטת השיר */
export const PRICE_BUILDER_SONG_LINK = {
  text: "רוצים להקליט שיר? זה לא שעת חדר: הקלטה, מיקס ומאסטר במחיר אחד, ותוספות לבחירה.",
  label: "להצעת הקלטת השיר",
  href: buildSongOfferHref(),
} as const;

export const PRICE_BUILDER_DEFAULTS: PriceBuilderAnswers = {
  duration: "30min",
  finish: "raw",
  participants: "solo",
};

export const PRICE_BUILDER_DURATION_OPTIONS: readonly PriceBuilderOption<PriceBuilderDuration>[] =
  [
    {
      id: "30min",
      label: "30 דקות",
      hint: "הקלטה קצרה, פיילוט",
    },
    {
      id: "1hour",
      label: "שעה",
      hint: "קריינות, שעת חדר",
    },
  ];

export const PRICE_BUILDER_PARTICIPANT_OPTIONS: readonly PriceBuilderOption<PriceBuilderParticipants>[] =
  [
    { id: "solo", label: "1", hint: "מקליט אחד כלול בבסיס" },
    { id: "pair", label: "2-3", hint: `תוספת מקליט אחד (${STUDIO_EXTRA_PARTICIPANT_PRICE} ₪). 3 אנשים בתיאום.` },
    { id: "group", label: "4+", hint: "תוספת לפי 3 מקליטים נוספים. מספר מדויק בתיאום." },
  ];

export const PRICE_BUILDER_FINISH_OPTIONS: readonly PriceBuilderOption<PriceBuilderFinish>[] =
  [
    { id: "raw", label: "חומר גלם", hint: "קובץ מההקלטה, בלי עריכה" },
    {
      id: "edit",
      label: "עריכה בסיסית + ניקוי AI",
      hint: "ניקוי ועריכה קצרה לפי הקטלוג",
    },
  ];

const THREE_PEOPLE_NOTE = `3 אנשים: תוספת ${STUDIO_EXTRA_PARTICIPANT_PRICE * 2} ₪ בתיאום (שני מקליטים נוספים).`;
const GROUP_COUNT_NOTE = "4+ אנשים: מספר מדויק בתיאום.";

export function extraParticipantCount(
  participants: PriceBuilderParticipants,
): number {
  if (participants === "pair") return 1;
  if (participants === "group") return 3;
  return 0;
}

export function resolveDurationFinish(
  duration: PriceBuilderDuration,
  finish: PriceBuilderFinish,
): DurationFinishResolve {
  return {
    catalogId: duration === "30min" ? "studio_half_hour" : "studio_hour",
    useWithEditing: finish === "edit",
  };
}

function optionLabel<T extends string>(
  options: readonly PriceBuilderOption<T>[],
  id: T,
): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

export function calcStudioPriceBuilder(
  answers: PriceBuilderAnswers,
): PriceBuilderResult {
  const resolved = resolveDurationFinish(answers.duration, answers.finish);
  const item = getPriceById(resolved.catalogId);
  const withEditing = resolved.useWithEditing
    ? getWithEditingById(resolved.catalogId)
    : undefined;

  const baseExVat = getExVat(resolved.catalogId);
  const packageExVat = withEditing?.exVat ?? baseExVat;

  const extraCount = extraParticipantCount(answers.participants);
  const extrasExVat = extraCount * STUDIO_EXTRA_PARTICIPANT_PRICE;

  const lines: PriceBuilderLine[] = [];
  if (withEditing) {
    lines.push({ label: item.label, exVat: baseExVat });
    lines.push({
      label: withEditing.label,
      exVat: withEditing.exVat - baseExVat,
    });
  } else {
    lines.push({ label: item.label, exVat: packageExVat });
  }

  if (extrasExVat > 0) {
    lines.push({
      label:
        extraCount === 1
          ? "משתתף נוסף"
          : `משתתפים נוספים (${extraCount})`,
      exVat: extrasExVat,
    });
  }

  const notes: string[] = [];
  if (answers.participants === "pair") notes.push(THREE_PEOPLE_NOTE);
  if (answers.participants === "group") notes.push(GROUP_COUNT_NOTE);

  const exVat = packageExVat + extrasExVat;
  const catalogId: PriceItemId = resolved.catalogId;
  const bookHref =
    resolvePricingBookHref(catalogId) ??
    buildBookHref("studio", { catalog: catalogId });

  const durationLabel = optionLabel(
    PRICE_BUILDER_DURATION_OPTIONS,
    answers.duration,
  );
  const finishLabel = optionLabel(PRICE_BUILDER_FINISH_OPTIONS, answers.finish);
  const participantLabel = optionLabel(
    PRICE_BUILDER_PARTICIPANT_OPTIONS,
    answers.participants,
  );

  const whatsappBody = [
    "שלום, מעוניין/ת בהקלטה באולפן לפי בונה המחיר:",
    `משך: ${durationLabel}`,
    `משתתפים: ${participantLabel}`,
    `גימור: ${finishLabel}`,
    `מחיר: ${formatNis(withVat(exVat))} כולל מע״מ (${formatNis(exVat)} לפני מע״מ)`,
  ].join("\n");

  const whatsappText = `${whatsappBody}\n${buildYcLeadTag({
    service: catalogId,
    price: exVat,
    source: "studio_price_builder",
    step: 1,
    recorders:
      answers.participants === "solo"
        ? 1
        : answers.participants === "pair"
          ? 2
          : 4,
    timing: "month",
  })}`;

  return {
    catalogId,
    useWithEditing: resolved.useWithEditing,
    packageExVat,
    extrasExVat,
    extraCount,
    exVat,
    withVat: withVat(exVat),
    lines,
    notes,
    bookHref,
    whatsappText,
  };
}
