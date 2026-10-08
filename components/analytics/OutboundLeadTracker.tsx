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

    /* capture: נמדד לפני כל onClick מקומי, כך שגם handler שעוצר הפצה
       לא מסתיר את הלחיצה מהדוח. */
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onAuxClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onAuxClick, { capture: true });
    };
  }, []);

  return null;
}
