import Link from "next/link";
import StudioExperienceSection from "@/components/booking/StudioExperienceSection";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  BLESSING_BENEFITS,
  BLESSING_POST_PRODUCTION_STEPS,
  BLESSING_TYPE_CARDS,
  BLESSING_WORKFLOW_OPTIONS,
} from "@/lib/data/blessings-hub-page";
import { getBlessingsSubLinks, getStudioService } from "@/lib/data/services";
import { mapBlessingTypeToHub } from "@/lib/data/studio-hub-mappers";
import { youtubeEmbedUrl, YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import HubDualCta from "@/components/marketing/HubDualCta";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getStudioService("blessings-hub");
const subLinks = getBlessingsSubLinks();

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const bookCta = resolveServiceBookCta("studio/blessings");

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const sectionTitleClass = "font-serif text-section-title font-semibold text-foreground";

export default function BlessingsHubPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  const blessingTypeLinks = BLESSING_TYPE_CARDS.map((card) =>
    mapBlessingTypeToHub(card, whatsappHref),
  );
  const trackLinks: HubLinkItem[] = subLinks.map((track) => ({
    href: track.href,
    title: track.title,
    description: track.description,
  }));

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      showBookCtaInHero={Boolean(bookCta)}
      bookHref={bookCta?.bookHref}
      bookLabel={bookCta?.bookLabel}
      valueFrame="ברכה מוקלטת - מתאימה גם למי שלא מברך מול קהל"
      pagePath="/studio/blessings"
      faqs={service.faqs}
      {...heroProps}
    >
      <Container className="space-y-16 py-12 sm:py-16">
        <ContextualIntroParagraph pathname="/studio/blessings" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="blessings-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            ברכה טובה יכולה להיות רגע מרכזי באירוע, אבל לא כולם מרגישים
            בנוח לברך בלייב מול קהל. הקלטה ועריכה מקצועית פותרת את זה: אתם
            רגועים ומרוכזים, והקהל שומע ברכה שנשמעת ברורה ומלוטשת.
          </p>
        </section>

        <ServiceHubLinks
          heading="סוגי ברכות שאנחנו מקליטים"
          subheading="ברכות מוקלטות - באולפן במודיעין או מהבית עם עריכה מקצועית."
          links={blessingTypeLinks}
          headingId="blessing-types-heading"
          columns={3}
        />

        <section aria-labelledby="why-studio-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-studio-heading"
              className={sectionTitleClass}
            >
              למה להקליט ברכה באולפן מקצועי?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BLESSING_BENEFITS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            כשאתם מקליטים אצלנו, אתם לא מקבלים רק ציוד טוב, אלא תוצאה שנשמעת
            מקצועית וברורה. ההבדל בין הקלטה ביתית לאולפן, כמו ההבדל
            בין תמונה מהטלפון לתמונה של צלם מקצועי.
          </p>
        </section>

        <section aria-labelledby="how-it-works-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="how-it-works-heading"
              className={sectionTitleClass}
            >
              איך זה עובד?
            </h2>
          </header>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {BLESSING_WORKFLOW_OPTIONS.map((option) => (
              <article
                key={option.id}
                id={option.id === "home" ? "home-recording" : undefined}
                className="scroll-mt-24 rounded-xl border border-border bg-surface p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {option.title}
                </h3>
                {option.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {option.bullets ? (
                  <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {option.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {option.note ? (
                  <p className="mt-4 text-xs font-medium text-brand-red">
                    {option.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="post-production-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="post-production-heading"
              className={sectionTitleClass}
            >
              מה קורה אחרי ההקלטה?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              אנחנו לא רק לוחצים REC, יש עבודה מקצועית שהופכת הקלטה רגילה לברכה
              מלוטשת:
            </p>
          </header>
          <ul className="mx-auto mt-8 max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
            {BLESSING_POST_PRODUCTION_STEPS.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="text-brand-red" aria-hidden>
                  •
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6 text-center sm:p-8"
          aria-labelledby="pricing-note-heading"
        >
          <h2
            id="pricing-note-heading"
            className={sectionTitleClass}
          >
            כמה זה עולה?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            כל המחירים כולל מע״מ. כל ברכה כוללת הקלטה, עריכה, מוזיקת רקע ומיקס
            מקצועי. הצעת מחיר מדויקת לפי סוג הברכה ואורכה, בוואטסאפ או במחירון
            האולפן.
          </p>
          <Link
            href="/studio/pricing"
            className={chipClass}
          >
            למחירון האולפן
          </Link>
        </section>

        <section className="max-w-3xl" aria-labelledby="audience-heading">
          <h2
            id="audience-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למי זה מתאים?
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <li>לא מרגישים בנוח לברך בלייב מול קהל, זה בשבילכם.</li>
            <li>רוצים שהברכה תישמע מקצועית וברורה, זה בשבילכם.</li>
            <li>רוצים לתרגל ולחזור על משפטים עד שזה מדויק, זה בשבילכם.</li>
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["blessings-hub"],
          )}
          mediaType="video"
          galleryLabel="הקלטת ברכות באולפן"
          videoTitle="הקלטת ברכות באולפן"
          videoHeadingId="blessings-video-heading"
          videoHeading="שמעו דוגמה מהאולפן"
        />

        <ServiceHubLinks
          heading="בחרו את סוג הברכה שלכם"
          subheading="מסלולים ממוקדים - אנחנו מלווים עד למסירה הסופית."
          links={trackLinks}
          headingId="blessings-tracks-heading"
          columns={3}
        />
          <ul className="mt-5 flex flex-wrap justify-center gap-3">
            <li>
              <Link
                href="/studio/recording-song-modiin"
                className={chipClass}
              >
                הקלטת שירים
              </Link>
            </li>
            <li>
              <Link
                href="/voucher"
                className={chipClass}
              >
                שובר מתנה
              </Link>
            </li>
          </ul>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="לפני שמתחילים"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="blessings-cta-heading"
        >
          <h2
            id="blessings-cta-heading"
            className={sectionTitleClass}
          >
            מוכנים להקליט את הברכה שלכם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            שלחו הודעה בוואטסאפ ונתאם פגישה באולפן או נשלח הנחיות להקלטה מהבית.
          </p>
          {bookCta ? (
            <HubDualCta
              className="mt-6"
              whatsappHref={whatsappHref}
              whatsappLabel="שליחה בוואטסאפ"
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
            />
          ) : (
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              שליחה בוואטסאפ
            </Button>
          )}
        </section>
              <StudioExperienceSection />
              <ServiceBlogStrip posts={getBlogPostsByServiceSlug("studio/blessings")} />
              <PageRelatedFooter pathname="/studio/blessings" />

            </Container>
    </ServicePageLayout>
  );
}
