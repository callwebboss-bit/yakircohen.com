import Link from "next/link";
import { GoogleReviews } from "@/components/marketing/SocialProofWidgets";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  GOOGLE_RATING,
  GOOGLE_RATING_BEST,
  GOOGLE_REVIEW_COUNT,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";

/*
 * החלטת הבעלים 8.10.2026, בדיקת ההמלצות: העמוד הציג רשת של 17 המלצות עם
 * סינון לפי שירות. לאף אחת מהן לא נמצא מקור ציבורי, ואף אחת לא תואמת
 * לביקורות Google, ולכן כולן הוסרו. במקומן העמוד מציג את ביקורות Google
 * האמיתיות דרך ההטמעה הקיימת (GoogleReviews). הטקסט כאן משתמש רק בדירוג
 * ובמספר הביקורות מ-lib/constants.ts, ולא מעתיק אף ביקורת לקוד.
 * ה-H1 נשאר כמו שהיה: העמוד עדיין מציג מה לקוחות כתבו.
 */
export default function TestimonialsPageContent() {
  return (
    <article>
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold text-muted-foreground">
            המלצות לקוחות
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            מה הלקוחות אומרים על השירות
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            ביקורות שלקוחות כתבו עלינו ב-Google Maps. הדירוג שם {GOOGLE_RATING}{" "}
            מתוך {GOOGLE_RATING_BEST}, על סמך {GOOGLE_REVIEW_COUNT}+ ביקורות.
          </p>
          <p className="mt-3 text-sm">
            <Link
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline"
            >
              לכל הביקורות המאומתות ב-Google Maps
            </Link>
          </p>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-3xl">
          <GoogleReviews heading="ביקורות Google" />
        </Container>
      </Section>
    </article>
  );
}
