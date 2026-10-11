/**
 * מנוע הודעות WhatsApp לסגירת לידים.
 * כל טופס / wizard באתר צריך לבנות הודעות דרך הפונקציות כאן.
 */

import type { BookCategoryId } from "@/lib/book-url";
import {
  BUSINESS_HOURS,
} from "@/lib/constants";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { formatNis, withVat } from "@/lib/data/pricing";
import { formatPriceLine, isCatalogPriceFrom } from "@/lib/data/pricing-catalog";
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

export function buildPriceLine(exVat: number, label?: string, options?: { from?: boolean }): string {
  return formatPriceLine(exVat, label, options);
}

/**
 * שורת המסירה לפי השירות (החלטות הבעלים 2-3.10.2026). עד עכשיו כל שירות
 * שאינו בשטח קיבל "מסירה: 24-48 שעות", גם פודקאסט וגם שיר, ששניהם אצל
 * הלקוח בסוף ההקלטה.
 * - פודקאסט: הפרק אצל הלקוח באותה שנייה שמסיימים להקליט, באולפן ובבית.
 * - שיר (חבילת song באשף האולפן): השיר אצל הלקוח בסוף הסשן.
 * - ברכה, הקלטה מרחוק, קליפים, אונליין ו-pro: עבודת עריכה אחרי ההקלטה או
 *   אחרי שהלקוח שולח קובץ, ולכן 24-48 שעות נשאר.
 * - אקדמיה ושירותים בשטח (אירועים, DJ, צילום, זמר): אין שורת מסירה.
 */
export function buildDeliveryLine(
  bookCategory?: BookCategoryId,
  packageId?: string | null,
): string | null {
  if (bookCategory === "podcast") return `⚡ ${TIME_CLAIMS.podcastSameSecond}`;
  if (bookCategory === "studio" && packageId?.split(",").includes("song")) {
    return "⚡ השיר אצלכם בסוף הסשן";
  }
  if (
    bookCategory === "events" ||
    bookCategory === "singer" ||
    bookCategory === "dj" ||
    bookCategory === "photography" ||
    bookCategory === "academy"
  ) {
    return null;
  }
  return "⚡ מסירה: 24-48 שעות לפי חבילה";
}

export function buildTrustFooter(bookCategory?: BookCategoryId, packageId?: string | null): string {
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
    buildDeliveryLine(bookCategory, packageId),
    /* "גיבוי ענן מאובטח" ירד: אין התחייבות לשמירה בחינם (החלטת הבעלים 11.10.2026) */
  ].filter(Boolean).join("\n");
}

/**
 * משפט הפתיחה בקול הלקוח, לפי השירות (D94, 11.10.2026). אלה המשפטים של
 * הטפסים באתר: שיר "שלום, אשמח להקליט שיר באולפן.", פודקאסט "שלום, אשמח
 * להקליט פודקאסט.". אודיו או וידאו כבר כתוב בבחירות, ולכן בלי שורה למילוי.
 */
export function customerOpener(bookCategory?: BookCategoryId, packageId?: string | null): string {
  if (bookCategory === "podcast") return "שלום, אשמח להקליט פודקאסט.";
  if (bookCategory === "studio" && packageId?.split(",").includes("song")) {
    return "שלום, אשמח להקליט שיר באולפן.";
  }
  return "שלום, אשמח להצעת מחיר.";
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
  /** מחיר התחלה ("מ-"). בלי ערך: לפי priceFrom בקטלוג של closerServiceId */
  priceFrom?: boolean;
  /** מחיר כולל מע״מ (אם כבר מחושב) */
  totalWithVat?: number | null;
  summaryLines?: readonly { label: string; value: string }[];
  source?: string | null;
  timing?: ClosingTiming;
  /** @deprecated מ-11.10.2026 (D94) לא מוסיף כלום להודעה. נשאר כדי לא לשבור קריאות קיימות */
  includeTrustFooter?: boolean;
  /** קטגוריית השירות - קובעת את משפט הפתיחה בקול הלקוח */
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
  priceFrom,
  totalWithVat,
  summaryLines = [],
  source,
  timing,
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
    /* ההודעה בקול הלקוח (D94, 11.10.2026). עד היום הלקוח שלח "שלום [השם שלו],
       תודה שפניתם" ו"מה הבנו", כלומר הודה לעצמו בשם העסק. "מה בחרתי" הוא גם
       מה שתיבת ההדבקה ב-/admin/sales מחפשת (lib/sales/paste-match.ts). */
    lines.push(customerOpener(bookCategory, ycPackage));
    lines.push("");
    if (summaryLines.length > 0) {
      lines.push("*מה בחרתי:*");
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
    lines.push(`*מחיר:* ${buildPriceLine(priceExVat, undefined, { from: priceFrom ?? isCatalogPriceFrom(closerServiceId) })}`);
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

  /* includeTrustFooter כבר לא מוסיף כלום להודעה: כתובת, שעות, הבטחת מסירה
     ושורות אמון הם דברים שהעסק אומר, לא הלקוח. הם נכתבים בתשובה של יקיר
     (D94, 11.10.2026, מחליף בהודעה את חתימת השירות של S1003-02). */

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
  priceFrom?: boolean;
  source?: string | null;
  intent?: ClosingIntent;
  closerServiceId?: string | null;
  ycForm?: string | null;
};

/** הודעת פתיחה ל-CTA בלי פרטי קשר (הלקוח ממלא ב-WhatsApp) */
export function buildPricingInquiryMessage(options: {
  packageLabel: string;
  priceExVat?: number | null;
  /** מחיר התחלה ("מ-"). בלי ערך: לפי priceFrom בקטלוג של closerServiceId */
  priceFrom?: boolean;
  source?: string | null;
  closerServiceId?: string | null;
  ycForm?: string | null;
}): string {
  const lines = [
    `שלום, אשמח לשמוע על ${options.packageLabel}`,
  ];
  if (options.priceExVat !== undefined && options.priceExVat !== null) {
    const from = options.priceFrom ?? isCatalogPriceFrom(options.closerServiceId);
    lines.push(`*מחיר:* ${buildPriceLine(options.priceExVat, undefined, { from })}`);
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
    priceFrom: options.priceFrom,
    source: options.source,
    intent: options.intent ?? "continue_chat",
    closerServiceId: options.closerServiceId,
    ycForm: options.ycForm,
    ycIntent: options.intent ?? "continue_chat",
  });
}
