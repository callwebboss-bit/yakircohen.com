import UsedGearPageContent from "@/components/seo/UsedGearPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "חנות ציוד מקצועי – אולפן, הגברה ותאורה",
  description:
    "ציוד אולפן יד שנייה, ציוד די ג'יי, רמקולים מוגברים, ציוד הגברה ותאורה מקצועי למכירה. מהפקות יקיר כהן הפקות — מתוחזק ברמת פרימיום, עם הדרכה ותמיכה.",
  slug: "shop",
  keywords: [
    "ציוד אולפן יד שנייה",
    "ציוד די ג'יי",
    "רמקולים מוגברים",
    "אולפן ביתי",
    "עמדת תקלוט",
    "ציוד הגברה",
    "ציוד תאורה",
    "RCF 745",
    "KRK Rokit 8",
    "UAD Twin",
    "Traktor S4 MK3",
  ],
});

export default function ShopPage() {
  return <UsedGearPageContent />;
}
