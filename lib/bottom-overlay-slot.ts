"use client";

/**
 * מתאם שכבה תחתונה יחידה.
 *
 * לפני השינוי, שלושה "סרגלים" תחתונים (CouponPopup, SessionRescuerBar,
 * PwaInstallPrompt) יכלו להופיע בו-זמנית ב-z שונים, להיערם זה על זה, לרצד
 * ולהסתיר טקסט + את כפתור הוואטסאפ. המתאם מבטיח ש**רק סרגל אחד** מחזיק את
 * המשבצת התחתונה בכל רגע (first-come-wins), מה שגם מפחית רעש פופ-אפים.
 *
 * מבוסס על אותו דפוס `dataset` על <html> שכבר קיים ל-`promoBanner`/`couponBanner`,
 * כדי לא להוסיף מנגנון חדש. אין re-show אוטומטי כשהמשבצת מתפנה - זה מכוון:
 * פחות פופ-אפים = חוויה נקייה יותר.
 */

const SLOT_ATTR = "bottomBar";

/** בעל המשבצת התחתונה כרגע, או null. */
export function bottomSlotOwner(): string | null {
  if (typeof document === "undefined") return null;
  return document.documentElement.dataset[SLOT_ATTR] ?? null;
}

/**
 * תופס את המשבצת אם פנויה (או כבר בבעלות `id`).
 * מחזיר true אם המשבצת בבעלותנו אחרי הקריאה, false אם תפוסה ע"י אחר.
 */
export function claimBottomSlot(id: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.documentElement;
  const owner = el.dataset[SLOT_ATTR];
  if (owner && owner !== id) return false;
  el.dataset[SLOT_ATTR] = id;
  return true;
}

/** משחרר את המשבצת רק אם היא בבעלות `id`. */
export function releaseBottomSlot(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (el.dataset[SLOT_ATTR] === id) {
    delete el.dataset[SLOT_ATTR];
  }
}
