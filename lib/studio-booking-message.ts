/**
 * בונה בלוקים עשירים להודעת ליד studio - משתתפים, מחירון, הנחיות.
 */

import { formatNis } from "@/lib/data/pricing";
import { formatPriceLine } from "@/lib/data/pricing-catalog";
import type { RecordingTypeId, StudioPackageId, StudioUpgradeId } from "@/lib/data/studio-recording-booking";
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
