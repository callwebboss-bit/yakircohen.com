import type { LeadRecord } from "@/lib/leads/types";

export function studioAdminExtras(lead: LeadRecord): string[] {
  const lines: string[] = ["תבנית: אולפן"];
  if (lead.pricingRef?.label) lines.push(`מחירון: ${lead.pricingRef.label}`);
  if (lead.eventDate) lines.push(`תאריך: ${lead.eventDate}`);
  return lines;
}
