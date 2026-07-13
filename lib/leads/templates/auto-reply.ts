import type { ServiceType } from "@/lib/leads/types";

const PORTFOLIO: Record<string, { label: string; href: string }[]> = {
  studio: [
    { label: "אולפן הקלטות", href: "https://yakircohen.com/studio/recording-studio" },
    { label: "הקלטת שיר", href: "https://yakircohen.com/studio/recording-song-modiin" },
  ],
  podcast: [
    { label: "הפקת פודקאסט", href: "https://yakircohen.com/podcast" },
  ],
  events: [
    { label: "סאונד לאירועים", href: "https://yakircohen.com/events" },
  ],
  business: [
    { label: "שירותי עסקים", href: "https://yakircohen.com/business" },
  ],
  photography: [
    { label: "צילום", href: "https://yakircohen.com/photography" },
  ],
  online: [
    { label: "שחזור סאונד אונליין", href: "https://yakircohen.com/online" },
  ],
  default: [
    { label: "מחירון", href: "https://yakircohen.com/pricing" },
    { label: "הזמנה", href: "https://yakircohen.com/book" },
  ],
};

export function buildAutoReplyText(input: {
  name?: string;
  serviceType: ServiceType;
  etaHours?: number;
}): { subject: string; text: string; html: string } {
  const eta = input.etaHours ?? 24;
  const name = input.name?.trim() || "שלום";
  const links = PORTFOLIO[input.serviceType] || PORTFOLIO.default;
  const linkLines = links.map((l) => `• ${l.label}: ${l.href}`).join("\n");

  const text = [
    `${name},`,
    "",
    `קיבלנו את הפנייה. נחזור אליך בדרך כלל תוך ${eta} שעות (ימי עסקים).`,
    "",
    "בינתיים — דוגמאות רלוונטיות:",
    linkLines,
    "",
    "יקיר כהן הפקות",
    "https://yakircohen.com",
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;color:#111;">
  <p>${name},</p>
  <p>קיבלנו את הפנייה. נחזור אליך בדרך כלל תוך <strong>${eta} שעות</strong> (ימי עסקים).</p>
  <p>בינתיים — דוגמאות רלוונטיות:</p>
  <ul>${links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
  <p>יקיר כהן הפקות<br/><a href="https://yakircohen.com">yakircohen.com</a></p>
</div>`.trim();

  return {
    subject: `קיבלנו את הפנייה — נחזור תוך ${eta} שעות`,
    text,
    html,
  };
}
