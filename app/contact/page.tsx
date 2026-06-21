import type { Metadata } from "next";
import Link from "next/link";
import ContactPageContent from "@/components/contact/ContactPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SmartMap from "@/components/ui/SmartMap";
import { STUDIO_ADDRESS } from "@/lib/constants";
import {
  CONTACT_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";
import { buildFaqSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = metadataForHubSeo(CONTACT_HUB_SEO);

const CONTACT_FAQ_SCHEMA = buildFaqSchema([
  {
    question: "כמה עולה הקלטה באולפן?",
    answer: "ברכה והקלטה קצרה החל מ-450 ₪ + מע\"מ. שעת אולפן מ-350 ₪ + מע\"מ. מחיר סופי מוצג מיד בדף ההזמנה המקוונת.",
  },
  {
    question: "אפשר לשמוע דוגמאות מהעבודות?",
    answer: "כן. יש דוגמאות ביוטיוב ובאינסטגרם, ונשמח לשלוח קישורים רלוונטיים בוואטסאפ.",
  },
  {
    question: "כמה זמן לוקחת הפקה מלאה?",
    answer: "קריינות ופודקאסט: לרוב ימים בודדים. אולפן: לפי היקף. DJ: לפי תאריך האירוע.",
  },
  {
    question: "איפה האולפן ממוקם?",
    answer: "במודיעין, עמק איילון 34. נגישות נוחה מהמרכז וירושלים. אפשר לתאם הקלטה מרחוק לפי הצורך.",
  },
]);

export default function ContactPage() {
  return (
    <>
      {CONTACT_FAQ_SCHEMA && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_FAQ_SCHEMA) }}
        />
      )}
      <HubPageSchema {...hubSchemaPropsFromSeo(CONTACT_HUB_SEO)} />
      <ContactPageContent />

      <Section padding="sm" className="pb-14">
        <Container className="max-w-3xl space-y-6">
          <nav
            className="flex flex-wrap justify-center gap-3 text-sm"
            aria-label="הזמנה ומחירון"
          >
            <Link
              href="/book"
              className="rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-2 font-semibold text-brand-red hover:border-brand-red/50"
            >
              הזמנה מקוונת
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-border px-4 py-2 font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              מחירון מרכזי
            </Link>
          </nav>
          <SmartMap
            address={STUDIO_ADDRESS}
            googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
          />
        </Container>
      </Section>
    </>
  );
}
