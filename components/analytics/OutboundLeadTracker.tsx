"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";

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

export default function OutboundLeadTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      try {
        if (event.defaultPrevented) return;
        const target = event.target;
        if (!(target instanceof Element)) return;

        const anchor = target.closest("a[href]");
        if (!anchor) return;

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
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
