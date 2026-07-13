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
  followUpSentAt?: string;
  duplicateOf?: string;
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
