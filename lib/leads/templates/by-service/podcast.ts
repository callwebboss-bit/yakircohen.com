import type { LeadRecord } from "@/lib/leads/types";

export function podcastAdminExtras(lead: LeadRecord): string[] {
  const lines: string[] = ["תבנית: פודקאסט"];
  if (lead.pricingRef?.label) lines.push(`חבילה: ${lead.pricingRef.label}`);
  return lines;
}
