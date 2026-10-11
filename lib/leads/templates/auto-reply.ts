import type { ServiceType } from "@/lib/leads/types";
import { wrapCustomerEmail } from "@/lib/leads/templates/email-shell";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";

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

/** Lead-supplied text lands in an HTML email sent from our verified domain - escape it. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAutoReplyText(input: {
  name?: string;
  serviceType: ServiceType;
}): { subject: string; text: string; html: string } {
  /* אותה הבטחת מענה כמו באתר (D62/D76). עד 11.10.2026 המייל אמר "תוך 24 שעות
     (ימי עסקים)", ובליד חם 12, בזמן שהאתר אומר "בדרך כלל תוך שעה" */
  const eta = TIME_CLAIMS.quoteHour;
  const name = input.name?.trim() || "שלום";
  const links = PORTFOLIO[input.serviceType] || PORTFOLIO.default;
  const linkLines = links.map((l) => `• ${l.label}: ${l.href}`).join("\n");

  const text = [
    `${name},`,
    "",
    `קיבלנו את הפנייה. נחזור אליך ${eta}.`,
    "",
    "בינתיים - דוגמאות רלוונטיות:",
    linkLines,
    "",
    "יקיר כהן הפקות",
    "https://yakircohen.com",
  ].join("\n");

  /* הלוגו והחתימה "יקיר כהן הפקות · yakircohen.com" באים מהמעטפת המשותפת
     (בדיקת הלוגו 7.10.2026), ולכן החתימה לא כתובה כאן שוב */
  const html = wrapCustomerEmail(`
  <p>${esc(name)},</p>
  <p>קיבלנו את הפנייה. נחזור אליך <strong>${eta}</strong>.</p>
  <p>בינתיים - דוגמאות רלוונטיות:</p>
  <ul>${links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>`);

  return {
    subject: `קיבלנו את הפנייה - נחזור ${eta}`,
    text,
    html,
  };
}
