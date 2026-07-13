import type { LeadRecord } from "@/lib/leads/types";

export function eventsAdminExtras(lead: LeadRecord): string[] {
  const lines: string[] = ["תבנית: אירועים / חתונה"];
  if (lead.eventDate) lines.push(`תאריך אירוע: ${lead.eventDate}`);
  if (lead.budgetHint) lines.push(`תקציב משוער: ${lead.budgetHint}`);
  return lines;
}
