import type { Metadata } from "next";
import OnlinePhotoEnhancePageContent from "@/components/seo/OnlinePhotoEnhancePageContent";
import { constructMetadata } from "@/lib/metadata";
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatPagePrice } from "@/lib/data/pricing-display";

export const metadata: Metadata = constructMetadata({
  title: "שדרוג תמונות ב-AI | איכות HD מרחוק",
  /* D72: המספר מהקטלוג (photo_enhance_1). הטקסט עצמו לא השתנה, כי שינוי תיאור
     עובר באישור הבעלים ב-audit:seo-diff. D110, 12.10.2026: המחיר כולל מע״מ */
  description: `שדרוג תמונות ישנות ומטושטשות ב-AI: הגדלת רזולוציה, חדות, צבעים והסרת רעשים. ${formatPagePrice(getExVat("photo_enhance_1"), { from: true }).headline} לתמונה. חבילות עד 20 תמונות. דוגמה חינם.`,
  slug: "online/vocal-fix/photo-enhance",
  keywords: [
    "שדרוג תמונות AI",
    "הגדלת רזולוציה תמונה",
    "תיקון תמונה ישנה",
    "upscaling תמונה",
    "שחזור תמונות משפחה",
  ],
});

export default function PhotoEnhancePage() {
  return <OnlinePhotoEnhancePageContent />;
}
