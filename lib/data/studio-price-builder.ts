/**
 * בונה מחיר אולפן - מיפוי שאלות לחבילות ותוספות מהקטלוג בלבד.
 * אין כפולות ואין אחוזי דחיפות.
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
import { STUDIO_EXTRA_PARTICIPANT_PRICE } from "@/lib/data/studio-recording-booking";
import { buildYcLeadTag } from "@/lib/yc-lead-tag";

export type PriceBuilderDuration = "30min" | "1hour" | "3hour" | "6hour";
export type PriceBuilderFinish = "raw" | "edit" | "mix";
export type PriceBuilderParticipants = "solo" | "pair" | "group";
export type PriceBuilderUrgency = "standard" | "express" | "tomorrow";

export type PriceBuilderAnswers = {
  duration: PriceBuilderDuration;
  finish: PriceBuilderFinish;
  participants: PriceBuilderParticipants;
  urgency: PriceBuilderUrgency;
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
  catalogId: PriceItemId;
  useWithEditing: boolean;
  notes: readonly string[];
};

export type PriceBuilderResult = {
  catalogId: PriceItemId;
  useWithEditing: boolean;
  packageExVat: number;
  extrasExVat: number;
  extraCount: number;
  expressExVat: number;
  exVat: number;
  withVat: number;
  lines: PriceBuilderLine[];
  notes: string[];
  bookHref: string;
  preferWhatsApp: boolean;
  whatsappText: string;
};

export const PRICE_BUILDER_DEFAULTS: PriceBuilderAnswers = {
  duration: "30min",
  finish: "raw",
  participants: "solo",
  urgency: "standard",
};

export const PRICE_BUILDER_DURATION_OPTIONS: readonly PriceBuilderOption<PriceBuilderDuration>[] =
  [
    {
      id: "30min",
      label: "30 דקות",
      hint: "הקלטה קצרה, ברכה, פיילוט",
    },
    {
      id: "1hour",
      label: "שעה",
      hint: "שיר מוכן באולפן",
    },
    {
      id: "3hour",
      label: "3 שעות",
      hint: "שיר Pro",
    },
    {
      id: "6hour",
      label: "6+ שעות",
      hint: "הפקה מלאה, סינגל",
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
    {
      id: "mix",
      label: "מיקס ומאסטר מלא",
      hint: "חבילת שיר מוכן או סינגל מהמחירון",
    },
  ];

export const PRICE_BUILDER_URGENCY_OPTIONS: readonly PriceBuilderOption<PriceBuilderUrgency>[] =
  [
    { id: "standard", label: "תוך 5 ימים", hint: "בלי תוספת" },
    {
      id: "express",
      label: "תוך 48 שעות",
      hint: "מסירה מהירה מהמחירון",
    },
    {
      id: "tomorrow",
      label: "מחר",
      hint: "אין מחיר קטלוגי. נאשר זמינות בוואטסאפ.",
    },
  ];

const MIX_UPGRADE_NOTE =
  "מיקס מלא נמכר כשיר מוכן באולפן, לא כתוספת לחצי שעת חדר.";
const HOUR_MIX_NOTE =
  "שיר מוכן כולל מיקס ומאסטר. זה מחיר התוצאה, לא שעת חדר פלוס מיקס.";
const THREE_HOUR_RAW_NOTE =
  "במסלול Pro הגימור כלול. אין מסלול גלם נפרד במחיר הזה.";
const SIX_HOUR_RAW_NOTE =
  "בסינגל מיקס ומאסטר כלולים. אין מסלול גלם נפרד במחיר הזה.";
const THREE_PEOPLE_NOTE = `3 אנשים: תוספת ${STUDIO_EXTRA_PARTICIPANT_PRICE * 2} ₪ בתיאום (שני מקליטים נוספים).`;
const GROUP_COUNT_NOTE = "4+ אנשים: מספר מדויק בתיאום.";
const TOMORROW_NOTE = "מחר דורש אישור יומן בוואטסאפ. אין תוספת מחיר בקטלוג.";

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
  if (duration === "30min") {
    if (finish === "edit") {
      return { catalogId: "studio_half_hour", useWithEditing: true, notes: [] };
    }
    if (finish === "mix") {
      return {
        catalogId: "cover_song",
        useWithEditing: false,
        notes: [MIX_UPGRADE_NOTE],
      };
    }
    return { catalogId: "studio_half_hour", useWithEditing: false, notes: [] };
  }

  if (duration === "1hour") {
    if (finish === "edit") {
      return { catalogId: "studio_hour", useWithEditing: true, notes: [] };
    }
    if (finish === "mix") {
      return {
        catalogId: "cover_song",
        useWithEditing: false,
        notes: [HOUR_MIX_NOTE],
      };
    }
    return { catalogId: "studio_hour", useWithEditing: false, notes: [] };
  }

  if (duration === "3hour") {
    return {
      catalogId: "song_package",
      useWithEditing: false,
      notes: finish === "raw" ? [THREE_HOUR_RAW_NOTE] : [],
    };
  }

  return {
    catalogId: "single_production",
    useWithEditing: false,
    notes: finish === "raw" ? [SIX_HOUR_RAW_NOTE] : [],
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

  const expressExVat =
    answers.urgency === "express" ? getExVat("express_delivery") : 0;
  const preferWhatsApp = answers.urgency === "tomorrow";

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

  if (expressExVat > 0) {
    lines.push({
      label: getPriceById("express_delivery").label,
      exVat: expressExVat,
    });
  }

  const notes = [...resolved.notes];
  if (answers.participants === "pair") notes.push(THREE_PEOPLE_NOTE);
  if (answers.participants === "group") notes.push(GROUP_COUNT_NOTE);
  if (preferWhatsApp) notes.push(TOMORROW_NOTE);

  const hourEditExVat = getWithEditingById("studio_hour")?.exVat;
  if (
    answers.duration === "1hour" &&
    answers.finish === "mix" &&
    hourEditExVat != null &&
    packageExVat < hourEditExVat
  ) {
    notes.push(
      `חבילת השיר (${packageExVat.toLocaleString("he-IL")} ₪) נמוכה משעת אולפן עם עריכה (${hourEditExVat.toLocaleString("he-IL")} ₪) כי הגימור נמכר כחבילה, לא כתוספת.`,
    );
  }

  const exVat = packageExVat + extrasExVat + expressExVat;
  const catalogId = resolved.catalogId;
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
  const urgencyLabel = optionLabel(
    PRICE_BUILDER_URGENCY_OPTIONS,
    answers.urgency,
  );

  const whatsappBody = [
    "שלום, מעוניין/ת בהקלטה באולפן לפי בונה המחיר:",
    `משך: ${durationLabel}`,
    `משתתפים: ${participantLabel}`,
    `גימור: ${finishLabel}`,
    `מתי: ${urgencyLabel}`,
    `מחיר: ${formatNis(exVat)} לפני מע״מ (${formatNis(withVat(exVat))} כולל)`,
    preferWhatsApp ? "דרוש למחר - אשמח לאישור יומן." : null,
  ]
    .filter(Boolean)
    .join("\n");

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
    timing:
      answers.urgency === "tomorrow"
        ? "urgent"
        : answers.urgency === "express"
          ? "urgent"
          : "month",
  })}`;

  return {
    catalogId,
    useWithEditing: resolved.useWithEditing,
    packageExVat,
    extrasExVat,
    extraCount,
    expressExVat,
    exVat,
    withVat: withVat(exVat),
    lines,
    notes,
    bookHref,
    preferWhatsApp,
    whatsappText,
  };
}
