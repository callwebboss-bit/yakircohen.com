import Link from "next/link";
import SocialMediaHeroGrid from "@/components/business/social-media/SocialMediaHeroGrid";
import SocialMediaOneOffPricing from "@/components/business/social-media/SocialMediaOneOffPricing";
import SocialMediaPromo from "@/components/business/social-media/SocialMediaPromo";
import SocialMediaRetainerTiers from "@/components/business/social-media/SocialMediaRetainerTiers";
import SocialMediaTermsBlock from "@/components/business/social-media/SocialMediaTermsBlock";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import Container from "@/components/ui/Container";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import {
  ABOUT_PARAGRAPHS,
  GEO_PROMO,
  isSocialMediaPromoActive,
  PAGE_FEATURES,
  SOCIAL_MEDIA_BRAND,
} from "@/lib/data/social-media";

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "retainer",
    question: "מה זה ריטיינר חודשי?",
    answer:
      "התקשרות קבועה לחודש: סרטונים, סטוריז וליווי לפי החבילה. תשלום מראש עד ה-1 לחודש הבא, בהעברה בנקאית.",
  },
  {
    id: "cancel",
    question: "איך מפסיקים שירות?",
    answer: "בהודעה בכתב, חודש מראש - בלי הפתעות.",
  },
  {
    id: "vat",
    question: "האם המחירים כוללים מע״מ?",
    answer: "לא. כל המחירים בעמוד לפני מע״מ.",
  },
  {
    id: "shoot",
    question: "מה כוללת שעת הצילום?",
    answer:
      "צילום בעסק שלכם לפי תכנון מראש, במסגרת החבילה. קריאייטיב ועריכה מקצועית כלולים בריטיינר.",
  },
  {
    id: "promo",
    question: "למי מתאים מבצע 10%?",
    answer: `עסקים במודיעין, כפר סבא ואילת - ${GEO_PROMO.subline}.`,
  },
  {
    id: "oneoff",
    question: "אפשר להזמין בלי ריטיינר?",
    answer:
      "כן. עריכה בלבד, סרטון בודד, בנק סרטונים או ייעוץ טלפוני - לפי המחירון החד פעמי.",
  },
];

function promoScarcityLabel(): string | undefined {
  if (!isSocialMediaPromoActive()) return undefined;
  return `${GEO_PROMO.headline} · ${GEO_PROMO.subline}`;
}

export default function SocialMediaPageContent() {
  const showPromo = isSocialMediaPromoActive();

  return (
    <ServicePageLayout
      title={`ניהול סושיאל ומדיה | ${SOCIAL_MEDIA_BRAND}`}
      subtitle={`${SOCIAL_MEDIA_BRAND} - יוצר תוכן ושיווק ברשתות. טיקטוק, אינסטגרם ופייסבוק עם צילום, עריכה ואסטרטגיה שמביאה תוצאות.`}
      features={PAGE_FEATURES}
      scarcityLabel={promoScarcityLabel()}
      whatsappText={`שלום, אשמח לשמוע על ניהול סושיאל עם ${SOCIAL_MEDIA_BRAND}`}
      utmCampaign="social_media_hub"
      ctaLabel="דברו איתנו על הסושיאל"
    >
      <SocialMediaHeroGrid />

      <Container className="space-y-14 py-12 sm:py-16">
        {showPromo ? <SocialMediaPromo /> : null}

        <section aria-labelledby="social-about-heading">
          <h2 id="social-about-heading" className="sr-only">
            אודות {SOCIAL_MEDIA_BRAND}
          </h2>
          <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <SocialMediaRetainerTiers />
        <SocialMediaTermsBlock />
        <SocialMediaOneOffPricing />

        <FAQAccordion title={`שאלות נפוצות - ${SOCIAL_MEDIA_BRAND}`} items={FAQ_ITEMS} />

        <nav aria-label="קישורים קשורים" className="border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-foreground">שירותים קשורים</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li>
              <Link
                href="/video"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                הפקות וידאו
              </Link>
            </li>
            <li>
              <Link
                href="/podcast"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                פודקאסט
              </Link>
            </li>
            <li>
              <Link
                href="/online"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                שירותים מקוונים
              </Link>
            </li>
            <li>
              <Link
                href="/photography"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                צילום לאירועים
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                צור קשר
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </ServicePageLayout>
  );
}
