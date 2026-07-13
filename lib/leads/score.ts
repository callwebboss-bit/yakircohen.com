import type { LeadEnrichment, LeadRecord, ServiceType } from "@/lib/leads/types";

export type ScoreInput = {
  name?: string;
  phone?: string;
  email?: string;
  body?: string;
  serviceType?: ServiceType;
  eventDate?: string;
  budgetHint?: number;
  pricingRefExVat?: number;
  enrichment?: Pick<LeadEnrichment, "referrer" | "sessionSeconds">;
};

/**
 * Lead quality 0–100.
 * Completeness + timing + budget signal + message depth + referrer quality.
 */
export function computeLeadScore(input: ScoreInput): number {
  let score = 10;

  if (input.name?.trim()) score += 12;
  if (input.phone?.trim()) score += 18;
  if (input.email?.trim()) score += 10;
  if (input.serviceType && input.serviceType !== "unknown") score += 12;

  const bodyLen = input.body?.trim().length ?? 0;
  if (bodyLen >= 40) score += 10;
  if (bodyLen >= 120) score += 8;

  if (input.pricingRefExVat && input.pricingRefExVat > 0) score += 8;
  if (input.budgetHint && input.budgetHint >= 500) score += 6;
  if (input.budgetHint && input.budgetHint >= 2000) score += 6;

  if (input.eventDate) {
    const ts = Date.parse(input.eventDate);
    if (!Number.isNaN(ts)) {
      const days = (ts - Date.now()) / (1000 * 60 * 60 * 24);
      if (days >= 0 && days <= 14) score += 14;
      else if (days > 14 && days <= 60) score += 8;
      else if (days > 60) score += 3;
    }
  }

  const ref = input.enrichment?.referrer?.toLowerCase() ?? "";
  if (ref.includes("google") || ref.includes("bing") || ref.includes("yakircohen")) {
    score += 6;
  }

  const session = input.enrichment?.sessionSeconds ?? 0;
  if (session >= 60) score += 4;
  if (session >= 180) score += 4;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreBand(score: number): "high" | "mid" | "low" {
  if (score >= 80) return "high";
  if (score < 60) return "low";
  return "mid";
}

export function inferServiceTypeFromFormId(formId: string): ServiceType {
  const id = formId.toLowerCase();
  if (id.includes("podcast")) return "podcast";
  if (id.includes("event") || id.includes("dj")) return id.includes("dj") ? "dj" : "events";
  if (id.includes("studio") || id.includes("recording_song") || id.includes("blessing"))
    return "studio";
  if (id.includes("photo")) return "photography";
  if (id.includes("clip")) return "clips";
  if (id.includes("singer")) return "singer";
  if (id.includes("online") || id.includes("restore")) return "online";
  if (id.includes("academy") || id.includes("trial")) return "academy";
  if (id.includes("business") || id.includes("pro_wizard")) return "business";
  if (id.includes("pricing")) return "unknown";
  return "unknown";
}

export type { LeadRecord };
