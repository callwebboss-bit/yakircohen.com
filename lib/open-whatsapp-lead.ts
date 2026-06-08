import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";

type OpenWhatsAppLeadOptions = {
  /** When set, fires `book_lead_submit` before opening WhatsApp. */
  leadCategory?: BookCategoryId;
};

/** Opens WhatsApp; shows fallback link if popup is blocked. */
export function openWhatsAppLead(href: string, options?: OpenWhatsAppLeadOptions): boolean {
  if (options?.leadCategory) {
    trackConversion("book_lead_submit", { category: options.leadCategory });
  }
  if (typeof window === "undefined") return false;

  const popup = window.open(href, "_blank", "noopener,noreferrer");

  if (!popup || popup.closed) {
    trackConversion("whatsapp_popup_blocked");
    const fallback = document.getElementById("wa-fallback-link");
    if (fallback instanceof HTMLAnchorElement) {
      fallback.href = href;
      fallback.classList.remove("hidden");
      fallback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return false;
    }
    window.location.href = href;
    return false;
  }

  return true;
}
