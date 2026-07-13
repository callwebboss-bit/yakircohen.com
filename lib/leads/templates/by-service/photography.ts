import type { LeadRecord } from "@/lib/leads/types";

export function photographyAdminExtras(lead: LeadRecord): string[] {
  const lines: string[] = ["תבנית: צילום"];
  if (lead.eventDate) lines.push(`תאריך: ${lead.eventDate}`);
  if (lead.budgetHint) lines.push(`תקציב: ${lead.budgetHint}`);
  return lines;
}
