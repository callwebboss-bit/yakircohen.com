/** Opens WhatsApp in a new tab after validation passed. */
export function openWhatsAppLead(href: string): void {
  window.open(href, "_blank", "noopener,noreferrer");
}
