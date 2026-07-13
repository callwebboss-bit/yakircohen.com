import { scoreBand } from "@/lib/leads/score";
import type { LeadRecord } from "@/lib/leads/types";
import { PRICING_HUB_SECTIONS } from "@/lib/data/pricing-hub";

export type AdminRoutingPlan = {
  band: "high" | "mid" | "low";
  urgentSubjectPrefix: string;
  includeAlternativeOffers: boolean;
  alternativeOffersText: string;
  pingAdminWhatsApp: boolean;
};

export function planAdminRouting(lead: LeadRecord): AdminRoutingPlan {
  const band = scoreBand(lead.score);
  const offers = buildAlternativeOffers(lead);

  return {
    band,
    urgentSubjectPrefix: band === "high" ? "[דחוף] " : "",
    includeAlternativeOffers: band === "low",
    alternativeOffersText: offers,
    pingAdminWhatsApp: band === "high" && Boolean(process.env.ADMIN_WHATSAPP_ALERT?.trim()),
  };
}

function buildAlternativeOffers(lead: LeadRecord): string {
  const section =
    PRICING_HUB_SECTIONS.find((s) => s.id === lead.pricingRef?.sectionId) ||
    PRICING_HUB_SECTIONS.find((s) => s.id === lead.serviceType) ||
    PRICING_HUB_SECTIONS[0];

  if (!section) return "";

  const rows = section.rows.slice(0, 3);
  const lines = rows.map(
    (r) => `• ${r.label} — מ-${r.exVat.toLocaleString("he-IL")} ₪ לפני מע״מ (${section.href})`,
  );
  return [
    "",
    "---",
    "הצעות חלופיות מהמחירון (ציון נמוך — לשקול הצעה רכה):",
    ...lines,
    `מחירון מלא: https://yakircohen.com/pricing`,
  ].join("\n");
}
