import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";

type OpenWhatsAppLeadOptions = {
  /** When set, fires `book_lead_submit` before opening WhatsApp. */
  leadCategory?: BookCategoryId;
};

/**
 * פותח וואטסאפ בכרטיסייה חדשה. כשהחלון באמת נחסם, מציג את קישור הגיבוי
 * (#wa-fallback-link) אם יש כזה בדף.
 *
 * קודם הקריאה הייתה window.open(href, "_blank", "noopener,noreferrer"). עם
 * noopener הדפדפן מחזיר null תמיד, ולכן כל פתיחה מוצלחת נחשבה "חסומה": האירוע
 * whatsapp_popup_blocked נשלח בכל לחיצה, בדפים בלי קישור גיבוי הכרטיסייה של
 * האתר עצמו נשלחה ל-wa.me, וב-/book הופיעה הודעת חסימה שקרית (LF-05).
 * עכשיו פותחים בלי מחרוזת features ומנתקים את opener ידנית.
 * גם כשהחלון נחסם, הכרטיסייה של האתר לא עוברת דף: מסך ההצלחה או מסך הגיבוי
 * כבר מציגים קישור שהגולש לוחץ עליו בעצמו.
 */
export function openWhatsAppLead(href: string, options?: OpenWhatsAppLeadOptions): boolean {
  if (options?.leadCategory) {
    trackConversion("book_lead_submit", { category: options.leadCategory });
  }
  if (typeof window === "undefined") return false;

  let popup: Window | null = null;
  try {
    popup = window.open(href, "_blank");
  } catch {
    popup = null;
  }

  if (popup && !popup.closed) {
    try {
      popup.opener = null;
    } catch {
      /* חלון ממקור אחר יכול לסרב. הקישור עצמו כבר נפתח. */
    }
    return true;
  }

  trackConversion("whatsapp_popup_blocked");
  if (typeof document !== "undefined") {
    const fallback = document.getElementById("wa-fallback-link");
    if (fallback instanceof HTMLAnchorElement) {
      fallback.href = href;
      fallback.classList.remove("hidden");
      fallback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
  return false;
}
