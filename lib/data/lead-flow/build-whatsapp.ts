import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { LeadFlowServiceId } from "./services";
import { getLeadFlowService } from "./services";
import type { PackageTierId } from "./packages";
import { PACKAGE_TIERS } from "./packages";
import {
  formatLeadFlowWhatsAppPrice,
  sumExVat,
  tryGetExVat,
  PRICE_FALLBACK_LABEL,
} from "./resolve-price";
import { getUpsellsForService } from "./upsells";
import { HOLD_POLICY_TEXT } from "./payment-hold";

export const LEAD_FLOW_WA_MAX_CHARS = 800;

export type LeadFlowMessageInput = {
  serviceId: LeadFlowServiceId;
  answers: Record<string, string>;
  answerLabels: Record<string, string>;
  tierId: PackageTierId;
  tierCatalogExVat: number | null;
  selectedUpsellIds: readonly string[];
  holdExpiresAt: number | null;
};

function truncateMessage(text: string, max = LEAD_FLOW_WA_MAX_CHARS): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function buildLeadFlowWhatsAppText(input: LeadFlowMessageInput): string {
  const service = getLeadFlowService(input.serviceId);
  const tier = PACKAGE_TIERS[input.serviceId][input.tierId];
  const lines: string[] = [
    `בקשת הצעה - ${service?.label ?? input.serviceId}`,
    `חבילה: ${tier.title}`,
    formatLeadFlowWhatsAppPrice(input.tierCatalogExVat, "מחיר חבילה נכון לכרגע"),
  ];

  const answerBits = Object.entries(input.answerLabels)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  if (answerBits.length) {
    lines.push(`צרכים: ${answerBits.join("; ")}`);
  }

  const upsells = getUpsellsForService(input.serviceId).filter((u) =>
    input.selectedUpsellIds.includes(u.id),
  );
  const upsellEx: (number | null)[] = [];
  if (upsells.length) {
    const parts = upsells.map((u) => {
      const ex = tryGetExVat(u.catalogId);
      upsellEx.push(ex);
      return `${u.label} (${ex === null ? PRICE_FALLBACK_LABEL : `${ex} ₪ + מע״מ`})`;
    });
    lines.push(`תוספות: ${parts.join(", ")}`);
  }

  const total = sumExVat([input.tierCatalogExVat, ...upsellEx]);
  lines.push(
    total === null
      ? `סה״כ: ${PRICE_FALLBACK_LABEL}`
      : formatLeadFlowWhatsAppPrice(total, "סה״כ נכון לכרגע"),
  );

  if (input.holdExpiresAt) {
    const until = new Date(input.holdExpiresAt).toLocaleString("he-IL", {
      dateStyle: "short",
      timeStyle: "short",
    });
    lines.push(`Hold עד: ${until}`);
  }
  lines.push(HOLD_POLICY_TEXT);

  return truncateMessage(lines.join("\n"));
}

export function buildLeadFlowWhatsAppHref(input: LeadFlowMessageInput): string {
  return buildWhatsAppHref({
    text: buildLeadFlowWhatsAppText(input),
    utm_source: "website",
    utm_campaign: `lead_flow_${input.serviceId}`,
  });
}
