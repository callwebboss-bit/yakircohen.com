/**
 * מחולל הודעות קבוצה - מקור משותף ל-/book ולסנכרון עם yakir-closer.
 * קופי מ-closer-brand-copy.json - מחירים מ-studio-participant-pricing.
 */

import brandCopy from "@/lib/data/closer-brand-copy.json";
import { buildPlaybackReply, detectPlaybackScenario } from "@/lib/reply-copy-builders";
import {
  getClientScenarioDescription,
  getClientScenarioTitle,
} from "@/lib/data/client-scenario-labels";
import { formatNis, VAT_RATE } from "@/lib/data/pricing";
import type { RecordingTypeId, StudioPackageId, StudioUpgradeId } from "@/lib/data/studio-recording-booking";
import {
  STUDIO_RECORDING_MAX,
  STUDIO_RECORDING_UPGRADES,
} from "@/lib/data/studio-recording-booking";
import {
  calcStudioScenarios,
  hasVideoUpgrade,
  isGroupPricingEligible,
  type StudioScenarioId,
} from "@/lib/studio-participant-pricing";

export type GroupMessageInput = {
  leadName?: string;
  adultsCount?: number;
  childrenCount?: number;
  recorderCount: number;
  customerNeed?: string;
  leadNotes?: string;
  leadOccasion?: string;
  recordingType?: RecordingTypeId | "" | null;
  scheduleWindow?: "weekdays" | "motzash" | null;
  studioPackageId?: StudioPackageId | null;
  packageName?: string;
  baseExVat: number;
  upgradesExVat?: number;
  isAmbiguousGroup?: boolean;
  selectedUpgrades?: readonly StudioUpgradeId[];
  isMotzash?: boolean;
  vatRate?: number;
  hasMobile?: boolean;
  atmosphere?: string;
  depositTotal?: number;
  customOptionAPrice?: number;
  leadDate?: string;
};

export type GroupMessageContext = {
  result: ReturnType<typeof calcStudioScenarios>;
  pricePerPerson: number;
  pricePerPersonPairs: number;
  pricePerPersonSave5: number;
  recommendedPerPerson: number;
  useDualTier: boolean;
  depositTotal: number;
  depositPerPerson: number;
  videoStudioPrice: number;
  scheduleLabel: string;
  pairsScenario: ReturnType<typeof calcStudioScenarios>["scenarios"][number] | null;
  soloScenario: ReturnType<typeof calcStudioScenarios>["scenarios"][number] | null;
  groupScenario: ReturnType<typeof calcStudioScenarios>["scenarios"][number] | null;
  save5Scenario: ReturnType<typeof calcStudioScenarios>["scenarios"][number] | null;
};

export const DUAL_TIER_THRESHOLD =
  (brandCopy.groupMessaging as { dualTierThreshold?: number }).dualTierThreshold ?? 10;

const gm = brandCopy.groupMessaging;
const mobileCfg = brandCopy.mobileStudioUpsell;

function tpl(text: string, vars: Record<string, string | number>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return out;
}

function scheduleLabel(schedule?: "weekdays" | "motzash" | null): string {
  if (schedule === "motzash") return gm.scheduleLabels.motzash;
  if (schedule === "weekdays") return gm.scheduleLabels.weekdays;
  return gm.scheduleLabels.default;
}

export function getGroupMessageContext(input: GroupMessageInput): GroupMessageContext | null {
  if (input.isAmbiguousGroup || input.recorderCount < 2) return null;

  const base = input.baseExVat + (input.upgradesExVat ?? 0);
  const vatRate = input.vatRate ?? VAT_RATE;
  const result = calcStudioScenarios({
    baseExVat: base,
    recorderCount: input.recorderCount,
    isMotzash: input.isMotzash ?? input.scheduleWindow === "motzash",
    vatRate,
    packageId: input.studioPackageId,
    serviceId: "recording",
    recordingType: input.recordingType,
  });

  const count = Math.max(2, input.recorderCount);
  const pairs = result.scenarios.find((s) => s.id === "pairs") ?? result.recommended;
  const save5 = result.scenarios.find((s) => s.id === "save5") ?? null;
  const pricePerPersonPairs = pairs
    ? Math.round(pairs.withVat / count)
    : 0;
  const pricePerPersonSave5 = save5
    ? Math.round(save5.withVat / count)
    : pricePerPersonPairs;
  const useDualTier = input.recorderCount >= DUAL_TIER_THRESHOLD && !!save5;
  const recommendedPerPerson = useDualTier ? pricePerPersonSave5 : pricePerPersonPairs;
  const pricePerPerson = recommendedPerPerson;
  const depositTotal =
    input.depositTotal ?? gm.studioDepositExVat ?? 300;
  const depositPerPerson = Math.round(depositTotal / Math.max(1, input.recorderCount));

  const videoUpgrade = STUDIO_RECORDING_UPGRADES.find((u) => u.id === "performance_clip");
  const videoStudioPrice = videoUpgrade?.price ?? 400;

  const find = (id: StudioScenarioId) =>
    result.scenarios.find((s) => s.id === id) ?? null;

  return {
    result,
    pricePerPerson,
    pricePerPersonPairs,
    pricePerPersonSave5,
    recommendedPerPerson,
    useDualTier,
    depositTotal,
    depositPerPerson,
    videoStudioPrice,
    scheduleLabel: scheduleLabel(input.scheduleWindow),
    pairsScenario: find("pairs"),
    soloScenario: find("solo"),
    groupScenario: find("group"),
    save5Scenario: find("save5"),
  };
}

export function shouldUseDualTier(input: GroupMessageInput): boolean {
  return input.recorderCount >= DUAL_TIER_THRESHOLD && !input.isAmbiguousGroup;
}

export function shouldOfferHybridStudio(input: GroupMessageInput): boolean {
  const text = [input.customerNeed, input.leadNotes, input.leadOccasion].join(" ");
  return (
    /חייל|צבא|חולה|לא משתחרר|לא יכול.*להגיע|מחכים שכולם|נחכה שכולם|לא יגיע/i.test(text) ||
    (input.recorderCount >= 4 && !input.leadDate)
  );
}

export function shouldShowKeyAdapter(input: GroupMessageInput): boolean {
  if ((input.childrenCount ?? 0) > 0) return true;
  const text = [input.customerNeed, input.leadNotes].join(" ");
  return /סולם|גבוה מדי|נמוך מדי|pitch/i.test(text) || input.recorderCount >= 4;
}

export function generateSnappyTimeline(): string {
  return gm.snappyTimeline;
}

export function buildMelodyneReassurance(): string {
  return gm.melodyneReassurance;
}

export function buildHybridStudioBlock(): string {
  return gm.hybridStudio;
}

export function buildLineSplitterReassurance(): string {
  return gm.lineSplitter;
}

export function buildExpressDeliveryGuarantee(): string {
  return gm.expressDelivery;
}

export function buildKeyAdapterBlock(): string {
  return gm.keyAdapter;
}

export function buildGroupMicroDepositBlock(ctx: GroupMessageContext): string {
  return tpl(gm.microDeposit, {
    depositTotal: ctx.depositTotal,
    depositPerPerson: ctx.depositPerPerson,
  });
}

export function buildSplitPaymentTip(ctx: GroupMessageContext): string {
  return tpl(gm.splitPaymentTip, { pricePerPerson: ctx.pricePerPerson });
}

export function buildSmartGroupUpsells(input: GroupMessageInput, ctx: GroupMessageContext): string {
  const hasVideo = hasVideoUpgrade(input.selectedUpgrades ?? [], input.studioPackageId);
  const blocks: string[] = [];

  if (!hasVideo) {
    blocks.push(
      tpl(gm.videoStudioUpsell, { videoPrice: ctx.videoStudioPrice }),
    );
  }

  if ((input.childrenCount ?? 0) > 0) {
    const perChild = Math.round(ctx.videoStudioPrice / Math.max(1, input.childrenCount ?? 1));
    blocks.push(
      tpl(gm.kidsVideoUpsell, {
        videoPrice: ctx.videoStudioPrice,
        perChild,
      }),
    );
  }

  return blocks.join("\n\n");
}

export function buildGroupFamilyPitchBlock(
  input: GroupMessageInput,
  ctx: GroupMessageContext,
): string {
  const pitch = brandCopy.groupFamilyPitch;
  const name = (input.leadName || "").trim();
  const body = pitch.bodyTemplate.replace(
    "{perPerson}",
    String(ctx.recommendedPerPerson),
  );
  const intro = name
    ? tpl(gm.familyPitchIntro, { leadName: name })
    : pitch.championIntro;

  return [
    "-----------------------------------------",
    gm.familyPitchChampion,
    "",
    intro,
    "",
    `"${body}"`,
  ].join("\n");
}

export function buildPlaybackReadyPitch(input: GroupMessageInput): string {
  return buildPlaybackReply(
    {
      leadName: input.leadName,
      scheduleWindow: input.scheduleWindow,
      recorderCount: input.recorderCount,
      childrenCount: input.childrenCount,
      adultsCount: input.adultsCount,
      leadDate: input.leadDate,
      forCloser: true,
    },
    {
      length: "standard",
      scenario: detectPlaybackScenario({
        recorderCount: input.recorderCount,
        childrenCount: input.childrenCount,
      }),
      includeChampionIntro: true,
    },
  );
}

function buildPricingSection(input: GroupMessageInput, ctx: GroupMessageContext): string {
  const lines: string[] = [];
  const pkgLabel = input.packageName ? ` ${input.packageName}` : "";
  const atmosphereText = input.atmosphere
    ? `באווירה: ${input.atmosphere}`
    : "בקצב שלכם ובלי לחץ על השעון";

  lines.push(`*מה כלול בחבילת הבסיס:*`);
  lines.push(`חבילת הקלטת אולפן${pkgLabel}: ${formatNis(input.baseExVat)} לפני מע״מ`);
  lines.push(`הקלטה, עריכה, מיקס ותיקון זיופים דיגיטלי מלא - ${atmosphereText}.`);
  lines.push("");
  lines.push(`*ההרכב שלכם:*`);
  const adults = input.adultsCount ?? 0;
  const kids = input.childrenCount ?? 0;
  if (adults || kids) {
    lines.push(`${input.recorderCount} מקליטים (${adults} מבוגרים + ${kids} ילדים).`);
  } else {
    lines.push(`${input.recorderCount} מקליטים.`);
  }
  lines.push(
    `האולפן בנוי לעד ${STUDIO_RECORDING_MAX} משתתפים בו-זמנית, ולכן נחלק את העבודה בצורה חכמה ומקצועית:`,
  );
  lines.push("");

  const pairs = ctx.pairsScenario ?? ctx.result.recommended;
  if (pairs) {
    lines.push(`*${getClientScenarioTitle("pairs")}*`);
    lines.push(getClientScenarioDescription("pairs"));
    lines.push(
      `➔ ${formatNis(pairs.subtotalExVat)} לפני מע״מ / *${formatNis(pairs.withVat)} ש"ח סופי כולל מע"מ*`,
    );
    if (input.isMotzash || input.scheduleWindow === "motzash") {
      lines.push("(כולל פתיחת מוצ״ש)");
    }
    lines.push("");
  }

  lines.push(`*אפשרויות חלופיות לבחירתכם:*`);
  if (ctx.soloScenario) {
    lines.push(
      `- *${getClientScenarioTitle("solo")}:* ${formatNis(ctx.soloScenario.subtotalExVat)} לפני מע״מ - ${getClientScenarioDescription("solo").split(".")[0]}.`,
    );
  }
  if (ctx.groupScenario) {
    lines.push(
      `- *${getClientScenarioTitle("group")}:* ${formatNis(ctx.groupScenario.subtotalExVat)} לפני מע״מ - ${getClientScenarioDescription("group").split(".")[0]}.`,
    );
  }
  if (ctx.save5Scenario) {
    lines.push(
      `- *${getClientScenarioTitle("save5")}:* ${formatNis(ctx.save5Scenario.subtotalExVat)} לפני מע״מ - ${getClientScenarioDescription("save5").split(".")[0]}.`,
    );
  }
  lines.push("");

  if (
    !input.hasMobile &&
    input.recorderCount >= (mobileCfg.capacityThreshold || 12)
  ) {
    const mobileEx = (mobileCfg.baseExVat || 999) + (mobileCfg.defaultGeoFee || 0);
    const combined = (pairs?.subtotalExVat ?? input.baseExVat) + mobileEx;
    const combinedVat = Math.round(combined * (1 + (input.vatRate ?? VAT_RATE)));
    lines.push(`*${mobileCfg.clientTitle}*`);
    lines.push(tpl(mobileCfg.clientBody, { count: input.recorderCount }));
    lines.push(
      `➔ ${formatNis(combined)} לפני מע״מ / *${formatNis(combinedVat)} ש"ח סופי כולל מע"מ והגעה*`,
    );
    lines.push("");
  }

  return lines.join("\n");
}

function buildExperienceSection(): string {
  const exp = brandCopy.studioExperience;
  const lounge = brandCopy.studioLounge;
  const lines = [
    "-----------------------------------------",
    "",
    `*${exp.blockTitle}*`,
    ...exp.recordingFlow.slice(0, 3),
    "",
    lounge.clientBlock,
  ];
  return lines.join("\n");
}

function buildClosingCta(): string {
  return [
    `*כדי שנשמור לכם מקום ביומן ולא נפספס את התאריך:*`,
    `1. מה השיר שחשבתם עליו? (אם אתם מתלבטים, אשלח לכם את ה-Top 3 שלנו לקבוצות משפחתיות).`,
    `2. מה עדיף - שיחה קצרה של 3 דקות מחר כדי לסגור פינות, או להמשיך מכאן בוואטסאפ?`,
  ].join("\n");
}

function buildDualTierPricingSection(
  input: GroupMessageInput,
  ctx: GroupMessageContext,
): string {
  const dt = (gm as { dualTier?: Record<string, string> }).dualTier ?? {};
  const leadersCount =
    (gm as { leadersCount?: number }).leadersCount ?? 4;
  const pairs = ctx.pairsScenario;
  const save5 = ctx.save5Scenario;
  if (!pairs || !save5) return buildPricingSection(input, ctx);

  const lines: string[] = [];
  lines.push(dt.pairsCeilingIntro || "*אם כולם מקליטים בזוגות:*");
  lines.push(
    tpl(dt.pairsCeilingLine || "➔ *{withVat} ש\"ח סופי* (כ-*{perPerson} ש\"ח לאדם*).", {
      withVat: formatNis(pairs.withVat),
      perPerson: ctx.pricePerPersonPairs,
    }),
  );
  lines.push("");
  lines.push(
    tpl(
      dt.yakirPickBridge ||
        "אבל בגלל שאתם {count} אנשים, יש דרך חכמה יותר ומשתלמת:",
      { count: input.recorderCount },
    ),
  );
  lines.push(dt.yakirPickTitle || "🏆 *המסלול שאני הכי ממליץ לכם:*");
  lines.push(
    tpl(
      dt.yakirPickOperational ||
        "{leadersCount} קולות מובילים + שאר המשפחה בקבוצות של עד 5.",
      { leadersCount },
    ),
  );
  lines.push(
    tpl(
      dt.yakirPickPrice ||
        "➔ *{exVat} לפני מע\"מ / {withVat} ש\"ח סופי* (כ-*{perPerson} ש\"ח לאדם*).",
      {
        exVat: formatNis(save5.subtotalExVat),
        withVat: formatNis(save5.withVat),
        perPerson: ctx.pricePerPersonSave5,
      },
    ),
  );
  if (dt.includesNote) lines.push(dt.includesNote);
  return lines.join("\n");
}

/** הודעת dual-tier לקבוצות גדולות (10+) - תקרת זוגות + save5 כהמלצה */
export function generateDualTierGroupMessage(input: GroupMessageInput): string | null {
  const ctx = getGroupMessageContext(input);
  if (!ctx || !ctx.result.eligible || !ctx.useDualTier) return null;

  const name = (input.leadName || "").trim() || "שלום";
  const parts: string[] = [
    `שלום ${name},`,
    "",
    "קראתי את הפרטים.",
    "הנה הכל בצורה הכי פשוטה, שקופה וקלילה:",
    "",
    `*החוויה שלכם:* הקלטה, עריכה, מיקס ותיקון זיופים דיגיטלי מלא - בקצב שלכם ובלי לחץ.`,
    `*ההרכב:* ${input.recorderCount} משתתפים.`,
    "",
    buildDualTierPricingSection(input, ctx),
    "",
  ];

  if (input.recorderCount >= 3) parts.push(buildLineSplitterReassurance(), "");
  if (shouldShowKeyAdapter(input)) parts.push(buildKeyAdapterBlock(), "");
  parts.push(generateSnappyTimeline(), "");
  parts.push(buildMelodyneReassurance(), "");
  parts.push(buildExpressDeliveryGuarantee(), "");
  parts.push(buildGroupMicroDepositBlock(ctx), "");
  parts.push(buildClosingCta(), "");
  parts.push(
    tpl(gm.splitPaymentTip, { pricePerPerson: ctx.pricePerPersonSave5 }),
    "",
  );
  parts.push(buildGroupFamilyPitchBlock(input, ctx));

  return parts.filter(Boolean).join("\n");
}

/** בוחר הודעה מתאימה לפי גודל הקבוצה */
export function generateGroupMessageForLead(input: GroupMessageInput): string | null {
  const ctx = getGroupMessageContext(input);
  if (!ctx || !ctx.result.eligible) return null;
  if (ctx.useDualTier) return generateDualTierGroupMessage(input);
  return generateGroupPackageMessage(input);
}

/** הודעת סגירה מלאה לקבוצות */
export function generateGroupPackageMessage(input: GroupMessageInput): string | null {
  const ctx = getGroupMessageContext(input);
  if (!ctx || !ctx.result.eligible) return null;
  if (ctx.useDualTier) return generateDualTierGroupMessage(input);

  const name = (input.leadName || "").trim() || "שלום";
  const parts: string[] = [
    `שלום ${name},`,
    "",
    "קראנו את הפרטים. הנה בפשטות ובשקוף:",
    "",
    buildPricingSection(input, ctx),
  ];

  if (input.recorderCount >= 3) {
    parts.push(buildLineSplitterReassurance(), "");
  }
  if (shouldShowKeyAdapter(input)) {
    parts.push(buildKeyAdapterBlock(), "");
  }
  parts.push(generateSnappyTimeline(), "");
  parts.push(buildExperienceSection(), "");
  parts.push(buildMelodyneReassurance(), "");

  const upsells = buildSmartGroupUpsells(input, ctx);
  if (upsells) parts.push(upsells, "");

  if (shouldOfferHybridStudio(input)) {
    parts.push(buildHybridStudioBlock(), "");
  }
  parts.push(buildExpressDeliveryGuarantee(), "");
  parts.push(buildGroupMicroDepositBlock(ctx), "");
  parts.push(buildClosingCta(), "");
  parts.push(
    tpl(gm.splitPaymentTip, {
      pricePerPerson: ctx.recommendedPerPerson,
    }),
    "",
  );
  parts.push(buildGroupFamilyPitchBlock(input, ctx));

  return parts.filter(Boolean).join("\n");
}

/** גרסה קצרה - מסלול מומלץ בלבד */
export function generateSnappyGroupMessage(input: GroupMessageInput): string | null {
  const ctx = getGroupMessageContext(input);
  if (!ctx || !ctx.result.eligible) return null;
  if (ctx.useDualTier) return generateDualTierGroupMessage(input);

  const name = (input.leadName || "").trim() || "שלום";
  const pairs = ctx.pairsScenario ?? ctx.result.recommended;
  if (!pairs) return null;

  const parts: string[] = [
    `שלום ${name},`,
    "",
    "קראנו את הפרטים. הנה הכל בצורה הכי פשוטה, שקופה וקלילה:",
    "",
    `*החוויה שלכם:* הקלטה, עריכה, מיקס ותיקון זיופים דיגיטלי מלא - בקצב שלכם ובלי לחץ.`,
    `*ההרכב:* ${input.recorderCount} משתתפים. האולפן בנוי לעד ${STUDIO_RECORDING_MAX} בו-זמנית, ולכן נחלק בצורה הכי יעילה:`,
    "",
    `🏆 *המסלול המומלץ (חלוקה מהירה לזוגות):*`,
    getClientScenarioDescription("pairs"),
    `➔ *${formatNis(pairs.withVat)} ש"ח סופי כולל מע"מ* (יוצא כ-*${ctx.pricePerPersonPairs} ש"ח לאדם* למזכרת לכל החיים).`,
    "",
  ];

  if (input.recorderCount >= 3) parts.push(buildLineSplitterReassurance(), "");
  if (shouldShowKeyAdapter(input)) parts.push(buildKeyAdapterBlock(), "");
  parts.push(generateSnappyTimeline(), "");
  parts.push(tpl(gm.videoStudioUpsell, { videoPrice: ctx.videoStudioPrice }), "");
  parts.push(buildClosingCta(), "");
  parts.push(buildGroupMicroDepositBlock(ctx), "");
  parts.push(buildGroupFamilyPitchBlock(input, ctx));

  return parts.filter(Boolean).join("\n");
}

/** בלוק עשיר ל-/book - מידע קבוצתי בתוך הודעת הליד */
export function buildBookGroupEnrichmentBlock(input: GroupMessageInput): string[] {
  const ctx = getGroupMessageContext(input);
  if (!ctx) return [];

  const lines: string[] = [
    "",
    ctx.useDualTier
      ? `*הערכה למשפחה:* תקרת זוגות ~${ctx.pricePerPersonPairs} ש"ח לאדם | המלצתנו ~${ctx.pricePerPersonSave5} ש"ח לאדם (כולל מע״מ)`
      : `*הערכה למשפחה:* ~${ctx.pricePerPersonPairs} ש"ח לאדם (כולל מע״מ, מסלול זוגות)`,
    `*מקדמה לשריון:* ${ctx.depositTotal} ש"ח (${ctx.depositPerPerson} ש"ח לאדם)`,
    buildLineSplitterReassurance(),
  ];

  if (shouldShowKeyAdapter(input)) {
    lines.push(buildKeyAdapterBlock());
  }

  return lines;
}

export function isGroupBookingLead(input: GroupMessageInput): boolean {
  return (
    input.recorderCount >= 2 &&
    !input.isAmbiguousGroup &&
    isGroupPricingEligible({
      packageId: input.studioPackageId,
      serviceId: "recording",
      recordingType: input.recordingType,
    })
  );
}
