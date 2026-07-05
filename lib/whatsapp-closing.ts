/**
 * מנוע הודעות WhatsApp לסגירת לידים.
 * כל טופס / wizard באתר צריך לבנות הודעות דרך הפונקציות כאן.
 */

import type { BookCategoryId } from "@/lib/book-url";
import {
  BUSINESS_HOURS,
} from "@/lib/constants";
import { formatNis, withVat } from "@/lib/data/pricing";
import { formatPriceLine } from "@/lib/data/pricing-catalog";
import { progressiveIntentLine } from "@/lib/progressive-booking-message";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";

export const PREMIUM_THRESHOLD = 3_000;

/** תסריט איתור צרכים - 5 שורות, עד 5 מילים לשורה */
export const NEEDS_DISCOVERY_SCRIPT = [
  "מה באמת חסר ביצירה שלך?",
  "בלי לחץ, פשוט נדבר.",
  "נקשיב, נבין את הצורך.",
  "נתאים חבילה שתפורה לך.",
  "בוא, נפיג כל חשש ביחד.",
] as const;

export function buildNeedsDiscoveryOpener(): string {
  return NEEDS_DISCOVERY_SCRIPT.join("\n");
}

export function buildPriceLine(exVat: number, label?: string): string {
  return formatPriceLine(exVat, label);
}

export function buildTrustFooter(bookCategory?: BookCategoryId): string {
  const hours = BUSINESS_HOURS.map((h) => `${h.days}: ${h.hours}`).join(" - ");
  const isMobileService = bookCategory === "events" || bookCategory === "singer" || bookCategory === "dj" || bookCategory === "photography";
  const isDigitalService = bookCategory === "clips" || bookCategory === "online";
  return [
    isMobileService
      ? "🚗 מגיעים אליכם לאירוע"
      : isDigitalService
        ? null
        : "📍 עמק איילון 34, מודיעין",
    `🕐 ${hours}`,
    !isMobileService ? "⚡ מסירה: 24-48 שעות לפי חבילה" : null,
    "☁️ גיבוי ענן מאובטח",
  ].filter(Boolean).join("\n");
}

export type ClosingIntent = "continue_chat" | "start_now";

export type ClosingTiming = "urgent" | "month" | "flexible" | "future" | null;

export type ClosingMessageOptions = {
  serviceLabel: string;
  contact: { name: string; phone: string };
  intent?: ClosingIntent;
  customerNeed?: string | null;
  packageLabel?: string | null;
  /** מחיר לפני מע״מ */
  priceExVat?: number | null;
  /** מחיר כולל מע״מ (אם כבר מחושב) */
  totalWithVat?: number | null;
  summaryLines?: readonly { label: string; value: string }[];
  source?: string | null;
  timing?: ClosingTiming;
  includeTrustFooter?: boolean;
  /** קטגוריית השירות - משפיע על תוכן ה-trust footer */
  bookCategory?: BookCategoryId;
  /** מזהה שירות ב-yakir-closer (recording, podcast, dj...) */
  closerServiceId?: string | null;
  ycStep?: number;
  ycSchedule?: "weekdays" | "motzash" | null;
  ycPackage?: string | null;
  ycIntent?: "start_now" | "continue_chat" | null;
  /** מזהה טופס באתר - ל-parser ב-yakir-closer */
  ycForm?: string | null;
  /** מטרת הפרויקט מ-filter questions */
  ycPurpose?: "professional" | "personal" | "gift" | null;
  ycAdults?: number | null;
  ycChildren?: number | null;
  ycRecorders?: number | null;
  ycScenario?: "pairs" | "solo" | "group" | "save5" | null;
  ycAmbiguous?: boolean | null;
  ycRoute?: string | null;
  ycEmotional?: string | null;
  ycRecordingType?: string | null;
  ycMobileGeo?: string | null;
  ycAtmosphere?: string | null;
  ycCelebrant?: string | null;
  ycWizardDepth?: "quick" | "standard" | "full" | null;
  ycScenarioChosen?: boolean | null;
  ycScenarioHint?: "unsure" | null;
  ycDeferred?: string | null;
  ycRecipientHint?: string | null;
  ycConfigVersion?: number | null;
  /** גל D+, CRO פסיכולוגי מכל קטגוריית Tier A */
  ycSessionPriority?: string | null;
  ycWelcomePerk?: string | null;
  ycLastMinuteUpsell?: boolean | null;
  /** שורות נוספות (משתתפים, מחירון) - מוכנסות לפני פרטים */
  extraBlocks?: readonly string[];
  /** נרטיב קצר: מה הבנו + מחיר, בלי רשימת פרטים ארוכה */
  progressiveNarrative?: boolean;
};

const TIMING_FLAGS: Record<NonNullable<ClosingTiming>, string> = {
  urgent: "⏰ דחוף",
  month: "📆 תוך חודש",
  flexible: "🗓️ גמיש",
  future: "🔭 עתידי",
};

function formatIntent(intent: ClosingIntent): string {
  return intent === "start_now"
    ? "מוכן/ה להתחיל תהליך והזמנה עכשיו"
    : "💬 רק בודק/ת - רוצה להמשיך את השיחה";
}

/**
 * בונה הודעת WhatsApp מלאה לסגירה.
 * תומך בדגל פרימיום, איתור צרכים, מחיר שקוף ותיוג לידים.
 */
export function buildClosingMessage({
  serviceLabel,
  contact,
  intent = "continue_chat",
  customerNeed,
  packageLabel,
  priceExVat,
  totalWithVat,
  summaryLines = [],
  source,
  timing,
  includeTrustFooter = false,
  bookCategory,
  closerServiceId,
  ycStep = 1,
  ycSchedule,
  ycPackage,
  ycIntent,
  ycForm,
  ycPurpose,
  ycAdults,
  ycChildren,
  ycRecorders,
  ycScenario,
  ycAmbiguous,
  ycRoute,
  ycEmotional,
  ycRecordingType,
  ycMobileGeo,
  ycAtmosphere,
  ycCelebrant,
  ycWizardDepth,
  ycScenarioChosen,
  ycScenarioHint,
  ycDeferred,
  ycRecipientHint,
  ycConfigVersion,
  ycSessionPriority,
  ycWelcomePerk,
  ycLastMinuteUpsell,
  extraBlocks = [],
  progressiveNarrative = false,
}: ClosingMessageOptions): string {
  const lines: string[] = [];

  const total =
    totalWithVat ??
    (priceExVat !== undefined && priceExVat !== null
      ? withVat(priceExVat)
      : undefined);

  if (total !== undefined && total >= PREMIUM_THRESHOLD) {
    lines.push("🚨 ליד פרימיום");
    lines.push("");
  }

  if (timing && TIMING_FLAGS[timing]) {
    lines.push(TIMING_FLAGS[timing]);
    lines.push("");
  }

  if (customerNeed?.trim()) {
    lines.push("*מה חסר ביצירה שלך?*");
    lines.push(customerNeed.trim());
    lines.push("");
  }

  if (progressiveNarrative) {
    const greet = contact.name.trim() || "שם";
    lines.push(`שלום ${greet}, תודה שפניתם 🎤`);
    lines.push("");
    if (summaryLines.length > 0) {
      lines.push("*מה הבנו:*");
      for (const { label, value } of summaryLines) {
        lines.push(`• ${label}: ${value}`);
      }
      lines.push("");
    }
    lines.push(`*כוונה:* ${progressiveIntentLine(intent)}`);
    lines.push(`*שירות:* ${serviceLabel}`);
  } else {
    lines.push(`*כוונה:* ${formatIntent(intent)}`);
    lines.push(`*שירות:* ${serviceLabel}`);
  }

  if (packageLabel?.trim()) {
    lines.push(`*חבילה מוצעת:* ${packageLabel.trim()}`);
  }

  if (priceExVat !== undefined && priceExVat !== null) {
    lines.push(`*מחיר:* ${buildPriceLine(priceExVat)}`);
  } else if (total !== undefined) {
    lines.push(`*סה"כ מוערך:* ${formatNis(total)} (כולל מע״מ)`);
  }

  lines.push("");
  lines.push(`*שם:* ${contact.name.trim()}`);
  lines.push(`*טלפון:* ${contact.phone.trim()}`);

  for (const block of extraBlocks) {
    if (block.trim()) {
      lines.push("");
      lines.push(block.trim());
    }
  }

  if (!progressiveNarrative && summaryLines.length > 0) {
    lines.push("");
    lines.push("*פרטים:*");
    for (const { label, value } of summaryLines) {
      lines.push(`${label}: ${value}`);
    }
  }

  if (ycDeferred?.trim()) {
    const labels: Record<string, string> = {
      song: "שם השיר",
      time: "שעה מדויקת",
      atmosphere: "אווירה",
      celebrant: "שם החוגג/ת",
    };
    const items = ycDeferred
      .split(",")
      .map((k) => labels[k.trim()] || k.trim())
      .filter(Boolean);
    if (items.length) {
      lines.push("");
      lines.push(`💬 נשמח לדייק בוואטסאפ: ${items.join(", ")}.`);
    }
  }

  if (source?.trim()) {
    lines.push("");
    lines.push(`📍 מקור: ${source.trim()}`);
  }

  if (includeTrustFooter) {
    lines.push("");
    lines.push(buildTrustFooter(bookCategory));
  }

  let body = lines.join("\n").trim();

  if (closerServiceId?.trim()) {
    // Map ClosingTiming YcTimingId (same values, both are urgency descriptors)
    const ycTiming = timing ?? null;
    body = appendYcLeadTag(body, {
      service: closerServiceId.trim(),
      price: priceExVat ?? null,
      source: source?.trim() || "website",
      step: ycStep,
      schedule: ycSchedule ?? null,
      package: ycPackage ?? null,
      intent: ycIntent ?? intent ?? null,
      form: ycForm ?? null,
      timing: ycTiming,
      purpose: ycPurpose ?? null,
      adults: ycAdults ?? null,
      children: ycChildren ?? null,
      recorders: ycRecorders ?? null,
      scenario: ycScenario ?? null,
      ambiguous: ycAmbiguous ?? null,
      route: ycRoute ?? null,
      emotional: ycEmotional ?? null,
      recordingType: ycRecordingType ?? null,
      mobileGeo: ycMobileGeo ?? null,
      atmosphere: ycAtmosphere ?? null,
      celebrant: ycCelebrant ?? null,
      wizardDepth: ycWizardDepth ?? null,
      scenarioChosen: ycScenarioChosen ?? null,
      scenarioHint: ycScenarioHint ?? null,
      deferred: ycDeferred ?? null,
      recipientHint: ycRecipientHint ?? null,
      configVersion: ycConfigVersion ?? null,
      sessionPriority: ycSessionPriority ?? null,
      welcomePerk: ycWelcomePerk ?? null,
      lastMinuteUpsell: ycLastMinuteUpsell ?? null,
    });
  }

  return body;
}

/** הודעה פשוטה לטפסי callback */
export type SimpleLeadOptions = {
  headline?: string;
  contact: { name: string; phone: string };
  serviceLabel?: string | null;
  customerNeed?: string | null;
  summaryLines?: readonly { label: string; value: string }[];
  priceExVat?: number | null;
  source?: string | null;
  intent?: ClosingIntent;
  closerServiceId?: string | null;
  ycForm?: string | null;
};

/** הודעת פתיחה ל-CTA בלי פרטי קשר (הלקוח ממלא ב-WhatsApp) */
export function buildPricingInquiryMessage(options: {
  packageLabel: string;
  priceExVat?: number | null;
  source?: string | null;
  closerServiceId?: string | null;
  ycForm?: string | null;
}): string {
  const lines = [
    `שלום, אשמח לשמוע על ${options.packageLabel}`,
  ];
  if (options.priceExVat !== undefined && options.priceExVat !== null) {
    lines.push(`*מחיר:* ${buildPriceLine(options.priceExVat)}`);
  }
  if (options.source?.trim()) {
    lines.push("");
    lines.push(`📍 מקור: ${options.source.trim()}`);
  }
  let body = lines.join("\n");
  if (options.closerServiceId?.trim()) {
    body = appendYcLeadTag(body, {
      service: options.closerServiceId.trim(),
      price: options.priceExVat ?? null,
      source: options.source?.trim() || "website",
      step: 1,
      intent: "continue_chat",
      form: options.ycForm ?? null,
    });
  }
  return body;
}

export function buildSimpleLeadMessage(options: SimpleLeadOptions): string {
  return buildClosingMessage({
    serviceLabel: options.serviceLabel ?? "פנייה מהאתר",
    contact: options.contact,
    customerNeed: options.customerNeed,
    summaryLines: options.summaryLines,
    priceExVat: options.priceExVat,
    source: options.source,
    intent: options.intent ?? "continue_chat",
    closerServiceId: options.closerServiceId,
    ycForm: options.ycForm,
    ycIntent: options.intent ?? "continue_chat",
  });
}
