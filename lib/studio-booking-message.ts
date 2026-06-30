/**
 * בונה בלוקים עשירים להודעת ליד studio - משתתפים, מחירון, הנחיות.
 */

import { formatNis } from "@/lib/data/pricing";
import { formatPriceLine } from "@/lib/data/pricing-catalog";
import type { RecordingTypeId, StudioPackageId, StudioUpgradeId } from "@/lib/data/studio-recording-booking";
import {
  CLOSER_ANXIETY_SHORT,
  CLOSER_PERK_SHORT,
  CLOSER_TRAVEL_SHORT,
} from "@/lib/data/book-wizard-copy";
import type {
  ProjectModeId,
  SessionPriorityId,
  TravelModeId,
  WelcomePerkId,
} from "@/lib/studio-form-draft";
import { appendYcLeadTag, type YcLeadTagInput } from "@/lib/yc-lead-tag";
import {
  STUDIO_RECORDING_MAX,
  STUDIO_SAVINGS_TIP_THRESHOLD,
} from "@/lib/data/studio-recording-booking";
import {
  buildStudioGuidelines,
  calcStudioScenarios,
  formatScenarioBlock,
  hasVideoUpgrade,
  isGroupPricingEligible,
  type StudioScenarioId,
} from "@/lib/studio-participant-pricing";

export type StudioLeadMessageContext = {
  adultsCount: number;
  childrenCount: number;
  recorderCount: number;
  isAmbiguousGroup?: boolean;
  baseExVat: number;
  upgradesExVat?: number;
  packageId?: StudioPackageId | null;
  recordingType?: RecordingTypeId | "";
  selectedUpgrades?: readonly StudioUpgradeId[];
  isMotzash?: boolean;
  vatRate?: number;
  recommendedScenario?: StudioScenarioId;
};

export function buildStudioParticipantsBlock(ctx: StudioLeadMessageContext): string[] {
  const lines: string[] = [];

  if (ctx.isAmbiguousGroup) {
    lines.push("*משתתפים:*");
    lines.push("זוהתה קבוצה - כמות מדויקת תתואם בשיחה");
    return lines;
  }

  if (ctx.recorderCount < 1) return lines;

  lines.push("*משתתפים:*");
  if (ctx.adultsCount > 0 || ctx.childrenCount > 0) {
    lines.push(
      `מבוגרים: ${ctx.adultsCount} - ילדים: ${ctx.childrenCount} - סה״כ מקליטים: ${ctx.recorderCount}`,
    );
  } else {
    lines.push(`סה״כ מקליטים: ${ctx.recorderCount}`);
  }
  lines.push("מבוגר וילד - אותו מחיר");

  if (ctx.recorderCount > STUDIO_RECORDING_MAX) {
    lines.push(`⚠️ מעל ${STUDIO_RECORDING_MAX} - נתאם זוגות בשקט באולפן`);
  }

  return lines;
}

export function buildStudioPricingEstimateBlock(ctx: StudioLeadMessageContext): string[] {
  if (ctx.isAmbiguousGroup || ctx.recorderCount < 2) return [];

  const eligible = isGroupPricingEligible({
    packageId: ctx.packageId,
    recordingType: ctx.recordingType,
    serviceId: "recording",
  });

  if (!eligible) {
    return ["*הערכת מחיר:* מחיר קבוצתי ייקבע בשיחת ייעוץ"];
  }

  const base = ctx.baseExVat + (ctx.upgradesExVat ?? 0);
  const result = calcStudioScenarios({
    baseExVat: base,
    recorderCount: ctx.recorderCount,
    isMotzash: ctx.isMotzash,
    vatRate: ctx.vatRate,
    packageId: ctx.packageId,
    recordingType: ctx.recordingType,
    serviceId: "recording",
  });

  const lines: string[] = [
    "",
    "*הערכת מחיר (לפני מע״מ)* - סופי יתואם בשיחה:",
    `▸ בסיס: ${formatNis(ctx.baseExVat)}`,
  ];

  if ((ctx.upgradesExVat ?? 0) > 0) {
    lines.push(`▸ תוספות: ${formatNis(ctx.upgradesExVat ?? 0)}`);
  }

  lines.push(formatScenarioBlock(result, { includeMotzashNote: true }));

  if (ctx.recorderCount > STUDIO_SAVINGS_TIP_THRESHOLD) {
    const save5 = result.scenarios.find((s) => s.id === "save5");
    if (save5) {
      lines.push(
        `💡 טיפ חיסכון: ${STUDIO_SAVINGS_TIP_THRESHOLD} מקליטים בזוגות = ${formatNis(save5.subtotalExVat)} לפני מע״מ`,
      );
    }
  }

  return lines;
}

export function buildStudioGuidelinesLine(ctx: StudioLeadMessageContext): string {
  return buildStudioGuidelines({
    recorderCount: Math.max(ctx.recorderCount, 1),
    hasVideoUpgrade: hasVideoUpgrade(
      ctx.selectedUpgrades ?? [],
      ctx.packageId,
    ),
  });
}

export function resolveStudioLeadPriceExVat(ctx: StudioLeadMessageContext): number {
  const base = ctx.baseExVat + (ctx.upgradesExVat ?? 0);
  const result = calcStudioScenarios({
    baseExVat: base,
    recorderCount: Math.max(ctx.recorderCount, 1),
    isMotzash: ctx.isMotzash,
    vatRate: ctx.vatRate,
    packageId: ctx.packageId,
    recordingType: ctx.recordingType,
    serviceId: "recording",
  });
  const scenarioId = ctx.recommendedScenario ?? "pairs";
  const hit =
    result.scenarios.find((s) => s.id === scenarioId) ?? result.recommended;
  return hit?.subtotalExVat ?? base;
}

export function buildStudioPriceLine(exVat: number, label?: string): string {
  return formatPriceLine(exVat, label);
}

/** מפריד בין חלק א' (אישור הגולש) לחלק ב' (צ'יטים ל-Closer) */
export const STUDIO_WA_PART_SEPARATOR = "---";

export type StudioCloserCroInput = {
  sessionPriority: SessionPriorityId;
  welcomePerk: WelcomePerkId;
  travelMode: TravelModeId;
  splitCostEnabled: boolean;
  splitCostCount: number;
  location: "modiin" | "mobile";
  projectMode?: ProjectModeId;
  recorderCount?: number;
};

export function buildStudioScheduleDisplayLabel(parts: {
  scheduleWindow?: string | null;
  date?: string;
  time?: string;
  scheduleSummary?: string;
}): string {
  const chunks: string[] = [];
  if (parts.scheduleSummary?.trim()) chunks.push(parts.scheduleSummary.trim());
  if (parts.date?.trim()) chunks.push(parts.date.trim());
  if (parts.time?.trim()) chunks.push(parts.time.trim());
  return chunks.join(" · ") || "יתואם בוואטסאפ";
}

/** חלק א' — מה שהגולש רואה ומאשר לפני שליחה */
export function buildStudioGuestConfirmBlock(opts: {
  contact: { name: string; phone: string };
  packageLabel: string;
  scheduleLabel: string;
}): string {
  return [
    `שלום ${opts.contact.name.trim()}, הנה מה שסיכמנו:`,
    "",
    `*שם:* ${opts.contact.name.trim()}`,
    `*טלפון:* ${opts.contact.phone.trim()}`,
    `*חבילה:* ${opts.packageLabel.trim()}`,
    `*מועד:* ${opts.scheduleLabel.trim()}`,
  ].join("\n");
}

/** חלק ב' — שורת צ'יטים קצרה ל-Closer */
export function buildStudioCloserCheatSheet(cro: StudioCloserCroInput): string {
  const tags: string[] = [];

  if (cro.sessionPriority && cro.sessionPriority in CLOSER_ANXIETY_SHORT) {
    tags.push(`[חרדה: ${CLOSER_ANXIETY_SHORT[cro.sessionPriority]}]`);
  }
  if (cro.welcomePerk && cro.welcomePerk in CLOSER_PERK_SHORT) {
    tags.push(`[צ'ופר: ${CLOSER_PERK_SHORT[cro.welcomePerk]}]`);
  }
  if (cro.travelMode === "car" && cro.location === "modiin") {
    tags.push(`[הגעה: ${CLOSER_TRAVEL_SHORT.car}]`);
  } else if (cro.travelMode === "transit") {
    tags.push(`[הגעה: ${CLOSER_TRAVEL_SHORT.transit}]`);
  }
  if (cro.splitCostEnabled && cro.splitCostCount >= 2) {
    tags.push(`[תקציב: מתחלקים ${cro.splitCostCount} אנשים]`);
  }
  if (cro.projectMode === "business") {
    tags.push("[פרויקט: עסקי]");
  }
  if ((cro.recorderCount ?? 0) >= 2) {
    tags.push(`[קבוצה: ${cro.recorderCount} מקליטים]`);
  }

  return tags.join(" | ");
}

export function buildStudioSplitWhatsAppBody(opts: {
  contact: { name: string; phone: string };
  packageLabel: string;
  scheduleLabel: string;
  cro: StudioCloserCroInput;
  ycTag: YcLeadTagInput;
}): string {
  const partA = buildStudioGuestConfirmBlock({
    contact: opts.contact,
    packageLabel: opts.packageLabel,
    scheduleLabel: opts.scheduleLabel,
  });
  const partB = buildStudioCloserCheatSheet(opts.cro);

  const sections = [partA];
  if (partB.trim()) {
    sections.push(STUDIO_WA_PART_SEPARATOR, partB);
  }

  return appendYcLeadTag(sections.join("\n"), opts.ycTag);
}
