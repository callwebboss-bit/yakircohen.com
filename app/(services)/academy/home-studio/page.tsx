import type { Metadata } from "next";
import AcousticConsultingPageContent from "@/components/seo/AcousticConsultingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "ייעוץ אקוסטיקה ובניית אולפן | פודקאסט ביתי ומשדר | יקיר כהן הפקות",
  description:
    "ייעוץ אקוסטיקה לבניית אולפן הקלטות, אולפן פודקאסט ביתי וחדר משדר. תכנון אקוסטי, הדרכה מעשית וליווי צמוד. זום 60 דק 500 ₪ | ייעוץ מלא עם ביקור 950 ₪. בכל הארץ.",
  slug: "academy/home-studio",
  keywords: [
    "ייעוץ אקוסטיקה לאולפן",
    "בניית אולפן הקלטות",
    "אולפן פודקאסט ביתי",
    "חדר משדר",
    "תכנון אקוסטי",
    "ייעוץ אולפן ביתי",
    "אקוסטיקה ביתית",
  ],
});

export default function HomeStudioPage() {
  return <AcousticConsultingPageContent />;
}
