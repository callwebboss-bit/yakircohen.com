import type { LeadContactChannel } from "@/lib/leads/contact-channel";

export type ServiceType =
  | "studio"
  | "podcast"
  | "events"
  | "business"
  | "photography"
  | "clips"
  | "singer"
  | "online"
  | "academy"
  | "dj"
  | "unknown";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost"
  | "spam";

export type LeadEnrichment = {
  ipHash: string;
  geo?: { city?: string; country?: string };
  device: "mobile" | "desktop" | "tablet" | "unknown";
  userAgent?: string;
  referrer?: string;
  landingPath?: string;
  sessionSeconds?: number;
  utm?: Record<string, string>;
};

export type LeadPricingRef = {
  sectionId: string;
  label: string;
  exVat?: number;
  href: string;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  formId: string;
  serviceType: ServiceType;
  name?: string;
  phone?: string;
  email?: string;
  subject: string;
  body: string;
  pricingRef?: LeadPricingRef;
  score: number;
  status: LeadStatus;
  enrichment: LeadEnrichment;
  eventDate?: string;
  budgetHint?: number;
  resendEmailId?: string;
  openedAt?: string;
  /** Resend אישר שהמייל לבעלים נמסר לתיבה (email.delivered) */
  deliveredAt?: string;
  /** המייל לבעלים חזר, נכשל, סומן כספאם, נחסם או מתעכב (webhook של Resend) */
  deliveryIssue?: { type: string; at: string };
  /** שדה ישן: התזכורת היומית בוטלה ב-11.10.2026 (D95). נשאר לרשומות קיימות */
  followUpSentAt?: string;
  duplicateOf?: string;
  /** סימונים רכים מבדיקת הגוף (מילות ספאם). הליד נשלח לבעלים עם "[לבדיקה]". */
  reviewFlags?: string[];
  /**
   * איך הלקוח ביקש שנחזור אליו (12.10.2026). "callback" = ביקש שיחה ולא קיבל
   * הודעת וואטסאפ, ולכן בעמוד הלידים החיוג בא ראשון. רשומות מלפני התאריך בלי השדה.
   */
  contactChannel?: LeadContactChannel;
};

export type LeadIngestClientMeta = {
  referrer?: string;
  landingPath?: string;
  sessionSeconds?: number;
  utm?: Record<string, string>;
  serviceType?: ServiceType;
  eventDate?: string;
  budgetHint?: number;
  pricingRef?: LeadPricingRef;
  email?: string;
};

export const LEAD_INDEX_KEY = "lead:index";
export const LEAD_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
