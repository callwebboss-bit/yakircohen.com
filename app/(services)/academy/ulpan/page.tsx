import AcademyUlpanPageContent from "@/components/seo/AcademyUlpanPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "לימוד עברית פרונטלי פעם בשבוע עם יקיר כהן",
  description:
    "שיעורי עברית פרונטליים למבוגרים, פעם בשבוע. עברית מדוברת, ביטחון בשפה, אולפן עברית אישי. תוכנית גמישה ללא התחייבות ארוכה — שיעור ניסיון ב-500 ש\"כ.",
  slug: "academy/ulpan",
  keywords: [
    "לימוד עברית",
    "עברית למבוגרים",
    "שיעורי עברית פרונטליים",
    "עברית מדוברת",
    "אולפן עברית",
    "יקיר כהן",
    "שיעור עברית",
    "לימוד עברית פרונטלי",
  ],
});

export default function AcademyUlpanPage() {
  return <AcademyUlpanPageContent />;
}
