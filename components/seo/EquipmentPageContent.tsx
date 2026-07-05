import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  EQUIPMENT_ADDONS,
  EQUIPMENT_PACKAGE_ITEMS,
  EQUIPMENT_PREP_CHECKLIST,
  EQUIPMENT_RCF_VS_REGULAR,
  EQUIPMENT_SPECS,
  EQUIPMENT_USE_CASES,
  EQUIPMENT_WHY_QUALITY,
  EQUIPMENT_WHY_US,
} from "@/lib/data/equipment-page";
import { getEventsService } from "@/lib/data/services";
import { EQUIPMENT_VIDEO_GROUPS } from "@/lib/data/youtube-showcases";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("events-equipment");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function EquipmentPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      pagePath="/events/equipment"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/equipment" className="max-w-3xl" />

        {EQUIPMENT_VIDEO_GROUPS.map((group) => (
          <ShowcaseVideoSection
            key={group.id}
            headingId={`equip-videos-${group.id}`}
            heading={group.heading}
            videos={group.videos}
            initialVisible={group.videos.length}
          />
        ))}

        <section className="max-w-3xl" aria-labelledby="equip-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            מתכננים אירוע בגינה? באולם ללא הגברה? אנחנו מספקים מערכות הגברה
            מקצועיות עם צליל נקי ועוצמתי, לא צריך להיות טכנאי סאונד, אנחנו
            דואגים להכול.
          </p>
        </section>

        <section aria-labelledby="package-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="package-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה כלול בחבילת ההגברה?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {EQUIPMENT_PACKAGE_ITEMS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-quality-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-quality-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה האירוע שלכם צריך הגברה איכותית?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {EQUIPMENT_WHY_QUALITY.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5 text-center"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="specs-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="specs-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              פרטים טכניים
            </h2>
          </header>
          <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {EQUIPMENT_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="rounded-lg border border-border bg-surface px-4 py-3"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="ציוד הגברה בשטח"
          videoTitle="ציוד הגברה בשטח"
          className="px-0"
        />

        <section aria-labelledby="prep-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="prep-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה צריך להכין מצידכם?
            </h2>
          </header>
          <ul className="mx-auto mt-8 max-w-xl space-y-3">
            {EQUIPMENT_PREP_CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="rcf-heading">
          <h2
            id="rcf-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה לבחור בציוד RCF?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            RCF הוא מהמותגים המובילים בעולם. צליל נקי, חזק ואמין, מקצוענים
            בוחרים בהם. אנחנו לא מתפשרים על איכות, וגם אתם לא צריכים.
          </p>
        </section>

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              RCF מול ציוד רגיל
            </h2>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    ציוד רגיל
                  </th>
                  <th className="py-3 font-semibold text-brand-red">RCF מקצועי</th>
                </tr>
              </thead>
              <tbody>
                {EQUIPMENT_RCF_VS_REGULAR.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <th className="py-3 pe-4 font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="py-3 pe-4 text-muted-foreground">{row.bad}</td>
                    <td className="py-3 text-muted-foreground">{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="use-cases-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="use-cases-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מתאים לאירועים
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EQUIPMENT_USE_CASES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="pricing-note-heading">
          <h2
            id="pricing-note-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מחיר והזמנה
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            המחיר לפי משך (עד 10 שעות), מיקום ותאריך (שיא או רגיל). הצעה תוך 24
            שעות בוואטסאפ.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            תוספות אפשריות:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            {EQUIPMENT_ADDONS.map((addon) => (
              <li key={addon}>{addon}</li>
            ))}
          </ul>
        </section>

        <ServiceHubLinks
          headingId="equipment-related-heading"
          heading="שירותים משלימים"
          subheading="משלבים הגברה עם DJ ואטרקציות."
          links={[
            { href: "/events/equipment/singer-amplification", title: "הגברה לזמרים ולהקות", description: "מערכת מוניטור ומיקרופונים לזמרים ולהקות חיות." },
            { href: "/events/dj-events", title: "DJ מקצועי", description: "תקליטן לחתונה ואירועים, ניהול מוזיקלי מלא." },
            { href: "/events/attractions", title: "אטרקציות לאירועים", description: "עשן, זיקוקים, בועות וקונפטי עם מפעיל." },
            { href: "/events/wedding-attractions-packages", title: "חבילות לחתונה", description: "DJ + אטרקציות + הגברה במחיר מוזל." },
          ]}
        />

        <section aria-labelledby="why-us-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-us-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EQUIPMENT_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="השכרת הגברה לאירועים"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="equip-cta-heading"
        >
          <h2
            id="equip-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים לאירוע עם צליל מושלם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            צליל טוב הוא בסיס לאירוע מוצלח. טלפון:{" "}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="font-medium text-brand-red hover:underline"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            שליחה בוואטסאפ
          </a>
        </section>
              <PageRelatedFooter pathname="/events/equipment" />

            </div>
    </ServicePageLayout>
  );
}
