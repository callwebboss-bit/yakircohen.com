import type { Metadata } from "next";
import OnlineVocalFixPageContent from "@/components/seo/OnlineVocalFixPageContent";
import NewServicesLinks from "@/components/seo/NewServicesLinks";
import { constructMetadata } from "@/lib/metadata";
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatPagePrice } from "@/lib/data/pricing-display";

export const metadata: Metadata = constructMetadata({
  title: "תיקון זיופים ושיפור קול מרחוק | יקיר כהן",
  /* D75: המספר מהקטלוג (vocal_fix_short). הטקסט עצמו לא השתנה, כי שינוי תיאור
     עובר באישור הבעלים ב-audit:seo-diff */
  /* החלטת הבעלים D110, 12.10.2026: בתיאור מחיר כולל מע״מ, מהקטלוג */
  description: `הפכו הקלטה ביתית לאיכות אולפן: הסרת רעשים, חידוד והעשרת קול. ${formatPagePrice(getExVat("vocal_fix_short")).headline} עד 5 דקות. אספקה 1-3 ימים. סקיצה לפני/אחרי חינם.`,
  slug: "online/vocal-fix",
  keywords: [
    "שיפור קול",
    "ניקוי רעשים",
    "עריכת פודקאסט מרחוק",
    "שיפור הקלטה בטלפון",
    "vocal fix",
  ],
});

export default function VocalFixPage() {
  return (
    <>
      <OnlineVocalFixPageContent />
      {/* 11.10.2026: הקלטה ישנה שרוצים עיבוד חדש סביבה, ולא רק ניקוי */}
      <NewServicesLinks paths={["/studio/renew-old-song"]} label="רוצים גם עיבוד מוזיקלי חדש סביב הקול?" />
    </>
  );
}
