import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  EVENTS_EQUIPMENT_FAQ_HERO_FEATURES,
  EVENTS_EQUIPMENT_FAQ_ITEMS,
  EVENTS_EQUIPMENT_FAQ_LINKS,
  EVENTS_EQUIPMENT_FAQ_TITLE,
} from "@/lib/data/events-equipment-faq-page";
import { getEventsService } from "@/lib/data/services";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("events-equipment");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const whatsappHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText(
    "שלום, יש לי שאלה על השכרת הגברה וציוד לאירוע",
  ),
  utm_source: "website",
  utm_campaign: "events_equipment_faq",
});

export default function EventsEquipmentFaqPageContent() {
  return (
    <ServicePageLayout
      title={EVENTS_EQUIPMENT_FAQ_TITLE}
      subtitle="הגברה לזמרים, DJ ואטרקציות - מחירים, צ'ק סאונד והזמנה מקוונת לפי קטגוריה."
      features={EVENTS_EQUIPMENT_FAQ_HERO_FEATURES}
      whatsappText="שלום, יש לי שאלה על השכרת הגברה לאירוע"
      utmCampaign="events_equipment_faq"
      ctaLabel="שאלתכם לא כאן? דברו איתנו"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/equipment/faq" className="max-w-3xl" />

        <ServiceHubLinks
          heading="לאן לפנות?"
          subheading="עמודי שירות והזמנה מקוונת."
          links={EVENTS_EQUIPMENT_FAQ_LINKS}
          headingId="events-equipment-faq-links"
        />

        <FAQAccordion
          items={[...EVENTS_EQUIPMENT_FAQ_ITEMS]}
          title="שאלות על הגברה וציוד"
          className="py-0"
        />

        <section className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-foreground">צריכים הצעת מחיר לציוד?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            שלחו תאריך, מיקום וסוג האירוע - נחזור עם חבילה מתאימה.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            פנייה בוואטסאפ
          </a>
        </section>

        <PageRelatedFooter pathname="/events/equipment/faq" />
      </div>
    </ServicePageLayout>
  );
}
