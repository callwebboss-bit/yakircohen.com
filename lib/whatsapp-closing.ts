/**
 * מנוע הודעות WhatsApp לסגירת לידים.
 * כל טופס / wizard באתר צריך לבנות הודעות דרך הפונקציות כאן.
 */

import {
  BUSINESS_HOURS,
} from "@/lib/constants";
import { formatNis, withVat } from "@/lib/data/pricing";
import { formatPriceLine } from "@/lib/data/pricing-catalog";
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

export function buildTrustFooter(): string {
  const hours = BUSINESS_HOURS.map((h) => `${h.days}: ${h.hours}`).join(" · ");
  return [
    "📍 עמק איילון 34, מודיעין",
    `🕐 ${hours}`,
    "⚡ מסירה: 24-48 שעות לפי חבילה",
    "☁️ גיבוי ענן מאובטח",
  ].join("\n");
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
  /** מזהה שירות ב-yakir-closer (recording, podcast, dj...) */
  closerServiceId?: string | null;
  ycStep?: number;
  ycSchedule?: "weekdays" | "motzash" | null;
  ycPackage?: string | null;
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
  closerServiceId,
  ycStep = 1,
  ycSchedule,
  ycPackage,
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

  lines.push(`*כוונה:* ${formatIntent(intent)}`);
  lines.push(`*שירות:* ${serviceLabel}`);

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

  if (summaryLines.length > 0) {
    lines.push("");
    lines.push("*פרטים:*");
    for (const { label, value } of summaryLines) {
      lines.push(`${label}: ${value}`);
    }
  }

  if (source?.trim()) {
    lines.push("");
    lines.push(`📍 מקור: ${source.trim()}`);
  }

  if (includeTrustFooter) {
    lines.push("");
    lines.push(buildTrustFooter());
  }

  let body = lines.join("\n").trim();

  if (closerServiceId?.trim()) {
    body = appendYcLeadTag(body, {
      service: closerServiceId.trim(),
      price: priceExVat ?? null,
      source: source?.trim() || "website",
      step: ycStep,
      schedule: ycSchedule ?? null,
      package: ycPackage ?? null,
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
};

/** הודעת פתיחה ל-CTA בלי פרטי קשר (הלקוח ממלא ב-WhatsApp) */
export function buildPricingInquiryMessage(options: {
  packageLabel: string;
  priceExVat?: number | null;
  source?: string | null;
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
  return lines.join("\n");
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
  });
}
