import type { LeadRecord } from "@/lib/leads/types";

export function businessAdminExtras(lead: LeadRecord): string[] {
  const lines: string[] = ["תבנית: עסקים / קורפורייט"];
  if (lead.budgetHint) lines.push(`תקציב: ${lead.budgetHint}`);
  if (lead.pricingRef?.href) lines.push(`קישור: ${lead.pricingRef.href}`);
  return lines;
}
