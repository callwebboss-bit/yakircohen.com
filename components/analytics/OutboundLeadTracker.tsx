"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
import { stampWhatsAppLeadCode } from "@/lib/whatsapp";

/**
 * מודד לחיצות יוצאות לוואטסאפ ולטלפון, מכל מקום באתר, ממאזין אחד.
 *
 * הרקע: כל שלב באשף נמדד, אבל ה-CTA שרוב הגולשים באמת רואים לא דיווח כלום.
 * PageBottomCta יושב בתחתית כל עמוד שירות, MobileStickyCta הוא הסרגל במובייל,
 * ויש עשרות קישורי tel: לאורך עמודי השירות. בלי המדידה הזו אי אפשר לענות
 * "איזה עמוד מייצר לידים", ולכן כל החלטת קופי או CRO אחריה היא ניחוש.
 *
 * למה מאזין מואצל אחד ולא onClick בכל רכיב: העמודים נבנים מ-44 תבניות
 * ומרישום שירותים, ועריכה פר-עמוד הייתה מחייבת לגעת בעשרות קבצים ולהתיישן
 * בעמוד הבא שייווצר. מאזין אחד על document תופס גם מה שעוד לא נכתב.
 *
 * חפיפה עם מדידה קיימת: חמישה משטחים כבר מדווחים לחיצת וואטסאפ משלהם.
 * שלושה מהם קישורים רגילים והיו נספרים כאן פעם שנייה, ולכן הם מסומנים
 * ב-data-lead-tracked ומדולגים. השניים האחרים נפתחים דרך window.open
 * ולא עוברים כאן בכלל. התוצאה: whatsapp_cta_click סופר בדיוק את מה
 * שלא נמדד עד היום, ואינו משנה אף מספר קיים.
 *
 * תוכנית הבהירות (11.10.2026, שלב 0): אותו מאזין מודד גם את מה שצריך
 * כדי לשפוט את הדלתות ואת דף הבית לפני ואחרי.
 * - book_cta_click: קישור פנימי ל-/book. היום אין לו אירוע GA4 בכלל
 *   (docs/DESIGN-TRACK.md:151-153). fireLeadTouch בכפתור הפתיחה כותב
 *   ליומן בשרת, לא ל-GA4, ולכן אין כאן ספירה כפולה.
 * - door_select: קישור בתוך [data-door], עם הדלת והפריט.
 * - chooser_step: שינוי radio בתוך [data-chooser], פעם אחת לכל שאלה
 *   בכל צפייה בעמוד (חצים במקלדת מפעילים change בכל תזוזה).
 */

/** ערך מדווח כשלא נמצא מקור מדויק, כדי שלא יהיה שדה ריק בדוח */
const UNKNOWN = "unknown";

function surfaceFor(anchor: Element): string {
  const explicit = anchor.closest("[data-lead-surface]");
  const named = explicit?.getAttribute("data-lead-surface");
  if (named) return named;
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  return "body";
}

function campaignFor(href: string): string {
  try {
    return new URL(href).searchParams.get("utm_campaign") ?? UNKNOWN;
  } catch {
    return UNKNOWN;
  }
}

/*
 * קוד פנייה (החלטת הבעלים D67, 7.10.2026): רוב קישורי הוואטסאפ נבנים בשרת
 * ונשמרים ב-HTML הסטטי, ולכן קוד שנוצר שם היה זהה לכל הגולשים. הקוד נכנס
 * לקישור ברגע הלחיצה, לפני שהדפדפן עובר אליו, ולחיצה שנייה על אותו קישור
 * שומרת את אותו קוד. קישור שכבר נושא קוד (כי אותו קוד נשלח במייל) לא משתנה.
 */
function stampLeadCode(anchor: Element): void {
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const href = anchor.getAttribute("href") ?? "";
  if (!href.includes("wa.me/") && !href.includes("api.whatsapp.com/")) return;
  const stamped = stampWhatsAppLeadCode(href);
  if (stamped !== href) anchor.setAttribute("href", stamped);
}

function anchorOf(event: MouseEvent): Element | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest("a[href]");
}

/** קישור פנימי ל-/book, כולל /book/... ו-/book?..., בלי /booking וכדומה */
function isBookHref(href: string): boolean {
  return /^\/book(?:[/?#]|$)/.test(href);
}

export default function OutboundLeadTracker() {
  useEffect(() => {
    /* לחיצה אמצעית פותחת כרטיסייה בלי אירוע click, ולכן גם בה נכנס הקוד */
    function onAuxClick(event: MouseEvent) {
      try {
        const anchor = anchorOf(event);
        if (anchor) stampLeadCode(anchor);
      } catch {
        /* הקוד לעולם לא מפיל ניווט של גולש */
      }
    }

    function onClick(event: MouseEvent) {
      try {
        const anchor = anchorOf(event);
        if (!anchor) return;
        /* לפני כל דילוג של המדידה: גם משטח שמדווח בעצמו צריך קוד פנייה */
        stampLeadCode(anchor);
        if (event.defaultPrevented) return;

        /* משטח שכבר מדווח אירוע משלו. מדלגים כדי לא לספור פעמיים. */
        if (anchor.closest("[data-lead-tracked]")) return;

        const href = anchor.getAttribute("href") ?? "";
        const page = window.location.pathname;
        const surface = surfaceFor(anchor);

        if (href.startsWith("tel:")) {
          trackConversion("phone_call_click", { page, surface });
          return;
        }

        const door = anchor.closest("[data-door]");
        if (door) {
          trackConversion("door_select", {
            page,
            surface,
            door: door.getAttribute("data-door") || UNKNOWN,
            item: door.getAttribute("data-door-item") || UNKNOWN,
          });
        }

        if (isBookHref(href)) {
          trackConversion("book_cta_click", {
            page,
            surface,
            target: href.split(/[?#]/)[0],
          });
          return;
        }

        if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
          trackConversion("whatsapp_cta_click", {
            page,
            surface,
            campaign: campaignFor(href),
          });
        }
      } catch {
        /* מדידה לעולם לא מפילה ניווט של גולש */
      }
    }

    /* שאלה שכבר נספרה בעמוד הזה. המפתח כולל את הנתיב, כי המאזין חי לאורך
       ניווט בצד הלקוח, וצפייה בעמוד אחר היא ספירה חדשה. */
    const countedChooserSteps = new Set<string>();

    function onChange(event: Event) {
      try {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
        const chooser = input.closest("[data-chooser]");
        if (!chooser) return;
        const page = window.location.pathname;
        const chooserId = chooser.getAttribute("data-chooser") || UNKNOWN;
        const step =
          input.closest("[data-chooser-step]")?.getAttribute("data-chooser-step") ||
          input.name ||
          UNKNOWN;
        const key = `${page}|${chooserId}|${step}`;
        if (countedChooserSteps.has(key)) return;
        countedChooserSteps.add(key);
        trackConversion("chooser_step", {
          page,
          chooser: chooserId,
          step,
          answer: input.value || UNKNOWN,
        });
      } catch {
        /* מדידה לעולם לא מפילה אינטראקציה */
      }
    }

    /* capture: נמדד לפני כל onClick מקומי, כך שגם handler שעוצר הפצה
       לא מסתיר את הלחיצה מהדוח. */
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onAuxClick, { capture: true });
    document.addEventListener("change", onChange, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onAuxClick, { capture: true });
      document.removeEventListener("change", onChange, { capture: true });
    };
  }, []);

  return null;
}
