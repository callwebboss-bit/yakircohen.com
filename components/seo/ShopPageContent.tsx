import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import AnswerBlock from "@/components/seo/AnswerBlock";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShopBundlesSection from "@/components/seo/ShopBundlesSection";
import ShopVouchersSection from "@/components/seo/ShopVouchersSection";
import SpeakableSchema from "@/components/seo/SpeakableSchema";
import UsedGearInventorySection from "@/components/seo/UsedGearInventorySection";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { SHOP_ANSWER_SNIPPET } from "@/lib/data/shop-vouchers";
import { absoluteUrl } from "@/lib/site-url";

const SHOP_RELATED = [
  {
    href: "/studio/recording-song-modiin/gifts",
    title: "מתנות מהאולפן",
    description: "שובר להקלטת שיר או ברכה באולפן.",
  },
  {
    href: "/events/attractions",
    title: "אטרקציות לאירוע",
    description: "עשן, זיקוקים, בועות וקונפטי עם מפעיל.",
  },
  {
    href: "/book",
    title: "הזמנה מקוונת",
    description: "מחיר ותאריך לפני שליחה בוואטסאפ.",
  },
  {
    href: "/pricing",
    title: "מחירון",
    description: "טווחי מחיר לכל השירותים.",
  },
] as const;

const SECTION_LINKS = [
  { href: "#vouchers", label: "שוברים" },
  { href: "#bundles", label: "חבילות" },
  { href: "#used-gear", label: "ציוד יד שנייה" },
] as const;

export default function ShopPageContent() {
  const pageUrl = absoluteUrl("shop");

  return (
    <article className="bg-background">
      <SpeakableSchema
        url={pageUrl}
        cssSelector={["#shop-answer", "#shop-vouchers-heading"]}
      />

      <Section padding="sm" className="border-b border-border/30">
        <Container className="max-w-5xl">
          <span className="block text-sm font-medium text-muted-foreground">
            חנות
          </span>
          <h1 className="mt-4 font-serif text-hero font-bold leading-tight text-foreground">
            חנות שוברים וציוד מקצועי במודיעין
          </h1>
          <AnswerBlock id="shop-answer">{SHOP_ANSWER_SNIPPET}</AnswerBlock>
          <ContextualIntroParagraph pathname="/shop" className="mt-4 max-w-2xl" />
          <nav
            className="mt-8 flex flex-wrap items-center gap-6"
            aria-label="קפיצה לסקשנים בחנות"
          >
            {SECTION_LINKS.map((link, index) => (
              <span key={link.href} className="flex items-center gap-6">
                <a
                  href={link.href}
                  className="border-b-2 border-brand-red pb-1 font-bold text-brand-red hover:opacity-80"
                >
                  {link.label}
                </a>
                {index < SECTION_LINKS.length - 1 ? (
                  <span className="text-border" aria-hidden>
                    |
                  </span>
                ) : null}
              </span>
            ))}
          </nav>
          <div className="mt-8 h-px w-full bg-border opacity-30" aria-hidden />
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-5xl">
          <ShopVouchersSection />
        </Container>
      </Section>

      <ShopBundlesSection />

      <Section padding="sm">
        <Container className="max-w-5xl">
          <UsedGearInventorySection />
          <div className="mt-20">
            <ServiceHubLinks
              headingId="shop-related-heading"
              heading="שירותים קשורים"
              subheading="מהחנות לשירות מלא באולפן או באירוע."
              links={SHOP_RELATED}
              columns={2}
            />
          </div>
        </Container>
      </Section>
    </article>
  );
}
